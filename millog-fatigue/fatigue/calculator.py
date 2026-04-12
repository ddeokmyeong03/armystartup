"""
핵심 피로도 계산 엔진.

공식: F = clamp( Σ(Di × Ti × hi) × C + P - R, 0, 10 )
  Di: 근무 유형별 피로지수 (시간당)
  Ti: 시간대 가중치
  hi: 근무 수행 시간 (시간)
  C: 연속근무 계수
  P: 수면 중단 페널티
  R: 수면 회복량
"""

from fatigue.models import DailySchedule, DutyEntry, SleepBlock, FatigueResult
from fatigue.constants import (
    DUTY_FATIGUE_INDEX,
    TIME_WEIGHT,
    CONSECUTIVE_BASE,
    CONSECUTIVE_STEP,
    CONSECUTIVE_MAX,
    SLEEP_INTERRUPTION_PENALTY,
    SLEEP_QUALITY,
    FATIGUE_MIN,
    FATIGUE_MAX,
)
from fatigue.recommender import get_recommendation


def get_time_weight(hour: float) -> float:
    """
    시각(0~23.99)을 입력받아 시간대 가중치를 반환합니다.

    시간대 구분:
      - day:     06:00~18:00 → 0.80
      - evening: 18:00~22:00 → 0.90
      - night:   22:00~02:00 → 1.00
      - dawn:    02:00~06:00 → 1.15
    """
    if 6.0 <= hour < 18.0:
        return TIME_WEIGHT["day"]
    elif 18.0 <= hour < 22.0:
        return TIME_WEIGHT["evening"]
    elif hour >= 22.0 or hour < 2.0:
        return TIME_WEIGHT["night"]
    else:  # 2.0 <= hour < 6.0
        return TIME_WEIGHT["dawn"]


def _calc_block_hours(start: float, end: float) -> float:
    """
    단순 구간의 시간 길이를 계산합니다 (자정 미포함).

    예: (9.0, 18.0) → 9.0시간
    """
    return end - start


def _split_into_time_zones(start: float, end: float) -> list[tuple[float, float, str]]:
    """
    근무 구간을 시간대(day/evening/night/dawn)별로 분할합니다.
    자정을 넘기는 경우도 처리합니다.

    반환: [(구간_시작, 구간_종료, 시간대_이름), ...]
    """
    # 자정 넘김 처리: start > end → 두 구간으로 분할
    if start > end:
        # 예: start=22, end=2 → (22~24) + (0~2)
        segments_raw: list[tuple[float, float]] = [(start, 24.0), (0.0, end)]
    else:
        segments_raw = [(start, end)]

    # 시간대 경계: [6, 18, 22, 24, 2, 6] 순환 구조를 선형 배열로 표현
    # day=6~18, evening=18~22, night=22~24 + 0~2, dawn=2~6
    zone_list: list[tuple[float, float, str]] = [
        (0.0,  2.0,  "night"),
        (2.0,  6.0,  "dawn"),
        (6.0,  18.0, "day"),
        (18.0, 22.0, "evening"),
        (22.0, 24.0, "night"),
    ]

    result: list[tuple[float, float, str]] = []
    for seg_start, seg_end in segments_raw:
        for zone_start, zone_end, zone_name in zone_list:
            # 두 구간의 교집합 계산
            overlap_start = max(seg_start, zone_start)
            overlap_end = min(seg_end, zone_end)
            if overlap_end > overlap_start:
                result.append((overlap_start, overlap_end, zone_name))

    return result


def calc_duty_fatigue(duty: DutyEntry) -> tuple[float, list[dict]]:
    """
    단일 근무의 피로 기여도(Di × Ti × hi)를 계산합니다.
    시간대를 분할하여 각 구간별로 계산합니다.

    반환: (총 피로 기여도, 세부 내역 리스트)

    예시: guard_post 21:00~01:00
    → evening(21:00~22:00): 2.25 × 0.90 × 1h = 2.025
    → night(22:00~01:00):   2.25 × 1.00 × 3h = 6.75
    → 합계: 8.775
    """
    di = DUTY_FATIGUE_INDEX.get(duty.duty_type.value, 0.0)
    if di == 0.0:
        return 0.0, []

    zones = _split_into_time_zones(duty.start_hour, duty.end_hour)
    total: float = 0.0
    breakdown: list[dict] = []

    for zone_start, zone_end, zone_name in zones:
        hours = _calc_block_hours(zone_start, zone_end)
        ti = TIME_WEIGHT[zone_name]
        contribution = di * ti * hours
        total += contribution
        breakdown.append({
            "zone": zone_name,
            "start": zone_start,
            "end": zone_end,
            "hours": hours,
            "di": di,
            "ti": ti,
            "contribution": round(contribution, 4),
        })

    return total, breakdown


def calc_consecutive_factor(consecutive_days: int) -> float:
    """
    연속 근무 일수에 따른 피로 누적 계수를 계산합니다.

    공식: min(1.0 + 0.15 × (days - 1), 2.0)
    예: 1일→1.00, 2일→1.15, 3일→1.30, 8일 이상→2.00(상한)
    """
    return min(CONSECUTIVE_BASE + CONSECUTIVE_STEP * (consecutive_days - 1), CONSECUTIVE_MAX)


