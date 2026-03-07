package com.armystartup.domain.schedule.dto.request;

import com.armystartup.domain.schedule.entity.RepeatType;
import com.armystartup.domain.schedule.entity.ScheduleCategory;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
public class ScheduleUpdateRequest {

    @NotBlank(message = "제목은 필수입니다.")
    private String title;

    @NotNull(message = "날짜는 필수입니다.")
    private LocalDate scheduleDate;

    @NotNull(message = "시작 시간은 필수입니다.")
    private LocalTime startTime;

    @NotNull(message = "종료 시간은 필수입니다.")
    private LocalTime endTime;

    @NotNull(message = "반복 유형은 필수입니다.")
    private RepeatType repeatType;

    @NotNull(message = "카테고리는 필수입니다.")
    private ScheduleCategory category;

    private String memo;
}
