package com.armystartup.domain.schedule.entity;

import com.armystartup.domain.user.entity.User;
import com.armystartup.global.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "schedules")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
@AllArgsConstructor
public class Schedule extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private LocalDate scheduleDate;

    @Column(nullable = false)
    private LocalTime startTime;

    @Column(nullable = false)
    private LocalTime endTime;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private RepeatType repeatType = RepeatType.NONE;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private ScheduleCategory category = ScheduleCategory.PERSONAL;

    @Column(length = 1000)
    private String memo;

    public void update(String title, LocalDate scheduleDate, LocalTime startTime,
                       LocalTime endTime, RepeatType repeatType, ScheduleCategory category, String memo) {
        this.title = title;
        this.scheduleDate = scheduleDate;
        this.startTime = startTime;
        this.endTime = endTime;
        this.repeatType = repeatType;
        this.category = category;
        this.memo = memo;
    }
}
