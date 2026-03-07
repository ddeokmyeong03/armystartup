package com.armystartup.domain.main.controller;

import com.armystartup.domain.main.dto.response.MainHomeResponse;
import com.armystartup.domain.main.service.MainHomeService;
import com.armystartup.global.common.ApiResponse;
import com.armystartup.global.util.SecurityUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;

@Tag(name = "Main Home", description = "메인 홈 통합 조회 API")
@RestController
@RequestMapping("/api/main")
@RequiredArgsConstructor
public class MainHomeController {

    private final MainHomeService mainHomeService;

    @Operation(summary = "메인 홈 통합 조회",
            description = "사용자 정보, 주간 캘린더, 선택된 날짜의 일정/AI 계획을 한 번에 조회합니다.")
    @GetMapping("/home")
    public ApiResponse<MainHomeResponse> getHome(
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {

        LocalDate today = LocalDate.now();
        LocalDate weekStart = (startDate != null) ? startDate : today;
        LocalDate selectedDate = (date != null) ? date : today;

        Long userId = SecurityUtils.getCurrentUserId();
        MainHomeResponse response = mainHomeService.getHome(userId, weekStart, selectedDate);
        return ApiResponse.success("메인 홈 정보를 조회했습니다.", response);
    }
}
