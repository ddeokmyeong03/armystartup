package com.armystartup.domain.ai.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class AiChatRequest {

    @NotBlank(message = "메시지를 입력해 주세요.")
    @Size(max = 1000, message = "메시지는 1000자 이내로 입력해 주세요.")
    private String message;
}
