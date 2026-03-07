package com.armystartup.domain.schedule.controller;

import com.armystartup.domain.schedule.dto.request.ScheduleCreateRequest;
import com.armystartup.domain.schedule.dto.request.ScheduleUpdateRequest;
import com.armystartup.domain.schedule.dto.response.ScheduleResponse;
import com.armystartup.domain.schedule.service.ScheduleService;
import com.armystartup.global.common.ApiResponse;
import com.armystartup.global.util.SecurityUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/schedules")
@RequiredArgsConstructor
@Tag(name = "Schedule", description = "일정 관리 API")
public class ScheduleController {

    private final ScheduleService scheduleService;

    @Operation(summary = "일정 생성")
    @PostMapping
    public ResponseEntity<ApiResponse<ScheduleResponse>> create(
            @Valid @RequestBody ScheduleCreateRequest request) {
        Long userId = SecurityUtils.getCurrentUserId();
        ScheduleResponse response = scheduleService.create(userId, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("일정이 생성되었습니다.", response));
    }

    @Operation(summary = "일정 목록 조회", description = "date 파라미터 없으면 전체, date 있으면 해당 날짜, from+to 있으면 기간 조회")
    @GetMapping
    public ResponseEntity<ApiResponse<List<ScheduleResponse>>> getList(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        Long userId = SecurityUtils.getCurrentUserId();
        List<ScheduleResponse> response;

        if (date != null) {
            response = scheduleService.getByDate(userId, date);
        } else if (from != null && to != null) {
            response = scheduleService.getByDateRange(userId, from, to);
        } else {
            response = scheduleService.getAll(userId);
        }

        return ResponseEntity.ok(ApiResponse.success("일정 목록을 조회했습니다.", response));
    }

    @Operation(summary = "일정 상세 조회")
    @GetMapping("/{scheduleId}")
    public ResponseEntity<ApiResponse<ScheduleResponse>> getOne(@PathVariable Long scheduleId) {
        Long userId = SecurityUtils.getCurrentUserId();
        ScheduleResponse response = scheduleService.getOne(userId, scheduleId);
        return ResponseEntity.ok(ApiResponse.success("일정을 조회했습니다.", response));
    }

    @Operation(summary = "일정 수정")
    @PutMapping("/{scheduleId}")
    public ResponseEntity<ApiResponse<ScheduleResponse>> update(
            @PathVariable Long scheduleId,
            @Valid @RequestBody ScheduleUpdateRequest request) {
        Long userId = SecurityUtils.getCurrentUserId();
        ScheduleResponse response = scheduleService.update(userId, scheduleId, request);
        return ResponseEntity.ok(ApiResponse.success("일정이 수정되었습니다.", response));
    }

    @Operation(summary = "일정 삭제")
    @DeleteMapping("/{scheduleId}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long scheduleId) {
        Long userId = SecurityUtils.getCurrentUserId();
        scheduleService.delete(userId, scheduleId);
        return ResponseEntity.ok(ApiResponse.success("일정이 삭제되었습니다."));
    }
}
