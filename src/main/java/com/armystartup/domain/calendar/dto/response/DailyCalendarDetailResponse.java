package com.armystartup.domain.calendar.dto.response;

import com.armystartup.domain.aiplan.entity.AiPlanStatus;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Getter
@Builder
public class DailyCalendarDetailResponse {

    private LocalDate date;
    private List<ScheduleItem> schedules;
    private List<AiPlanItem> aiPlans;

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
        private AiPlanStatus status;
        private String goalTitle;
    }
}
