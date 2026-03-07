package com.armystartup.domain.dailyplan.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;
import java.util.List;

@Getter
@Builder
public class DailyPlanResponse {

    private LocalDate date;

    // 일반 일정 목록 (시작시간 오름차순)
    private List<DailyScheduleItem> schedules;

    // AI 자기개발 계획 목록 (시작시간 오름차순, APPLIED/COMPLETED/MISSED만)
    private List<DailyAiPlanItem> aiPlans;

    // 요약 통계
    private int totalSchedules;
    private int totalAiPlans;
    private int completedAiPlans;
    private int missedAiPlans;
}
