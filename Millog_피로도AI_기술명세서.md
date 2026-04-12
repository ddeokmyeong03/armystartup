# Millog 근무 피로도 계산 AI — 기술 명세서 (Claude Code용)

## 프로젝트 개요

군 장병의 근무 유형, 시간대, 수면 패턴을 입력받아 일일 피로도(0~10)를 계산하고,
피로도에 따른 자기개발 가능 여부와 최적 학습 시간을 추천하는 Python 모듈을 개발합니다.

---

## 1. 프로젝트 구조

```
millog-fatigue/
├── fatigue/
│   ├── __init__.py
│   ├── calculator.py        # 핵심 피로도 계산 엔진
│   ├── models.py             # 데이터 모델 (Pydantic)
│   ├── constants.py          # 근무 유형별 피로지수, 시간대 가중치 등 상수
│   ├── recommender.py        # 피로도 기반 자기개발 추천 엔진
│   └── predictor.py          # 주간 피로도 예측 (향후 확장)
├── api/
│   ├── __init__.py
│   └── routes.py             # FastAPI 라우터
├── tests/
│   ├── test_calculator.py    # 피로도 계산 단위 테스트
│   ├── test_recommender.py   # 추천 엔진 테스트
│   └── test_api.py           # API 통합 테스트
├── data/
│   └── survey_validation.json # 설문 검증 데이터 (22명)
├── main.py                   # FastAPI 앱 진입점
├── requirements.txt
└── README.md
```

---

## 2. 핵심 공식

### 2.1 일일 피로도 공식

```
F = clamp( Σ(Di × Ti × hi) × C + P - R, 0, 10 )
```

**변수 정의:**

| 변수 | 설명 | 단위 |
|------|------|------|
| F | 최종 일일 피로도 | 0~10 (float) |
| Di | i번째 근무의 유형별 피로지수 | /시간 (float) |
| Ti | i번째 근무의 시간대 가중치 | 무차원 (float) |
| hi | i번째 근무의 수행 시간 | 시간 (float) |
| C | 연속근무 계수 | 무차원 (float) |
| P | 수면 중단 페널티 | 점수 (float) |
| R | 수면 회복량 | 점수 (float) |

### 2.2 각 변수의 산출 방법

#### Di: 근무 유형별 피로지수 (시간당)

36사단 장병 22명 설문 Q13 결과 기반 보정값입니다.

```python
DUTY_FATIGUE_INDEX = {
    "gop_gp":           2.63,   # GOP/GP 경계근무 (Q13 평균 4.50/5)
    "guard_duty":       2.45,   # 당직근무 (Q13 평균 4.27/5)
    "field_training":   2.33,   # 야외 훈련 (Q13 평균 4.11/5)
    "guard_post":       2.25,   # 일반 경계근무/초소 (Q13 평균 4.00/5)
    "night_watch":      2.16,   # 불침번 (Q13 평균 3.88/5)
    "cctv_surveillance":2.00,   # CCTV/정찰감시 (Q13 평균 3.67/5)
    "admin_work":       0.50,   # 일반 일과 (행정/정비)
    "indoor_training":  0.80,   # 실내/이론 교육
    "none":             0.00,   # 근무 없음 (일과 외 시간)
}
```

변환 공식: `피로지수 = (Q13_평균 - 1) / (5 - 1) × 3.0`

#### Ti: 시간대 가중치

설문 Q10-11 교차분석 결과 기반 (야간 피로도 평균 8.13 vs 주간 6.50).

```python
TIME_WEIGHT = {
    "day":      0.80,   # 06:00~18:00
    "evening":  0.90,   # 18:00~22:00
    "night":    1.00,   # 22:00~02:00 (기준값)
    "dawn":     1.15,   # 02:00~06:00 (Q7: 야간 경계 직후 최악 45.5%)
}
```

시간대 판별 함수:
```python
def get_time_weight(hour: int) -> float:
    """시각(0~23)을 입력받아 시간대 가중치를 반환"""
    if 6 <= hour < 18:
        return 0.80   # day
    elif 18 <= hour < 22:
        return 0.90   # evening
    elif 22 <= hour or hour < 2:
        return 1.00   # night
    else:  # 2 <= hour < 6
        return 1.15   # dawn
```

