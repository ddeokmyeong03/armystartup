package com.armystartup.domain.profile.entity;

import com.armystartup.domain.user.entity.User;
import com.armystartup.global.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalTime;

@Entity
@Table(name = "user_profiles")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
@AllArgsConstructor
public class UserProfile extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(nullable = false)
    private LocalTime wakeUpTime;

    @Column(nullable = false)
    private LocalTime sleepTime;

    // 평일 일과 패턴 메모
    @Column(length = 500)
    private String weekdayPattern;

    // 주말 일과 패턴 메모
    @Column(length = 500)
    private String weekendPattern;

    // 하루 학습 가능 시간 (분)
    private Integer availableStudyMinutes;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private PlanIntensity preferredPlanIntensity = PlanIntensity.MODERATE;

    @Column(length = 1000)
    private String memo;

    public void update(LocalTime wakeUpTime, LocalTime sleepTime, String weekdayPattern,
                       String weekendPattern, Integer availableStudyMinutes,
                       PlanIntensity preferredPlanIntensity, String memo) {
        this.wakeUpTime = wakeUpTime;
        this.sleepTime = sleepTime;
        this.weekdayPattern = weekdayPattern;
        this.weekendPattern = weekendPattern;
        this.availableStudyMinutes = availableStudyMinutes;
        this.preferredPlanIntensity = preferredPlanIntensity;
        this.memo = memo;
    }
}
