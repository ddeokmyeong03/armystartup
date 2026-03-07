package com.armystartup.domain.main.dto.response;

import com.armystartup.domain.calendar.dto.response.MonthlyCalendarDayResponse;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Getter
@Builder
public class MainHomeResponse {

    private UserSummary user;
    private int unreadNotificationCount;
    private int pendingFriendRequestCount;
    private boolean hasActiveGoal;

    // 주간 캘린더 (7일)
    private LocalDate weekStartDate;
    private LocalDate weekEndDate;
    private List<MonthlyCalendarDayResponse> weeklyCalendarDays;

    // 선택된 날짜의 상세
    private LocalDate selectedDate;
    private List<ScheduleItem> todaySchedules;
    private List<AiPlanItem> todayAiPlans;

    @Getter
    @Builder
    public static class UserSummary {
        private String nickname;
        private String statusMessage;
        private String profileImageUrl;
    }

    @Getter
    @Builder
    public static class ScheduleItem {
        private Long id;
        private String title;
        private LocalTime startTime;
        private LocalTime endTime;
        private String category;
        private String memo;
    }

    @Getter
    @Builder
    public static class AiPlanItem {
        private Long id;
        private String title;
        private LocalTime startTime;
        private LocalTime endTime;
        private String status;
        private String goalTitle;
    }
}
