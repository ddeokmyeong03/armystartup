package com.armystartup.domain.ai.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class AiChatResponse {

    private String reply;
    private LocalDateTime timestamp;
}
