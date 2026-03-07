package com.armystartup.domain.profile.dto.response;

import com.armystartup.domain.profile.entity.PlanIntensity;
import com.armystartup.domain.profile.entity.UserProfile;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalTime;

@Getter
@Builder
public class UserProfileResponse {

    private Long id;
    private Long userId;
    private LocalTime wakeUpTime;
    private LocalTime sleepTime;
    private String weekdayPattern;
    private String weekendPattern;
    private Integer availableStudyMinutes;
    private PlanIntensity preferredPlanIntensity;
    private String memo;

    public static UserProfileResponse from(UserProfile profile) {
        return UserProfileResponse.builder()
                .id(profile.getId())
                .userId(profile.getUser().getId())
                .wakeUpTime(profile.getWakeUpTime())
                .sleepTime(profile.getSleepTime())
                .weekdayPattern(profile.getWeekdayPattern())
                .weekendPattern(profile.getWeekendPattern())
                .availableStudyMinutes(profile.getAvailableStudyMinutes())
                .preferredPlanIntensity(profile.getPreferredPlanIntensity())
                .memo(profile.getMemo())
                .build();
    }
}
