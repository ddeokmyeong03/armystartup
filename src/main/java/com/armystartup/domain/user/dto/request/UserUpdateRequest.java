package com.armystartup.domain.user.dto.request;

import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class UserUpdateRequest {

    @Size(min = 2, max = 20, message = "닉네임은 2~20자 사이여야 합니다.")
    private String nickname;

    @Size(max = 20, message = "전화번호는 20자 이하여야 합니다.")
    private String phoneNumber;
}
