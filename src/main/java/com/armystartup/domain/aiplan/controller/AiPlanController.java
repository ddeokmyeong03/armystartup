package com.armystartup.domain.aiplan.controller;

import com.armystartup.domain.aiplan.dto.request.AiPlanAdjustRequest;
import com.armystartup.domain.aiplan.dto.request.AiPlanBatchApplyRequest;
import com.armystartup.domain.aiplan.dto.request.AiPlanRecommendRequest;
import com.armystartup.domain.aiplan.dto.response.AiPlanResponse;
import com.armystartup.domain.aiplan.service.AiPlanService;
import com.armystartup.global.common.ApiResponse;
import com.armystartup.global.util.SecurityUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/ai-plans")
@RequiredArgsConstructor
@Tag(name = "AiPlan", description = "AI 자기개발 계획 추천 API")
public class AiPlanController {

    private final AiPlanService aiPlanService;

    @Operation(summary = "AI 계획 추천 요청",
            description = "사용자의 일정과 목표를 기반으로 자기개발 계획을 추천합니다. 기존 RECOMMENDED 계획은 교체됩니다.")
    @PostMapping("/recommend")
    public ResponseEntity<ApiResponse<List<AiPlanResponse>>> recommend(
            @Valid @RequestBody AiPlanRecommendRequest request) {
        Long userId = SecurityUtils.getCurrentUserId();
        List<AiPlanResponse> response = aiPlanService.recommend(userId, request);
        return ResponseEntity.ok(ApiResponse.success("AI 계획 추천이 완료되었습니다.", response));
    }

    @Operation(summary = "날짜별 AI 계획 조회")
    @GetMapping
    public ResponseEntity<ApiResponse<List<AiPlanResponse>>> getByDate(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        Long userId = SecurityUtils.getCurrentUserId();
        List<AiPlanResponse> response = aiPlanService.getByDate(userId, date);
        return ResponseEntity.ok(ApiResponse.success("AI 계획 목록을 조회했습니다.", response));
    }

    @Operation(summary = "AI 계획 적용", description = "추천된 계획을 실제 계획으로 적용합니다. (RECOMMENDED → APPLIED)")
    @PatchMapping("/{planId}/apply")
    public ResponseEntity<ApiResponse<AiPlanResponse>> apply(@PathVariable Long planId) {
        Long userId = SecurityUtils.getCurrentUserId();
        AiPlanResponse response = aiPlanService.apply(userId, planId);
        return ResponseEntity.ok(ApiResponse.success("계획이 적용되었습니다.", response));
    }

    @Operation(summary = "AI 계획 일괄 적용", description = "추천된 여러 계획을 한 번에 적용합니다. (RECOMMENDED → APPLIED)")
    @PostMapping("/apply-batch")
    public ResponseEntity<ApiResponse<List<AiPlanResponse>>> applyBatch(
            @Valid @RequestBody AiPlanBatchApplyRequest request) {
        Long userId = SecurityUtils.getCurrentUserId();
        List<AiPlanResponse> response = aiPlanService.applyBatch(userId, request);
        return ResponseEntity.ok(ApiResponse.success("계획이 일괄 적용되었습니다.", response));
    }

    @Operation(summary = "AI 계획 시간 조정", description = "적용된 계획의 시간을 수동으로 조정합니다.")
    @PatchMapping("/{planId}/adjust")
    public ResponseEntity<ApiResponse<AiPlanResponse>> adjust(
            @PathVariable Long planId,
            @Valid @RequestBody AiPlanAdjustRequest request) {
        Long userId = SecurityUtils.getCurrentUserId();
        AiPlanResponse response = aiPlanService.adjust(userId, planId, request);
        return ResponseEntity.ok(ApiResponse.success("계획 시간이 조정되었습니다.", response));
    }

    @Operation(summary = "계획 수행 완료 체크", description = "적용된 계획을 완료 처리합니다. (APPLIED → COMPLETED)")
    @PatchMapping("/{planId}/complete")
    public ResponseEntity<ApiResponse<AiPlanResponse>> complete(@PathVariable Long planId) {
        Long userId = SecurityUtils.getCurrentUserId();
        AiPlanResponse response = aiPlanService.complete(userId, planId);
        return ResponseEntity.ok(ApiResponse.success("계획을 완료 처리했습니다.", response));
    }

    @Operation(summary = "계획 미완료 기록", description = "적용된 계획을 미완료로 기록합니다. (APPLIED → MISSED)")
    @PatchMapping("/{planId}/miss")
    public ResponseEntity<ApiResponse<AiPlanResponse>> miss(@PathVariable Long planId) {
        Long userId = SecurityUtils.getCurrentUserId();
        AiPlanResponse response = aiPlanService.miss(userId, planId);
        return ResponseEntity.ok(ApiResponse.success("계획을 미완료로 기록했습니다.", response));
    }

    @Operation(summary = "AI 계획 재생성", description = "기존 RECOMMENDED 계획을 삭제하고 새로 추천합니다.")
    @PostMapping("/regenerate")
    public ResponseEntity<ApiResponse<List<AiPlanResponse>>> regenerate(
            @Valid @RequestBody AiPlanRecommendRequest request) {
        Long userId = SecurityUtils.getCurrentUserId();
        List<AiPlanResponse> response = aiPlanService.regenerate(userId, request);
        return ResponseEntity.ok(ApiResponse.success("AI 계획이 재생성되었습니다.", response));
    }
}
