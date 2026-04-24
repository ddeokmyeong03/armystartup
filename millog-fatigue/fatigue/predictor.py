"""
주간 피로도 예측 모듈 (향후 확장).

2~3주 사용 데이터 축적 후 주간 단위 피로도 예측 기능 제공 예정.
현재는 단순 일별 계산의 집계로 구현됩니다.
"""

from fatigue.models import DailySchedule
from fatigue.calculator import calculate_fatigue
import joblib
import pandas as pd
import os


def predict_weekly_fatigue(weekly_schedules: list[DailySchedule]) -> list[dict]:
    """
    주간 스케줄을 입력받아 일별 예상 피로도를 반환합니다.

    향후 확장:
    - 개인별 피로도 패턴 학습
    - 회복 트렌드 분석
    - 최적 자기개발 요일/시간 추천

    반환: [{"day": 1, "fatigue_score": 3.2, "max_study_minutes": 60}, ...]
    """
    results = []
    for i, schedule in enumerate(weekly_schedules):
        result = calculate_fatigue(schedule)
        results.append({
            "day": i + 1,
            "fatigue_score": result.fatigue_score,
            "fatigue_level": result.fatigue_level,
            "max_study_minutes": result.max_study_minutes,
            "study_recommendation": result.study_recommendation,
        })
    return results

MODEL_PATH = os.path.join(os.path.dirname(__file__), '..', 'models', 'fatigue_ml_model.joblib')
_ml_pipeline = None

def _load_model():
    global _ml_pipeline
    if _ml_pipeline is None and os.path.exists(MODEL_PATH):
        _ml_pipeline = joblib.load(MODEL_PATH)
    return _ml_pipeline

def predict_fatigue_ml(duty_type: str, duty_hours: float, time_zone: str,
                       consecutive_days: int, sleep_hours: float,
                       sleep_type: str, interruptions: int,
                       rank: str = "일병", branch: str = "육군") -> float | None:
    """ML 모델로 피로도 예측. 모델 없으면 None 반환 (규칙 기반 폴백용)"""
    model = _load_model()
    if model is None:
        return None

    DUTY_FATIGUE_INDEX = {
        "gop_gp": 2.63, "guard_duty": 2.45, "field_training": 2.33,
        "guard_post": 2.25, "night_watch": 2.16, "cctv_surveillance": 2.00,
        "indoor_training": 0.80, "admin_work": 0.50, "none": 0.00,
    }
    TIME_WEIGHT = {"day": 0.80, "evening": 0.90, "night": 1.00, "dawn": 1.15}
    SLEEP_QUALITY = {"continuous_6plus": 1.00, "split": 0.53, "under_4": 0.35}

    di = DUTY_FATIGUE_INDEX.get(duty_type, 0.0)
    ti = TIME_WEIGHT.get(time_zone, 0.80)
    c = min(1.0 + 0.15 * (consecutive_days - 1), 2.0)
    quality = SLEEP_QUALITY.get(sleep_type, 0.53)

    row = pd.DataFrame([{
        "duty_type": duty_type,
        "time_zone": time_zone,
        "sleep_type": sleep_type,
        "rank": rank,
        "branch": branch,
        "duty_hours": duty_hours,
        "consecutive_days": consecutive_days,
        "sleep_hours": sleep_hours,
        "interruptions": interruptions,
        "duty_fatigue": di * ti * duty_hours,
        "consecutive_factor": c,
        "sleep_recovery": sleep_hours * quality,
        "sleep_penalty": interruptions * 3.0,
        "is_night_dawn": float(time_zone in ["night", "dawn"]),
        "sleep_deficit": float(sleep_hours < 6),
    }])

    pred = model.predict(row)[0]
    return float(max(0.0, min(10.0, pred)))


# api/routes.py의 /calculate 엔드포인트에서:
# rule_score = calculate_fatigue(schedule).fatigue_score
# ml_score = predict_fatigue_ml(...)  # ML 예측
# final_score = (0.5 * rule_score + 0.5 * ml_score) if ml_score else rule_score  # 앙상블