package com.armystartup.domain.calendar.controller;

import com.armystartup.domain.calendar.dto.response.DailyCalendarDetailResponse;
import com.armystartup.domain.calendar.dto.response.MonthlyCalendarSummaryResponse;
import com.armystartup.domain.calendar.service.CalendarQueryService;
import com.armystartup.global.common.ApiResponse;
import com.armystartup.global.util.SecurityUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/calendar")
@RequiredArgsConstructor
@Tag(name = "Calendar", description = "캘린더 조회 API")
public class CalendarController {

    private final CalendarQueryService calendarQueryService;

    @Operation(summary = "월간 캘린더 요약 조회",
            description = "해당 월의 날짜별 일정/AI계획 존재 여부 및 개수를 반환합니다.")
    @GetMapping("/monthly-summary")
    public ResponseEntity<ApiResponse<MonthlyCalendarSummaryResponse>> getMonthlySummary(
            @RequestParam int year,
            @RequestParam int month) {
        Long userId = SecurityUtils.getCurrentUserId();
        MonthlyCalendarSummaryResponse response = calendarQueryService.getMonthlySummary(userId, year, month);
        return ResponseEntity.ok(ApiResponse.success("월간 캘린더 요약을 조회했습니다.", response));
    }

    @Operation(summary = "특정 날짜 통합 조회",
            description = "해당 날짜의 일반 일정과 AI 계획을 함께 반환합니다.")
    @GetMapping("/daily-detail")
    public ResponseEntity<ApiResponse<DailyCalendarDetailResponse>> getDailyDetail(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        Long userId = SecurityUtils.getCurrentUserId();
        DailyCalendarDetailResponse response = calendarQueryService.getDailyDetail(userId, date);
        return ResponseEntity.ok(ApiResponse.success("일일 상세 정보를 조회했습니다.", response));
    }
}
