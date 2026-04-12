"""
FastAPI 라우터 — 피로도 계산 및 자기개발 추천 엔드포인트.
"""

from fastapi import APIRouter
from fatigue.models import DailySchedule, FatigueResult, StudyRecommendation
from fatigue.calculator import calculate_fatigue
from fatigue.recommender import build_study_recommendation
from fatigue.constants import DUTY_FATIGUE_INDEX

router = APIRouter(prefix="/api/fatigue", tags=["fatigue"])


@router.post("/calculate", response_model=FatigueResult)
async def calculate(schedule: DailySchedule) -> FatigueResult:
    """
    일일 피로도를 계산합니다.

    근무 유형, 시간대, 수면 패턴, 연속 근무 일수를 입력받아
    0~10 범위의 피로도 점수와 자기개발 추천 정보를 반환합니다.
    """
    return calculate_fatigue(schedule)


@router.post("/recommend", response_model=StudyRecommendation)
async def recommend(schedule: DailySchedule) -> StudyRecommendation:
    """
    피로도 기반 자기개발 추천을 반환합니다.

    피로도 계산 후 최적 학습 시간대와 추천 콘텐츠 유형을 제공합니다.
    """
    result = calculate_fatigue(schedule)
    return build_study_recommendation(schedule, result.fatigue_score)


@router.post("/weekly-predict")
async def weekly_predict(weekly_duties: list[DailySchedule]) -> list[dict]:
    """
    주간 피로도를 예측합니다 (향후 확장 기능).

    일별 스케줄 목록을 입력받아 각 날의 예상 피로도를 반환합니다.
    """
    results = []
    for i, daily_schedule in enumerate(weekly_duties):
        result = calculate_fatigue(daily_schedule)
        results.append({
            "day": i + 1,
            "fatigue_score": result.fatigue_score,
            "fatigue_level": result.fatigue_level,
            "max_study_minutes": result.max_study_minutes,
        })
    return results


@router.get("/duty-types")
async def get_duty_types() -> dict:
    """
    사용 가능한 근무 유형 목록과 시간당 피로지수를 반환합니다.
    """
    return {
        "duty_types": [
            {"type": k, "fatigue_index_per_hour": v}
            for k, v in DUTY_FATIGUE_INDEX.items()
        ]
    }
