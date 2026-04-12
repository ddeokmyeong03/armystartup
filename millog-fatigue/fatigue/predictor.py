"""
주간 피로도 예측 모듈 (향후 확장).

2~3주 사용 데이터 축적 후 주간 단위 피로도 예측 기능 제공 예정.
현재는 단순 일별 계산의 집계로 구현됩니다.
"""

from fatigue.models import DailySchedule
from fatigue.calculator import calculate_fatigue


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