def calc_sleep_penalty(interruptions: int) -> float:
    """
    수면 중 근무로 인해 깨어난 횟수에 따른 페널티를 계산합니다.

    공식: interruptions × SLEEP_INTERRUPTION_PENALTY(3.0)
    """
    return interruptions * SLEEP_INTERRUPTION_PENALTY


def _calc_sleep_block_hours(start: float, end: float) -> float:
    """
    수면 구간의 실제 시간을 계산합니다. 자정을 넘기는 경우도 처리합니다.

    예: (22.0, 6.0) → 8시간, (22.0, 2.0) → 4시간
    """
    if start > end:
        return (24.0 - start) + end
    return end - start


def determine_sleep_type(sleep_blocks: list[SleepBlock]) -> str:
    """
    수면 구간 목록을 분석하여 수면 유형을 판별합니다.

    - 2개 이상의 수면 구간 → "split"
    - 총 수면 시간 4시간 미만 → "under_4"
    - 총 수면 시간 6시간 이상 → "continuous_6plus"
    - 그 외(4~6시간) → "split"
    """
    if len(sleep_blocks) > 1:
        return "split"

    total_hours = sum(
        _calc_sleep_block_hours(sb.start_hour, sb.end_hour)
        for sb in sleep_blocks
    )
    if total_hours < 4.0:
        return "under_4"
    if total_hours >= 6.0:
        return "continuous_6plus"
    return "split"


def calc_recovery(sleep_blocks: list[SleepBlock]) -> tuple[float, dict]:
    """
    수면 시간과 수면 유형을 기반으로 피로 회복량을 계산합니다.

    공식: R = 총_수면_시간 × 수면질_계수
    반환: (회복량, 세부_내역)
    """
    sleep_type = determine_sleep_type(sleep_blocks)
    quality = SLEEP_QUALITY.get(sleep_type, 0.53)
    total_hours = sum(
        _calc_sleep_block_hours(sb.start_hour, sb.end_hour)
        for sb in sleep_blocks
    )
    recovery = total_hours * quality

    return recovery, {
        "sleep_type": sleep_type,
        "total_hours": round(total_hours, 2),
        "quality_factor": quality,
        "recovery": round(recovery, 4),
    }


def count_sleep_interruptions(
    sleep_blocks: list[SleepBlock],
    duties: list[DutyEntry],
) -> int:
    """
    수면 구간과 근무 시간을 비교하여 수면 중단 횟수를 계산합니다.

    판별 로직:
    1. 수면 블록이 2개 이상이면 중단 횟수 = len(sleep_blocks) - 1
    2. 수면 블록이 1개라도 블록 사이에 근무가 있는지 확인하여 검증

    예시:
    sleep: [(22, 2), (4, 6)] → 2개 구간 = 1회 중단
    duty: [(2, 4)] → 02:00~04:00 불침번이 수면 중간에 있음
    """
    if len(sleep_blocks) >= 2:
        return len(sleep_blocks) - 1
    return 0


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
    details: dict = {"duties": []}

    # 1~2. 각 근무 피로도 합산
    total_duty_fatigue: float = 0.0
    for duty in schedule.duties:
        contribution, breakdown = calc_duty_fatigue(duty)
        total_duty_fatigue += contribution
        details["duties"].append({
            "duty_type": duty.duty_type.value,
            "start_hour": duty.start_hour,
            "end_hour": duty.end_hour,
            "total_contribution": round(contribution, 4),
            "breakdown": breakdown,
        })

    details["total_duty_fatigue"] = round(total_duty_fatigue, 4)

    # 3. 연속근무 계수 C
    c = calc_consecutive_factor(schedule.consecutive_duty_days)
    fatigue_after_c = total_duty_fatigue * c
    details["consecutive_factor"] = c
    details["fatigue_after_consecutive"] = round(fatigue_after_c, 4)

    # 4. 수면 중단 페널티 P
    interruptions = count_sleep_interruptions(schedule.sleep_blocks, schedule.duties)
    p = calc_sleep_penalty(interruptions)
    details["sleep_interruptions"] = interruptions
    details["sleep_penalty"] = p

    # 5. 수면 회복량 R
    r, sleep_detail = calc_recovery(schedule.sleep_blocks)
    details["sleep_recovery"] = sleep_detail

    # 6. 최종 피로도 클램핑
    raw_fatigue = fatigue_after_c + p - r
    final_score = max(FATIGUE_MIN, min(FATIGUE_MAX, raw_fatigue))
    details["raw_fatigue"] = round(raw_fatigue, 4)
    details["final_score"] = round(final_score, 4)

    # 7. 피로도 수준 및 자기개발 추천 생성
    rec = get_recommendation(final_score)

    return FatigueResult(
        fatigue_score=round(final_score, 2),
        fatigue_level=rec["level"],
        study_recommendation=rec["content_type"],
        max_study_minutes=rec["max_minutes"],
        details=details,
    )
