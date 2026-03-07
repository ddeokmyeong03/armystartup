package com.armystartup.domain.calendar.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class MonthlyCalendarSummaryResponse {

    private int year;
    private int month;
    private List<MonthlyCalendarDayResponse> days;
}