근무가 여러 시간대에 걸치는 경우, 시간대별로 분할 계산해야 합니다.

**예시:** 경계근무 22:00~02:00 (4시간)
- 22:00~02:00 → night 가중치 1.00 × 4시간
- 만약 22:00~04:00 (6시간)이면:
  - 22:00~02:00 → night 1.00 × 4시간
  - 02:00~04:00 → dawn 1.15 × 2시간

#### C: 연속근무 계수

```python
def calc_consecutive_factor(consecutive_days: int) -> float:
    """연속 근무 일수에 따른 피로 누적 계수"""
    return min(1.0 + 0.15 * (consecutive_days - 1), 2.0)
```

| 연속 일수 | C 값 |
|---------|------|
| 1일 | 1.00 |
| 2일 | 1.15 |
| 3일 | 1.30 |
| 5일 | 1.60 |
| 8일+ | 2.00 (상한) |

#### P: 수면 중단 페널티

설문 Q14 결과: 분할수면 시 "상당히~매우 떨어짐" 86.4%.
불침번 등으로 수면 도중 깨어난 경우 추가 피로를 부여합니다.

```python
SLEEP_INTERRUPTION_PENALTY = 3.0  # 1회 수면 중단당 페널티

def calc_sleep_penalty(interruptions: int) -> float:
    """수면 중 근무로 인해 깨어난 횟수 × 페널티"""
    return interruptions * SLEEP_INTERRUPTION_PENALTY
```

| 상황 | 중단 횟수 | P 값 |
|------|---------|------|
| 불침번 1회로 수면 중단 | 1 | 3.0 |
| 2교대 경계 (2번 깨어남) | 2 | 6.0 |
| 수면 전/후에만 근무 | 0 | 0.0 |

**판별 기준:** 수면 시작 시각과 종료 시각 사이에 근무가 있으면 수면 중단으로 간주.

#### R: 수면 회복량

설문 Q14 가중평균 회복저하율 46.7% 반영.

```python
SLEEP_QUALITY = {
    "continuous_6plus": 1.00,   # 연속 6시간 이상
    "split":            0.53,   # 분할 수면 (회복률 53.3%)
    "under_4":          0.35,   # 4시간 미만
}

def calc_recovery(sleep_hours: float, sleep_type: str) -> float:
    """수면 시간 × 수면질 계수"""
    quality = SLEEP_QUALITY.get(sleep_type, 0.53)
    return sleep_hours * quality
```

수면 유형 자동 판별:
```python
def determine_sleep_type(sleep_blocks: list[tuple[float, float]]) -> str:
    """
    sleep_blocks: [(시작시각, 종료시각), ...] 형태
    예: [(22.0, 2.0), (4.0, 6.0)] → 분할 수면
    예: [(22.0, 6.0)] → 연속 수면
    """
    if len(sleep_blocks) > 1:
        return "split"
    total_hours = sum(calc_block_hours(s, e) for s, e in sleep_blocks)
    if total_hours < 4:
        return "under_4"
    return "continuous_6plus" if total_hours >= 6 else "split"
```

---

## 3. 데이터 모델 (Pydantic)

