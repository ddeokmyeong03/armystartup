package com.armystartup.domain.dailyplan.controller;

import com.armystartup.domain.dailyplan.dto.response.DailyPlanResponse;
import com.armystartup.domain.dailyplan.service.DailyPlanQueryService;
import com.armystartup.global.common.ApiResponse;
import com.armystartup.global.util.SecurityUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/daily-plan")
@RequiredArgsConstructor
@Tag(name = "DailyPlan", description = "오늘의 일정/계획 통합 조회 API")
public class DailyPlanController {

    private final DailyPlanQueryService dailyPlanQueryService;

    @Operation(summary = "오늘의 일정 및 계획 조회",
            description = "date 미입력 시 오늘 날짜 기준으로 일반 일정과 적용된 AI 계획을 통합 조회합니다.")
    @GetMapping
    public ResponseEntity<ApiResponse<DailyPlanResponse>> getDailyPlan(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        Long userId = SecurityUtils.getCurrentUserId();
        LocalDate targetDate = date != null ? date : LocalDate.now();
        DailyPlanResponse response = dailyPlanQueryService.getDailyPlan(userId, targetDate);
        return ResponseEntity.ok(ApiResponse.success("오늘의 일정/계획을 조회했습니다.", response));
    }
}
