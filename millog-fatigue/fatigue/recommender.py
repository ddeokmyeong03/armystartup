"""
피로도 기반 자기개발 추천 엔진.
설문 Q12 교차분석 결과를 기반으로 피로도 수준별 추천 유형을 제공합니다.
"""

from typing import Optional
from fatigue.models import DailySchedule, DutyEntry, StudyRecommendation


# -------------------------------------------------------------------
# 피로도 → 자기개발 추천 매핑 (설문 Q12 교차분석 기반)
# key: (하한 포함, 상한 미포함)
# -------------------------------------------------------------------
FATIGUE_RECOMMENDATIONS: dict[tuple[float, float], dict] = {
    (0.0, 3.0): {
        "level": "양호",
        "content_type": "장시간 집중학습",
        "max_minutes": 120,
        "examples": "2시간 이상 강의, 자격증 문제풀이, 코딩 실습",
        "message": "컨디션이 좋습니다! 집중적인 자기개발을 추천합니다.",
    },
    (3.0, 6.0): {
        "level": "보통",
        "content_type": "일반 학습",
        "max_minutes": 60,
        "examples": "30분~1시간 강의, 독서, 요약 정리",
        "message": "적당한 학습이 가능합니다. 짧은 강의나 독서를 추천합니다.",
    },
    (6.0, 8.0): {
        "level": "높음",
        "content_type": "가벼운 콘텐츠",
        "max_minutes": 30,
        "examples": "15~30분 영상, 퀴즈, 단어 암기",
        "message": "피로가 높습니다. 가벼운 콘텐츠로 짧게 학습하세요.",
    },
    (8.0, 10.1): {
        "level": "매우 높음",
        "content_type": "휴식 권장",
        "max_minutes": 0,
        "examples": "자기개발 비추천, 충분한 휴식 후 내일 도전",
        "message": "피로도가 매우 높습니다. 오늘은 충분한 휴식을 취하세요.",
    },
}


def get_recommendation(fatigue_score: float) -> dict:
    """
    피로도 점수에 따른 자기개발 추천을 반환합니다.

    피로도 10.0(최대값)도 "매우 높음" 구간으로 처리됩니다.
    """
    for (low, high), rec in FATIGUE_RECOMMENDATIONS.items():
        if low <= fatigue_score < high:
            return rec
    # 클램핑 후 정확히 10.0인 경우
    return FATIGUE_RECOMMENDATIONS[(8.0, 10.1)]


def find_optimal_study_time(
    schedule: DailySchedule,
    target_date_duties: Optional[list[DutyEntry]] = None,
) -> Optional[str]:
    """
    하루 일과에서 피로도가 가장 낮은 시간대를 찾아 추천합니다.

    로직:
    1. 일과 시간(06:00~22:00)을 1시간 단위로 슬라이싱
    2. 근무가 없는 시간대 중 피로도가 낮은 구간을 탐색
    3. 가장 긴 연속 가용 구간을 추천

    반환: "14:00~16:00" 형식 문자열, 없으면 None
    """
    # 근무 시간 구간 목록 수집 (선형화)
    busy_hours: set[int] = set()
    for duty in schedule.duties:
        if duty.start_hour > duty.end_hour:
            # 자정을 넘기는 구간
            h = int(duty.start_hour)
            while h < 24:
                busy_hours.add(h)
                h += 1
            h = 0
            while h < int(duty.end_hour):
                busy_hours.add(h)
                h += 1
        else:
            for h in range(int(duty.start_hour), int(duty.end_hour)):
                busy_hours.add(h)

    # 수면 시간 구간도 제외
    for sb in schedule.sleep_blocks:
        if sb.start_hour > sb.end_hour:
            h = int(sb.start_hour)
            while h < 24:
                busy_hours.add(h)
                h += 1
            h = 0
            while h < int(sb.end_hour):
                busy_hours.add(h)
                h += 1
        else:
            for h in range(int(sb.start_hour), int(sb.end_hour)):
                busy_hours.add(h)

    # 06:00~22:00 사이의 가용 시간대 탐색
    available: list[int] = [h for h in range(6, 22) if h not in busy_hours]
    if not available:
        return None

    # 가장 긴 연속 구간 찾기
    best_start: int = available[0]
    best_len: int = 1
    cur_start: int = available[0]
    cur_len: int = 1

    for i in range(1, len(available)):
        if available[i] == available[i - 1] + 1:
            cur_len += 1
        else:
            if cur_len > best_len:
                best_start = cur_start
                best_len = cur_len
            cur_start = available[i]
            cur_len = 1

    if cur_len > best_len:
        best_start = cur_start
        best_len = cur_len

    best_end = best_start + best_len
    return f"{best_start:02d}:00~{best_end:02d}:00"


def build_study_recommendation(
    schedule: DailySchedule,
    fatigue_score: float,
) -> StudyRecommendation:
    """
    피로도 점수와 하루 일과를 기반으로 자기개발 추천 결과를 생성합니다.
    """
    rec = get_recommendation(fatigue_score)
    optimal_time = find_optimal_study_time(schedule)

    # 가용 시간 계산 (분 → 시간)
    available_hours = rec["max_minutes"] / 60.0

    return StudyRecommendation(
        fatigue_score=fatigue_score,
        available_hours=available_hours,
        recommended_content_type=rec["content_type"],
        recommended_duration_minutes=rec["max_minutes"],
        optimal_start_time=optimal_time,
        message=rec["message"],
    )
