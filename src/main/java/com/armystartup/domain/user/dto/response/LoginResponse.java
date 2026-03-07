package com.armystartup.domain.user.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class LoginResponse {

    private Long userId;
    private String email;
    private String nickname;
    private String accessToken;
}
