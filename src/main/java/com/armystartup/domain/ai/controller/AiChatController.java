package com.armystartup.domain.ai.controller;

import com.armystartup.domain.ai.dto.request.AiChatRequest;
import com.armystartup.domain.ai.dto.response.AiChatResponse;
import com.armystartup.domain.ai.service.AiChatService;
import com.armystartup.global.common.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "AI Chat", description = "AI 자기개발 가이드 채팅 API")
@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AiChatController {

    private final AiChatService aiChatService;

    @Operation(summary = "AI 채팅", description = "자기개발 관련 질문을 입력하면 AI가 맞춤 조언을 제공합니다.")
    @PostMapping("/chat")
    public ApiResponse<AiChatResponse> chat(@Valid @RequestBody AiChatRequest request) {
        AiChatResponse response = aiChatService.chat(request);
        return ApiResponse.success("AI 답변을 받았습니다.", response);
    }
}
