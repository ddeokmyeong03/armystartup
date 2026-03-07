package com.armystartup.domain.aiplan.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;

import java.time.LocalDate;
import java.util.List;

@Getter
public class AiPlanRecommendRequest {

    @NotNull(message = "추천 날짜는 필수입니다.")
    private LocalDate targetDate;

    // null 이면 활성 목표 전체 사용, 지정하면 해당 목표만 포함
    private List<Long> goalIds;
}
