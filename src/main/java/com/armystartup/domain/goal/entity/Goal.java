package com.armystartup.domain.goal.entity;

import com.armystartup.domain.user.entity.User;
import com.armystartup.global.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "goals")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
@AllArgsConstructor
public class Goal extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String title;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private GoalType type;

    @Column(length = 1000)
    private String targetDescription;

    // 회당 목표 학습 시간 (분)
    private Integer preferredMinutesPerSession;

    // 주당 목표 횟수
    private Integer preferredSessionsPerWeek;

    @Column(nullable = false)
    @Builder.Default
    private Boolean isActive = true;

    public void update(String title, GoalType type, String targetDescription,
                       Integer preferredMinutesPerSession, Integer preferredSessionsPerWeek) {
        this.title = title;
        this.type = type;
        this.targetDescription = targetDescription;
        this.preferredMinutesPerSession = preferredMinutesPerSession;
        this.preferredSessionsPerWeek = preferredSessionsPerWeek;
    }

    public void deactivate() {
        this.isActive = false;
    }

    public void activate() {
        this.isActive = true;
    }
}
