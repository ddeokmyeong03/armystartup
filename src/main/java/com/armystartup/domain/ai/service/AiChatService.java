package com.armystartup.domain.ai.service;

import com.armystartup.domain.ai.client.OpenAiClient;
import com.armystartup.domain.ai.dto.request.AiChatRequest;
import com.armystartup.domain.ai.dto.response.AiChatResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AiChatService {

    private final OpenAiClient openAiClient;

    private static final String SYSTEM_PROMPT = """
            당신은 대한민국 군 복무 중인 병사를 위한 자기개발 AI 플래너입니다.
            병사의 질문에 공감하며 실용적이고 짧은 조언을 제공합니다.
            군 생활의 특성(훈련, 점호, 외박, 자유시간 등)을 이해하고,
            제한된 시간을 최대한 활용할 수 있는 자기개발 방법을 안내합니다.
            답변은 친근하고 간결하게 3~5문장 이내로 합니다.
            """;

    public AiChatResponse chat(AiChatRequest request) {
        String reply = openAiClient.chat(SYSTEM_PROMPT, request.getMessage());
        return AiChatResponse.builder()
                .reply(reply)
                .timestamp(LocalDateTime.now())
                .build();
    }
}