```python
from pydantic import BaseModel, Field
from typing import Optional
from enum import Enum

class DutyType(str, Enum):
    GOP_GP = "gop_gp"
    GUARD_DUTY = "guard_duty"
    FIELD_TRAINING = "field_training"
    GUARD_POST = "guard_post"
    NIGHT_WATCH = "night_watch"
    CCTV_SURVEILLANCE = "cctv_surveillance"
    ADMIN_WORK = "admin_work"
    INDOOR_TRAINING = "indoor_training"
    NONE = "none"

class DutyEntry(BaseModel):
    """개별 근무/일과 항목"""
    duty_type: DutyType
    start_hour: float = Field(ge=0, lt=24, description="시작 시각 (0~23.99)")
    end_hour: float = Field(ge=0, lt=24, description="종료 시각 (0~23.99)")
    # 자정을 넘기는 경우: start_hour=22.0, end_hour=2.0 → 4시간

class SleepBlock(BaseModel):
    """수면 구간"""
    start_hour: float = Field(ge=0, lt=24)
    end_hour: float = Field(ge=0, lt=24)

class DailySchedule(BaseModel):
    """하루 일과 전체"""
    duties: list[DutyEntry] = Field(description="당일 근무/일과 목록")
    sleep_blocks: list[SleepBlock] = Field(description="수면 구간 목록")
    consecutive_duty_days: int = Field(default=1, ge=1, description="연속 근무 일수")

class FatigueResult(BaseModel):
    """피로도 계산 결과"""
    fatigue_score: float = Field(ge=0, le=10, description="최종 피로도 (0~10)")
    fatigue_level: str = Field(description="피로 수준 (양호/보통/높음/매우높음)")
    study_recommendation: str = Field(description="자기개발 추천 유형")
    max_study_minutes: int = Field(description="추천 최대 학습 시간 (분)")
    details: dict = Field(description="세부 계산 내역")

class StudyRecommendation(BaseModel):
    """자기개발 추천 결과"""
    fatigue_score: float
    available_hours: float = Field(description="자기개발 가용 시간")
    recommended_content_type: str = Field(description="추천 콘텐츠 유형")
    recommended_duration_minutes: int
    optimal_start_time: Optional[str] = Field(description="최적 학습 시작 시각")
    message: str = Field(description="사용자에게 보여줄 메시지")
```

---

## 4. 핵심 계산 엔진 (calculator.py)

### 4.1 메인 함수 시그니처

```python
def calculate_fatigue(schedule: DailySchedule) -> FatigueResult:
    """
    하루 일과를 입력받아 피로도를 계산합니다.
    
    처리 순서:
    1. 각 근무 항목에 대해 Di × Ti × hi 계산 (시간대 분할 처리 포함)
    2. 모든 근무의 피로 합산
    3. 연속근무 계수 C 적용
    4. 수면 중단 페널티 P 계산
    5. 수면 회복량 R 계산
    6. 최종 피로도 = (합산 × C) + P - R → 0~10 클램핑
    7. 피로도 수준 및 자기개발 추천 생성
    """
```

### 4.2 시간대 분할 계산 함수

근무가 여러 시간대에 걸치는 경우를 처리합니다.

```python
def calc_duty_fatigue(duty: DutyEntry) -> float:
    """
    단일 근무의 피로 기여도를 계산합니다.
    시간대를 분할하여 각 구간별로 Di × Ti × hi를 계산합니다.
    
    예시: guard_post 21:00~01:00
    → evening(21:00~22:00): 2.25 × 0.90 × 1h = 2.025
    → night(22:00~01:00):   2.25 × 1.00 × 3h = 6.75
    → 합계: 8.775
    """
```

**자정 넘김 처리:**
- start_hour > end_hour인 경우 자정을 넘긴 것으로 처리
- 예: start=22, end=2 → 22~24(2시간) + 0~2(2시간) = 4시간

### 4.3 수면 중단 판별 함수

```python
def count_sleep_interruptions(
    sleep_blocks: list[SleepBlock],
    duties: list[DutyEntry]
) -> int:
    """
    수면 구간과 근무 시간을 비교하여 수면 중단 횟수를 계산합니다.
    
    판별 로직:
    1. 수면 블록이 2개 이상이면 → 중단 횟수 = len(sleep_blocks) - 1
    2. 수면 블록 사이에 근무가 있는지 확인하여 검증
    
    예시:
    sleep: [(22, 2), (4, 6)] → 수면이 2개 구간 = 1회 중단
    duty: [(2, 4)] → 02:00~04:00 불침번이 수면 중간에 있음 → 확인
    """
```

---

## 5. 추천 엔진 (recommender.py)

### 5.1 피로도 → 자기개발 추천 매핑

설문 Q12 교차분석 결과 기반:

