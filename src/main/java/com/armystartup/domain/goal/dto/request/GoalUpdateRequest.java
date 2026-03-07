package com.armystartup.domain.goal.dto.request;

import com.armystartup.domain.goal.entity.GoalType;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;

@Getter
public class GoalUpdateRequest {

    @NotBlank(message = "목표 제목은 필수입니다.")
    private String title;

    @NotNull(message = "목표 유형은 필수입니다.")
    private GoalType type;

    private String targetDescription;

    @Min(value = 10, message = "회당 학습 시간은 10분 이상이어야 합니다.")
    @Max(value = 480, message = "회당 학습 시간은 480분 이하여야 합니다.")
    private Integer preferredMinutesPerSession;

    @Min(value = 1, message = "주당 횟수는 1회 이상이어야 합니다.")
    @Max(value = 7, message = "주당 횟수는 7회 이하여야 합니다.")
    private Integer preferredSessionsPerWeek;
}
