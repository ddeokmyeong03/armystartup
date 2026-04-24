"""
FastAPI 라우터 — 피로도 계산 및 자기개발 추천 엔드포인트.
"""

from fastapi import APIRouter
from fatigue.models import DailySchedule, FatigueResult, StudyRecommendation
from fatigue.calculator import calculate_fatigue
from fatigue.recommender import build_study_recommendation
from fatigue.predictor import predict_weekly_fatigue, predict_fatigue_ml
from fatigue.constants import DUTY_FATIGUE_INDEX

router = APIRouter(prefix="/api/fatigue", tags=["fatigue"])


@router.post("/calculate", response_model=FatigueResult)
async def calculate(schedule: DailySchedule) -> FatigueResult:
    """
    일일 피로도를 계산합니다 (규칙 기반 + ML 앙상블).

    ML 모델이 존재하면 규칙 기반 50% + ML 50% 앙상블을 적용합니다.
    모델이 없으면 규칙 기반 단독 결과를 반환합니다.
    """
    result = calculate_fatigue(schedule)

    # ML 앙상블: 첫 번째 근무 항목 기준으로 ML 예측 적용
    if schedule.duties:
        primary = schedule.duties[0]
        sleep_hours = sum(
            (sb.end_hour - sb.start_hour) if sb.end_hour >= sb.start_hour
            else (24 - sb.start_hour + sb.end_hour)
            for sb in schedule.sleep_blocks
        )
        sleep_type = "continuous_6plus" if sleep_hours >= 6 else ("under_4" if sleep_hours < 4 else "split")

        # 시간대 결정 (근무 시작 시각 기준)
        h = primary.start_hour
        if 6.0 <= h < 18.0:
            time_zone = "day"
        elif 18.0 <= h < 22.0:
            time_zone = "evening"
        elif h >= 22.0 or h < 2.0:
            time_zone = "night"
        else:
            time_zone = "dawn"

        ml_score = predict_fatigue_ml(
            duty_type=primary.duty_type.value,
            duty_hours=abs(primary.end_hour - primary.start_hour) if primary.end_hour > primary.start_hour
                       else (24 - primary.start_hour + primary.end_hour),
            time_zone=time_zone,
            consecutive_days=schedule.consecutive_duty_days,
            sleep_hours=sleep_hours,
            sleep_type=sleep_type,
            interruptions=max(0, len(schedule.sleep_blocks) - 1),
        )

        if ml_score is not None:
            ensemble_score = round(0.5 * result.fatigue_score + 0.5 * ml_score, 2)
            # fatigue_score만 교체 (나머지 세부 내역은 규칙 기반 유지)
            result = FatigueResult(
                fatigue_score=ensemble_score,
                fatigue_level=result.fatigue_level,
                study_recommendation=result.study_recommendation,
                max_study_minutes=result.max_study_minutes,
                details={**result.details, "ml_score": ml_score, "rule_score": result.fatigue_score, "method": "ensemble"},
            )

    return result


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
    주간 피로도를 예측합니다.

    일별 스케줄 목록을 입력받아 각 날의 예상 피로도와 자기개발 추천을 반환합니다.
    """
    return predict_weekly_fatigue(weekly_duties)


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