```python
FATIGUE_RECOMMENDATIONS = {
    (0, 3): {
        "level": "양호",
        "content_type": "장시간 집중학습",
        "max_minutes": 120,
        "examples": "2시간 이상 강의, 자격증 문제풀이, 코딩 실습",
    },
    (3, 6): {
        "level": "보통",
        "content_type": "일반 학습",
        "max_minutes": 60,
        "examples": "30분~1시간 강의, 독서, 요약 정리",
    },
    (6, 8): {
        "level": "높음",
        "content_type": "가벼운 콘텐츠",
        "max_minutes": 30,
        "examples": "15~30분 영상, 퀴즈, 단어 암기",
    },
    (8, 10): {
        "level": "매우 높음",
        "content_type": "휴식 권장",
        "max_minutes": 0,
        "examples": "자기개발 비추천, 충분한 휴식 후 내일 도전",
    },
}

def get_recommendation(fatigue_score: float) -> dict:
    """피로도 점수에 따른 자기개발 추천을 반환"""
    for (low, high), rec in FATIGUE_RECOMMENDATIONS.items():
        if low <= fatigue_score < high:
            return rec
    return FATIGUE_RECOMMENDATIONS[(8, 10)]  # 10점은 매우 높음
```

### 5.2 최적 학습 시간 추천

```python
def find_optimal_study_time(
    schedule: DailySchedule,
    target_date_duties: list[DutyEntry]  # 내일 근무 예정
) -> Optional[str]:
    """
    하루 일과에서 피로도가 가장 낮은 시간대를 찾아 추천합니다.
    
    로직:
    1. 일과 시간(06:00~22:00)을 1시간 단위로 슬라이싱
    2. 각 시간대에서의 누적 피로도를 시뮬레이션
    3. 피로도가 6 미만인 시간대 중 가장 긴 연속 구간을 추천
    
    반환: "14:00~16:00 (예상 피로도 3.2, 2시간 학습 가능)"
    """
```

---

## 6. API 엔드포인트 (FastAPI)

```python
from fastapi import FastAPI

app = FastAPI(title="Millog Fatigue Calculator API", version="1.0.0")

@app.post("/api/fatigue/calculate", response_model=FatigueResult)
async def calculate(schedule: DailySchedule):
    """일일 피로도 계산"""

@app.post("/api/fatigue/recommend", response_model=StudyRecommendation)
async def recommend(schedule: DailySchedule):
    """피로도 기반 자기개발 추천"""

@app.post("/api/fatigue/weekly-predict")
async def weekly_predict(weekly_duties: list[DailySchedule]):
    """주간 피로도 예측 (향후 확장)"""

@app.get("/api/fatigue/duty-types")
async def get_duty_types():
    """사용 가능한 근무 유형 목록 반환"""
```

---

## 7. 테스트 케이스

설문 실데이터를 기반으로 한 검증 케이스입니다. 모든 테스트를 통과해야 합니다.

### 7.1 Case 1: 불침번 야간 (실측 피로도 8.5)

```python
def test_night_watch_case():
    schedule = DailySchedule(
        duties=[
            DutyEntry(duty_type="admin_work", start_hour=9.0, end_hour=18.0),
            DutyEntry(duty_type="night_watch", start_hour=2.0, end_hour=4.0),
        ],
        sleep_blocks=[
            SleepBlock(start_hour=22.0, end_hour=2.0),
            SleepBlock(start_hour=4.0, end_hour=6.0),
        ],
        consecutive_duty_days=1,
    )
    result = calculate_fatigue(schedule)
    # 기대값: 약 9.45 (실측 8.5와 근접, 오차 ±2 이내)
    assert 6.5 <= result.fatigue_score <= 10.0
    assert result.fatigue_level in ["높음", "매우 높음"]
```

**수동 계산 검증:**
```
행정: 0.50 × 0.80 × 9h = 3.60
불침번: 2.16 × 1.15 × 2h = 4.97
연속근무: × 1.0
수면중단: + 3.0 (1회)
수면회복: - (4h × 0.53) = -2.12
합계: 3.60 + 4.97 + 3.0 - 2.12 = 9.45
```

### 7.2 Case 2: 야간 경계근무 (실측 피로도 10)

