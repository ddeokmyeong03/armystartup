package com.armystartup.domain.user.controller;

import com.armystartup.domain.user.dto.request.LoginRequest;
import com.armystartup.domain.user.dto.request.SignUpRequest;
import com.armystartup.domain.user.dto.request.UserUpdateRequest;
import com.armystartup.domain.user.dto.response.LoginResponse;
import com.armystartup.domain.user.dto.response.UserResponse;
import com.armystartup.domain.user.service.AuthService;
import com.armystartup.domain.user.service.UserService;
import com.armystartup.global.common.ApiResponse;
import com.armystartup.global.util.SecurityUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Tag(name = "User", description = "사용자 인증 및 정보 API")
public class UserController {

    private final AuthService authService;
    private final UserService userService;

    @Operation(summary = "회원가입")
    @PostMapping("/auth/signup")
    public ResponseEntity<ApiResponse<Void>> signUp(@Valid @RequestBody SignUpRequest request) {
        authService.signUp(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("회원가입이 완료되었습니다."));
    }

    @Operation(summary = "로그인")
    @PostMapping("/auth/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(@Valid @RequestBody LoginRequest request) {
        LoginResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.success("로그인이 완료되었습니다.", response));
    }

    @Operation(summary = "내 정보 조회")
    @GetMapping("/users/me")
    public ResponseEntity<ApiResponse<UserResponse>> getMyInfo() {
        Long userId = SecurityUtils.getCurrentUserId();
        UserResponse response = userService.getUser(userId);
        return ResponseEntity.ok(ApiResponse.success("사용자 정보를 조회했습니다.", response));
    }

    @Operation(summary = "내 정보 수정", description = "닉네임, 전화번호를 수정합니다. null인 필드는 변경하지 않습니다.")
    @PatchMapping("/users/me")
    public ResponseEntity<ApiResponse<UserResponse>> updateMyInfo(
            @Valid @RequestBody UserUpdateRequest request) {
        Long userId = SecurityUtils.getCurrentUserId();
        UserResponse response = userService.updateUser(userId, request);
        return ResponseEntity.ok(ApiResponse.success("사용자 정보가 수정되었습니다.", response));
    }
}
