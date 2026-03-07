package com.armystartup.domain.dailyplan.dto.response;

import com.armystartup.domain.schedule.entity.Schedule;
import com.armystartup.domain.schedule.entity.ScheduleCategory;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalTime;

@Getter
@Builder
public class DailyScheduleItem {

    private Long id;
    private String title;
    private LocalTime startTime;
    private LocalTime endTime;
    private ScheduleCategory category;
    private String memo;

    public static DailyScheduleItem from(Schedule schedule) {
        return DailyScheduleItem.builder()
                .id(schedule.getId())
                .title(schedule.getTitle())
                .startTime(schedule.getStartTime())
                .endTime(schedule.getEndTime())
                .category(schedule.getCategory())
                .memo(schedule.getMemo())
                .build();
    }
}
