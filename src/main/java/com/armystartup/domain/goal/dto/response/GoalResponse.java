package com.armystartup.domain.goal.dto.response;

import com.armystartup.domain.goal.entity.Goal;
import com.armystartup.domain.goal.entity.GoalType;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class GoalResponse {

    private Long id;
    private String title;
    private GoalType type;
    private String targetDescription;
    private Integer preferredMinutesPerSession;
    private Integer preferredSessionsPerWeek;
    private Boolean isActive;
    private LocalDateTime createdAt;

    public static GoalResponse from(Goal goal) {
        return GoalResponse.builder()
                .id(goal.getId())
                .title(goal.getTitle())
                .type(goal.getType())
                .targetDescription(goal.getTargetDescription())
                .preferredMinutesPerSession(goal.getPreferredMinutesPerSession())
                .preferredSessionsPerWeek(goal.getPreferredSessionsPerWeek())
                .isActive(goal.getIsActive())
                .createdAt(goal.getCreatedAt())
                .build();
    }
}
