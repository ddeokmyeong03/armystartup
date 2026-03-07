package com.armystartup.domain.aiplan.entity;

import com.armystartup.domain.goal.entity.Goal;
import com.armystartup.domain.user.entity.User;
import com.armystartup.global.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "ai_plans")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
@AllArgsConstructor
public class AiPlan extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "goal_id", nullable = false)
    private Goal goal;

    @Column(nullable = false)
    private LocalDate recommendedDate;

    @Column(nullable = false)
    private LocalTime startTime;

    @Column(nullable = false)
    private LocalTime endTime;

    @Column(nullable = false)
    private String activityTitle;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private AiPlanStatus status = AiPlanStatus.RECOMMENDED;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private PlanSourceType sourceType = PlanSourceType.AI_GENERATED;

    public void apply() {
        this.status = AiPlanStatus.APPLIED;
    }

    public void complete() {
        this.status = AiPlanStatus.COMPLETED;
    }

    public void miss() {
        this.status = AiPlanStatus.MISSED;
    }

    public void adjustTime(LocalTime startTime, LocalTime endTime) {
        this.startTime = startTime;
        this.endTime = endTime;
        this.sourceType = PlanSourceType.MANUAL_ADJUSTED;
    }
}
