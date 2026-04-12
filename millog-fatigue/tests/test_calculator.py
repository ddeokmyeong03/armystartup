"""
피로도 계산 단위 테스트.
설문 실데이터를 기반으로 한 5개 검증 케이스를 포함합니다.
"""

import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import pytest
from fatigue.models import DailySchedule, DutyEntry, SleepBlock
from fatigue.calculator import calculate_fatigue


# -------------------------------------------------------------------
# Case 1: 불침번 야간 (실측 피로도 8.5)
#
# 수동 검증:
#   행정:    0.50 × 0.80 × 9h = 3.60
#   불침번:  2.16 × 1.15 × 2h = 4.97  (02:00~04:00 → dawn)
#   연속:    × 1.0
#   수면중단: + 3.0 (수면 2구간 → 1회 중단)
#   수면회복: - (4h × 0.53) = -2.12
#   합계:    3.60 + 4.97 + 3.0 - 2.12 = 9.45
# -------------------------------------------------------------------
def test_night_watch_case():
    """불침번 야간 근무 — 실측 피로도 8.5, 기대 약 9.45."""
    schedule = DailySchedule(
        duties=[
            DutyEntry(duty_type="admin_work",  start_hour=9.0,  end_hour=18.0),
            DutyEntry(duty_type="night_watch",  start_hour=2.0,  end_hour=4.0),
        ],
        sleep_blocks=[
            SleepBlock(start_hour=22.0, end_hour=2.0),
            SleepBlock(start_hour=4.0,  end_hour=6.0),
        ],
        consecutive_duty_days=1,
    )
    result = calculate_fatigue(schedule)
    assert 6.5 <= result.fatigue_score <= 10.0, (
        f"피로도 {result.fatigue_score}가 기대 범위(6.5~10.0)를 벗어남"
    )
    assert result.fatigue_level in ["높음", "매우 높음"], (
        f"피로 수준 '{result.fatigue_level}'이 예상과 다름"
    )


# -------------------------------------------------------------------
# Case 2: 야간 경계근무 (실측 피로도 10)
#
# 수동 검증:
#   행정:         0.50 × 0.80 × 9h = 3.60
#   경계(night):  2.25 × 1.00 × 2h = 4.50  (22:00~24:00)
#   경계(dawn):   2.25 × 1.15 × 2h = 5.18  (00:00~02:00)
#   수면중단:     + 3.0 (수면 1구간이지만 경계 후 수면 시작이므로 페널티 없음)
#   수면회복:     - (3.5h × 0.53) = -1.86  (under_4 → 0.35로 계산됨)
#   합계: 3.60 + 4.50 + 5.18 + 3.0 - 1.86 = 14.42 → 클램핑 → 10.0
#
#   NOTE: 수면 1구간(2.5~6.0)이므로 수면 중단 페널티는 0.
#         하지만 합이 이미 충분히 높아 클램핑되어 10.0 달성.
# -------------------------------------------------------------------
def test_night_guard_case():
    """야간 경계근무 — 실측 피로도 10, 클램핑 후 9.0 이상."""
    schedule = DailySchedule(
        duties=[
            DutyEntry(duty_type="admin_work", start_hour=9.0,  end_hour=18.0),
            DutyEntry(duty_type="guard_post",  start_hour=22.0, end_hour=2.0),
        ],
        sleep_blocks=[
            SleepBlock(start_hour=2.5, end_hour=6.0),
        ],
        consecutive_duty_days=1,
    )
    result = calculate_fatigue(schedule)
    assert result.fatigue_score >= 9.0, (
        f"피로도 {result.fatigue_score}가 기대값(≥9.0)보다 낮음"
    )
    assert result.fatigue_level == "매우 높음", (
        f"피로 수준 '{result.fatigue_level}'이 '매우 높음'이어야 함"
    )
    assert result.max_study_minutes == 0, (
        f"학습 가능 시간이 {result.max_study_minutes}분이지만 0분이어야 함"
    )


