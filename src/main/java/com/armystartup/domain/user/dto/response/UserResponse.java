package com.armystartup.domain.user.dto.response;

import com.armystartup.domain.user.entity.AuthProvider;
import com.armystartup.domain.user.entity.User;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class UserResponse {

    private Long id;
    private String email;
    private String nickname;
    private String phoneNumber;
    private AuthProvider provider;
    private LocalDateTime createdAt;

    public static UserResponse from(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .nickname(user.getNickname())
                .phoneNumber(user.getPhoneNumber())
                .provider(user.getProvider())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