```python
def test_night_guard_case():
    schedule = DailySchedule(
        duties=[
            DutyEntry(duty_type="admin_work", start_hour=9.0, end_hour=18.0),
            DutyEntry(duty_type="guard_post", start_hour=22.0, end_hour=2.0),
        ],
        sleep_blocks=[
            SleepBlock(start_hour=2.5, end_hour=6.0),
        ],
        consecutive_duty_days=1,
    )
    result = calculate_fatigue(schedule)
    # 기대값: 10.0 (클램핑)
    assert result.fatigue_score >= 9.0
    assert result.fatigue_level == "매우 높음"
    assert result.max_study_minutes == 0
```

**수동 계산 검증:**
```
행정: 0.50 × 0.80 × 9h = 3.60
경계(night): 2.25 × 1.00 × 2h = 4.50
경계(dawn): 2.25 × 1.15 × 2h = 5.18
수면중단: + 3.0
수면회복: - (3.5h × 0.53) = -1.86
합계: 3.60 + 4.50 + 5.18 + 3.0 - 1.86 = 14.42 → 클램핑 → 10.0
```

### 7.3 Case 3: 주간 CCTV (실측 피로도 2)

```python
def test_daytime_cctv_case():
    schedule = DailySchedule(
        duties=[
            DutyEntry(duty_type="cctv_surveillance", start_hour=9.0, end_hour=12.0),
            DutyEntry(duty_type="admin_work", start_hour=13.0, end_hour=18.0),
        ],
        sleep_blocks=[
            SleepBlock(start_hour=22.0, end_hour=6.0),
        ],
        consecutive_duty_days=1,
    )
    result = calculate_fatigue(schedule)
    # 기대값: 약 0.2 (실측 2와 같은 "양호" 구간)
    assert result.fatigue_score <= 4.0
    assert result.fatigue_level == "양호"
    assert result.max_study_minutes >= 60
```

### 7.4 Case 4: 연속 3일 경계근무

```python
def test_consecutive_guard_duty():
    schedule = DailySchedule(
        duties=[
            DutyEntry(duty_type="admin_work", start_hour=9.0, end_hour=18.0),
            DutyEntry(duty_type="guard_post", start_hour=22.0, end_hour=2.0),
        ],
        sleep_blocks=[
            SleepBlock(start_hour=2.5, end_hour=6.0),
        ],
        consecutive_duty_days=3,  # 3일째
    )
    result = calculate_fatigue(schedule)
    # 연속근무 계수 1.30 적용 → 피로도 더 높아야 함
    assert result.fatigue_score >= 9.5
```

### 7.5 Case 5: 근무 없는 날 (휴일)

```python
def test_rest_day():
    schedule = DailySchedule(
        duties=[],
        sleep_blocks=[
            SleepBlock(start_hour=23.0, end_hour=8.0),
        ],
        consecutive_duty_days=1,
    )
    result = calculate_fatigue(schedule)
    # 근무 없음, 충분한 수면 → 피로도 0에 가까움
    assert result.fatigue_score <= 1.0
    assert result.fatigue_level == "양호"
    assert result.max_study_minutes >= 120
```

---

## 8. 개발 요구사항

### 8.1 기술 스택

- Python 3.11+
- FastAPI
- Pydantic v2
- pytest (테스트)
- uvicorn (서버)

### 8.2 requirements.txt

```
fastapi>=0.104.0
pydantic>=2.0.0
uvicorn>=0.24.0
pytest>=7.4.0
httpx>=0.25.0
```

### 8.3 코드 품질 요구사항

- 모든 함수에 docstring 작성 (한국어)
- 타입 힌트 100% 적용
- 테스트 커버리지 90% 이상
- 자정 넘김 시간 처리 엣지 케이스 반드시 처리
- 모든 계산에 중간 과정을 details 딕셔너리에 기록 (디버깅용)

### 8.4 개발 순서

1. `constants.py` — 상수 정의
2. `models.py` — Pydantic 모델 정의
3. `calculator.py` — 핵심 피로도 계산 엔진 (가장 중요)
4. `recommender.py` — 추천 엔진
5. `tests/test_calculator.py` — 5개 테스트 케이스 통과 확인
6. `api/routes.py` — FastAPI 라우터
7. `main.py` — 앱 실행

