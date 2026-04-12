"""
피로도 계산에 사용되는 Pydantic 데이터 모델 정의 모듈.
"""

from pydantic import BaseModel, Field
from typing import Optional
from enum import Enum


class DutyType(str, Enum):
    """근무 유형 열거형."""
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
    """개별 근무/일과 항목."""
    duty_type: DutyType
    start_hour: float = Field(ge=0, lt=24, description="시작 시각 (0~23.99)")
    end_hour: float = Field(ge=0, lt=24, description="종료 시각 (0~23.99)")
    # 자정을 넘기는 경우: start_hour=22.0, end_hour=2.0 → 4시간


class SleepBlock(BaseModel):
    """수면 구간."""
    start_hour: float = Field(ge=0, lt=24)
    end_hour: float = Field(ge=0, lt=24)


class DailySchedule(BaseModel):
    """하루 일과 전체."""
    duties: list[DutyEntry] = Field(description="당일 근무/일과 목록")
    sleep_blocks: list[SleepBlock] = Field(description="수면 구간 목록")
    consecutive_duty_days: int = Field(default=1, ge=1, description="연속 근무 일수")


class FatigueResult(BaseModel):
    """피로도 계산 결과."""
    fatigue_score: float = Field(ge=0, le=10, description="최종 피로도 (0~10)")
    fatigue_level: str = Field(description="피로 수준 (양호/보통/높음/매우 높음)")
    study_recommendation: str = Field(description="자기개발 추천 유형")
    max_study_minutes: int = Field(description="추천 최대 학습 시간 (분)")
    details: dict = Field(description="세부 계산 내역")


class StudyRecommendation(BaseModel):
    """자기개발 추천 결과."""
    fatigue_score: float
    available_hours: float = Field(description="자기개발 가용 시간")
    recommended_content_type: str = Field(description="추천 콘텐츠 유형")
    recommended_duration_minutes: int
    optimal_start_time: Optional[str] = Field(default=None, description="최적 학습 시작 시각")
    message: str = Field(description="사용자에게 보여줄 메시지")
