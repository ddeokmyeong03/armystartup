package com.armystartup.domain.dailyplan.dto.response;

import com.armystartup.domain.aiplan.entity.AiPlan;
import com.armystartup.domain.aiplan.entity.AiPlanStatus;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalTime;

@Getter
@Builder
public class DailyAiPlanItem {

    private Long id;
    private Long goalId;
    private String activityTitle;
    private LocalTime startTime;
    private LocalTime endTime;
    private AiPlanStatus status;
    private boolean completed;

    public static DailyAiPlanItem from(AiPlan plan) {
        return DailyAiPlanItem.builder()
                .id(plan.getId())
                .goalId(plan.getGoal().getId())
                .activityTitle(plan.getActivityTitle())
                .startTime(plan.getStartTime())
                .endTime(plan.getEndTime())
                .status(plan.getStatus())
                .completed(plan.getStatus() == AiPlanStatus.COMPLETED)
                .build();
    }
}
