package com.armystartup.domain.calendar.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;
import java.util.List;

@Getter
@Builder
public class WeeklyCalendarSummaryResponse {

    private LocalDate startDate;
    private LocalDate endDate;
    private List<MonthlyCalendarDayResponse> days;
}
