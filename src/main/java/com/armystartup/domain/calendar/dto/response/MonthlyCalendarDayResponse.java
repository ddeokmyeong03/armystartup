package com.armystartup.domain.calendar.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;

@Getter
@Builder
public class MonthlyCalendarDayResponse {

    private LocalDate date;
    private int scheduleCount;
    private int aiPlanCount;
    private boolean hasSchedule;
    private boolean hasAiPlan;
}
