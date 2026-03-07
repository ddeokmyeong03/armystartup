package com.armystartup.domain.goal.controller;

import com.armystartup.domain.goal.dto.request.GoalCreateRequest;
import com.armystartup.domain.goal.dto.request.GoalUpdateRequest;
import com.armystartup.domain.goal.dto.response.GoalResponse;
import com.armystartup.domain.goal.service.GoalService;
import com.armystartup.global.common.ApiResponse;
import com.armystartup.global.util.SecurityUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/goals")
@RequiredArgsConstructor
@Tag(name = "Goal", description = "자기개발 목표 관리 API")
public class GoalController {

    private final GoalService goalService;

    @Operation(summary = "목표 생성")
    @PostMapping
    public ResponseEntity<ApiResponse<GoalResponse>> create(@Valid @RequestBody GoalCreateRequest request) {
        Long userId = SecurityUtils.getCurrentUserId();
        GoalResponse response = goalService.create(userId, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("목표가 생성되었습니다.", response));
    }

    @Operation(summary = "목표 목록 조회", description = "activeOnly=true 이면 활성 목표만, false 이면 전체 조회")
    @GetMapping
    public ResponseEntity<ApiResponse<List<GoalResponse>>> getAll(
            @RequestParam(defaultValue = "true") boolean activeOnly) {
        Long userId = SecurityUtils.getCurrentUserId();
        List<GoalResponse> response = goalService.getAll(userId, activeOnly);
        return ResponseEntity.ok(ApiResponse.success("목표 목록을 조회했습니다.", response));
    }

    @Operation(summary = "목표 상세 조회")
    @GetMapping("/{goalId}")
    public ResponseEntity<ApiResponse<GoalResponse>> getOne(@PathVariable Long goalId) {
        Long userId = SecurityUtils.getCurrentUserId();
        GoalResponse response = goalService.getOne(userId, goalId);
        return ResponseEntity.ok(ApiResponse.success("목표를 조회했습니다.", response));
    }

    @Operation(summary = "목표 수정")
    @PutMapping("/{goalId}")
    public ResponseEntity<ApiResponse<GoalResponse>> update(
            @PathVariable Long goalId,
            @Valid @RequestBody GoalUpdateRequest request) {
        Long userId = SecurityUtils.getCurrentUserId();
        GoalResponse response = goalService.update(userId, goalId, request);
        return ResponseEntity.ok(ApiResponse.success("목표가 수정되었습니다.", response));
    }

    @Operation(summary = "목표 삭제")
    @DeleteMapping("/{goalId}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long goalId) {
        Long userId = SecurityUtils.getCurrentUserId();
        goalService.delete(userId, goalId);
        return ResponseEntity.ok(ApiResponse.success("목표가 삭제되었습니다."));
    }

    @Operation(summary = "목표 활성/비활성 토글", description = "활성 상태면 비활성으로, 비활성이면 활성으로 전환합니다.")
    @PatchMapping("/{goalId}/toggle")
    public ResponseEntity<ApiResponse<GoalResponse>> toggleActive(@PathVariable Long goalId) {
        Long userId = SecurityUtils.getCurrentUserId();
        GoalResponse response = goalService.toggleActive(userId, goalId);
        return ResponseEntity.ok(ApiResponse.success("목표 상태가 변경되었습니다.", response));
    }
}