---

## 9. 설문 검증 데이터

`data/survey_validation.json`에 저장할 실데이터입니다.
계산 결과가 이 데이터의 실측 피로도와 오차 ±2 이내여야 합니다.

```json
[
    {
        "id": 1,
        "description": "불침번 야간 (02:00~04:00)",
        "duties": [
            {"duty_type": "admin_work", "start_hour": 9.0, "end_hour": 18.0},
            {"duty_type": "night_watch", "start_hour": 2.0, "end_hour": 4.0}
        ],
        "sleep_blocks": [
            {"start_hour": 22.0, "end_hour": 2.0},
            {"start_hour": 4.0, "end_hour": 6.0}
        ],
        "consecutive_duty_days": 1,
        "actual_fatigue": 8.5,
        "actual_can_study": "완전 불가능"
    },
    {
        "id": 2,
        "description": "야간 경계근무 (22:00~02:00)",
        "duties": [
            {"duty_type": "admin_work", "start_hour": 9.0, "end_hour": 18.0},
            {"duty_type": "guard_post", "start_hour": 22.0, "end_hour": 2.0}
        ],
        "sleep_blocks": [
            {"start_hour": 2.5, "end_hour": 6.0}
        ],
        "consecutive_duty_days": 1,
        "actual_fatigue": 10.0,
        "actual_can_study": "완전 불가능"
    },
    {
        "id": 3,
        "description": "주간 CCTV (09:00~12:00)",
        "duties": [
            {"duty_type": "cctv_surveillance", "start_hour": 9.0, "end_hour": 12.0},
            {"duty_type": "admin_work", "start_hour": 13.0, "end_hour": 18.0}
        ],
        "sleep_blocks": [
            {"start_hour": 22.0, "end_hour": 6.0}
        ],
        "consecutive_duty_days": 1,
        "actual_fatigue": 2.0,
        "actual_can_study": "충분히 가능"
    },
    {
        "id": 4,
        "description": "당직근무 야간 (22:30~08:00)",
        "duties": [
            {"duty_type": "guard_duty", "start_hour": 22.5, "end_hour": 8.0}
        ],
        "sleep_blocks": [
            {"start_hour": 8.5, "end_hour": 12.0}
        ],
        "consecutive_duty_days": 1,
        "actual_fatigue": 9.0,
        "actual_can_study": "완전 불가능"
    },
    {
        "id": 5,
        "description": "야간 CCTV (야간)",
        "duties": [
            {"duty_type": "admin_work", "start_hour": 9.0, "end_hour": 18.0},
            {"duty_type": "cctv_surveillance", "start_hour": 22.0, "end_hour": 2.0}
        ],
        "sleep_blocks": [
            {"start_hour": 2.5, "end_hour": 6.0}
        ],
        "consecutive_duty_days": 1,
        "actual_fatigue": 9.0,
        "actual_can_study": "거의 불가능"
    }
]
```

---

## 10. 향후 확장 계획

### 10.1 피로도 예측 (predictor.py)

2~3주 사용 데이터 축적 후, 주간 단위 피로도 예측 기능:
- 입력: 다음 주 근무 스케줄
- 출력: 일별 예상 피로도 + 최적 자기개발 시간대

### 10.2 개인화 보정

사용자가 매일 자가보고 피로도(0~10)를 입력하면:
- 알고리즘 산출값과 자가보고값의 차이를 학습
- 개인별 근무 유형 피로지수를 보정 (회귀분석)
- 목표: 상관계수 r ≥ 0.7

### 10.3 React Native 연동

이 Python 모듈은 FastAPI로 서빙되며, React Native 앱에서 HTTP 요청으로 호출합니다.

```
[React Native App] → POST /api/fatigue/calculate → [FastAPI 서버] → FatigueResult
```

---

*이 명세서를 Claude Code에 전달하면, 위 구조대로 근무 피로도 계산 AI를 구현할 수 있습니다.*
*설문 데이터 22명 + 인터뷰 3명의 결과가 모든 상수와 검증 케이스에 반영되어 있습니다.*
