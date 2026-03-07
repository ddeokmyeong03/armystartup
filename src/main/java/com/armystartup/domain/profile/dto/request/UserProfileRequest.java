package com.armystartup.domain.profile.dto.request;

import com.armystartup.domain.profile.entity.PlanIntensity;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;

import java.time.LocalTime;

@Getter
public class UserProfileRequest {

    @NotNull(message = "기상 시간은 필수입니다.")
    private LocalTime wakeUpTime;

    @NotNull(message = "취침 시간은 필수입니다.")
    private LocalTime sleepTime;

    private String weekdayPattern;

    private String weekendPattern;

    @Min(value = 0, message = "학습 가능 시간은 0분 이상이어야 합니다.")
    @Max(value = 1440, message = "학습 가능 시간은 1440분 이하여야 합니다.")
    private Integer availableStudyMinutes;

    @NotNull(message = "계획 강도는 필수입니다.")
    private PlanIntensity preferredPlanIntensity;

    private String memo;
}
