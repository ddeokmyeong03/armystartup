package com.armystartup.domain.dashboard.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class DashboardHomeResponse {

    private String nickname;
    private int todayScheduleCount;
    private int todayAiPlanCount;
    private int completedPlanCount;
    private int activeGoalCount;
}