# -------------------------------------------------------------------
# Case 3: 주간 CCTV (실측 피로도 2)
#
# 수동 검증:
#   CCTV:   2.00 × 0.80 × 3h = 4.80  (09:00~12:00, day)
#   행정:   0.50 × 0.80 × 5h = 2.00  (13:00~18:00, day)
#   연속:   × 1.0
#   수면중단: + 0 (1구간 연속)
#   수면회복: - (8h × 1.00) = -8.00 (22:00~06:00 = 8h, continuous_6plus)
#   합계: 4.80 + 2.00 + 0 - 8.00 = -1.20 → 클램핑 → 0.0
# -------------------------------------------------------------------
def test_daytime_cctv_case():
    """주간 CCTV 근무 — 실측 피로도 2, 기대 ≤4.0 (양호 구간)."""
    schedule = DailySchedule(
        duties=[
            DutyEntry(duty_type="cctv_surveillance", start_hour=9.0,  end_hour=12.0),
            DutyEntry(duty_type="admin_work",         start_hour=13.0, end_hour=18.0),
        ],
        sleep_blocks=[
            SleepBlock(start_hour=22.0, end_hour=6.0),
        ],
        consecutive_duty_days=1,
    )
    result = calculate_fatigue(schedule)
    assert result.fatigue_score <= 4.0, (
        f"피로도 {result.fatigue_score}가 기대값(≤4.0)보다 높음"
    )
    assert result.fatigue_level == "양호", (
        f"피로 수준 '{result.fatigue_level}'이 '양호'이어야 함"
    )
    assert result.max_study_minutes >= 60, (
        f"학습 가능 시간 {result.max_study_minutes}분이 60분 미만"
    )


# -------------------------------------------------------------------
# Case 4: 연속 3일 경계근무
#
# Case 2와 동일 일정이지만 consecutive_duty_days=3 → C=1.30
# 기대: Case 2보다 피로도 더 높아야 함 (이미 10.0 클램핑되므로 ≥9.5)
# -------------------------------------------------------------------
def test_consecutive_guard_duty():
    """연속 3일 경계근무 — 연속근무 계수 1.30 적용, 피로도 ≥9.5."""
    schedule = DailySchedule(
        duties=[
            DutyEntry(duty_type="admin_work", start_hour=9.0,  end_hour=18.0),
            DutyEntry(duty_type="guard_post",  start_hour=22.0, end_hour=2.0),
        ],
        sleep_blocks=[
            SleepBlock(start_hour=2.5, end_hour=6.0),
        ],
        consecutive_duty_days=3,
    )
    result = calculate_fatigue(schedule)
    assert result.fatigue_score >= 9.5, (
        f"피로도 {result.fatigue_score}가 기대값(≥9.5)보다 낮음"
    )


# -------------------------------------------------------------------
# Case 5: 근무 없는 날 (휴일)
#
# 수동 검증:
#   근무 없음 → 피로 합산 = 0
#   연속:   × 1.0
#   수면중단: + 0 (1구간)
#   수면회복: - (9h × 1.00) = -9.0 (23:00~08:00 = 9h, continuous_6plus)
#   합계: 0 + 0 - 9.0 = -9.0 → 클램핑 → 0.0
# -------------------------------------------------------------------
def test_rest_day():
    """근무 없는 휴일 — 충분한 수면, 피로도 ≤1.0 (양호 구간)."""
    schedule = DailySchedule(
        duties=[],
        sleep_blocks=[
            SleepBlock(start_hour=23.0, end_hour=8.0),
        ],
        consecutive_duty_days=1,
    )
    result = calculate_fatigue(schedule)
    assert result.fatigue_score <= 1.0, (
        f"피로도 {result.fatigue_score}가 기대값(≤1.0)보다 높음"
    )
    assert result.fatigue_level == "양호", (
        f"피로 수준 '{result.fatigue_level}'이 '양호'이어야 함"
    )
    assert result.max_study_minutes >= 120, (
        f"학습 가능 시간 {result.max_study_minutes}분이 120분 미만"
    )
