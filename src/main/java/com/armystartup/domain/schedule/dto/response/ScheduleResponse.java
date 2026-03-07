package com.armystartup.domain.schedule.dto.response;

import com.armystartup.domain.schedule.entity.RepeatType;
import com.armystartup.domain.schedule.entity.Schedule;
import com.armystartup.domain.schedule.entity.ScheduleCategory;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Builder
public class ScheduleResponse {

    private Long id;
    private String title;
    private LocalDate scheduleDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private RepeatType repeatType;
    private ScheduleCategory category;
    private String memo;

    public static ScheduleResponse from(Schedule schedule) {
        return ScheduleResponse.builder()
                .id(schedule.getId())
                .title(schedule.getTitle())
                .scheduleDate(schedule.getScheduleDate())
                .startTime(schedule.getStartTime())
                .endTime(schedule.getEndTime())
                .repeatType(schedule.getRepeatType())
                .category(schedule.getCategory())
                .memo(schedule.getMemo())
                .build();
    }
}
