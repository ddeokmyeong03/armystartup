package com.armystartup.domain.profile.controller;

import com.armystartup.domain.profile.dto.request.UserProfileRequest;
import com.armystartup.domain.profile.dto.response.UserProfileResponse;
import com.armystartup.domain.profile.service.UserProfileService;
import com.armystartup.global.common.ApiResponse;
import com.armystartup.global.util.SecurityUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users/me/profile")
@RequiredArgsConstructor
@Tag(name = "Profile", description = "사용자 초기 설정 API")
public class ProfileController {

    private final UserProfileService userProfileService;

    @Operation(summary = "초기 설정 저장/수정", description = "존재하면 수정, 없으면 생성합니다.")
    @PutMapping
    public ResponseEntity<ApiResponse<UserProfileResponse>> saveProfile(
            @Valid @RequestBody UserProfileRequest request) {
        Long userId = SecurityUtils.getCurrentUserId();
        UserProfileResponse response = userProfileService.saveProfile(userId, request);
        return ResponseEntity.ok(ApiResponse.success("프로필이 저장되었습니다.", response));
    }

    @Operation(summary = "초기 설정 조회")
    @GetMapping
    public ResponseEntity<ApiResponse<UserProfileResponse>> getProfile() {
        Long userId = SecurityUtils.getCurrentUserId();
        UserProfileResponse response = userProfileService.getProfile(userId);
        return ResponseEntity.ok(ApiResponse.success("프로필을 조회했습니다.", response));
    }
}
