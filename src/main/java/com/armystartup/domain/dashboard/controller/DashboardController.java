package com.armystartup.domain.dashboard.controller;

import com.armystartup.domain.dashboard.dto.response.DashboardHomeResponse;
import com.armystartup.domain.dashboard.service.DashboardService;
import com.armystartup.global.common.ApiResponse;
import com.armystartup.global.util.SecurityUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
@Tag(name = "Dashboard", description = "홈 대시보드 API")
public class DashboardController {

    private final DashboardService dashboardService;

    @Operation(summary = "홈 대시보드 조회",
            description = "사용자 닉네임, 오늘 일정 수, AI 계획 수, 완료 수, 활성 목표 수를 반환합니다.")
    @GetMapping("/home")
    public ResponseEntity<ApiResponse<DashboardHomeResponse>> getHome() {
        Long userId = SecurityUtils.getCurrentUserId();
        DashboardHomeResponse response = dashboardService.getHome(userId);
        return ResponseEntity.ok(ApiResponse.success("홈 대시보드 정보를 조회했습니다.", response));
    }
}
