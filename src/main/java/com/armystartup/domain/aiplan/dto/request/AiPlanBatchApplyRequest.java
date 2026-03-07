package com.armystartup.domain.aiplan.dto.request;

import jakarta.validation.constraints.NotEmpty;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor
public class AiPlanBatchApplyRequest {

    @NotEmpty(message = "적용할 계획 ID 목록은 필수입니다.")
    private List<Long> planIds;
}
