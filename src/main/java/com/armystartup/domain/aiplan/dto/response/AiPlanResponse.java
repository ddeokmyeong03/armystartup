package com.armystartup.domain.aiplan.dto.response;

import com.armystartup.domain.aiplan.entity.AiPlan;
import com.armystartup.domain.aiplan.entity.AiPlanStatus;
import com.armystartup.domain.aiplan.entity.PlanSourceType;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Builder
public class AiPlanResponse {

    private Long id;
    private Long goalId;
    private String goalTitle;
    private LocalDate recommendedDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private String activityTitle;
    private AiPlanStatus status;
    private PlanSourceType sourceType;

    public static AiPlanResponse from(AiPlan plan) {
        return AiPlanResponse.builder()
                .id(plan.getId())
                .goalId(plan.getGoal().getId())
                .goalTitle(plan.getGoal().getTitle())
                .recommendedDate(plan.getRecommendedDate())
                .startTime(plan.getStartTime())
                .endTime(plan.getEndTime())
                .activityTitle(plan.getActivityTitle())
                .status(plan.getStatus())
                .sourceType(plan.getSourceType())
                .build();
    }
}
