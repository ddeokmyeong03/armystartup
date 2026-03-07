package com.armystartup.domain.aiplan.service;

import com.armystartup.domain.aiplan.entity.AiPlan;
import com.armystartup.domain.goal.entity.Goal;
import com.armystartup.domain.profile.entity.PlanIntensity;
import com.armystartup.domain.profile.entity.UserProfile;
import com.armystartup.domain.schedule.entity.Schedule;
import com.armystartup.domain.user.entity.User;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

/**
 * 규칙 기반 AI 추천 엔진.
 *
 * 추천 규칙:
 * 1. 기상/취침 시간을 기준으로 활동 가능한 시간대 결정
 * 2. 너무 이른 시간(기상 후 30분), 너무 늦은 시간(취침 30분 전)은 배제
 * 3. 기존 일정이 차지한 시간대를 제외하고 빈 슬롯 탐색
 * 4. 빈 슬롯을 목표별 희망 시간/강도에 맞춰 배치
 * 5. 연속 2시간 이상 배치 금지 (중간 휴식 보장)
 * 6. 강도에 따라 하루 최대 배치 시간 제한 (LIGHT: 60분, MODERATE: 120분, INTENSIVE: 180분)
 */
@Service
public class RuleBasedAiRecommendationService implements AiRecommendationService {

    private static final int BUFFER_MINUTES = 30;      // 기상/취침 전후 버퍼
    private static final int MIN_SLOT_MINUTES = 20;    // 최소 추천 슬롯 길이
    private static final int MAX_CONTINUOUS_MINUTES = 90; // 연속 배치 최대 시간

    @Override
    public List<AiPlan> recommend(User user, UserProfile profile, List<Goal> goals,
                                  List<Schedule> schedules, LocalDate date) {
        List<AiPlan> result = new ArrayList<>();
        if (goals.isEmpty()) return result;

        // 1. 활동 가능 시간대 계산 (기상 + 버퍼 ~ 취침 - 버퍼)
        LocalTime availableStart = profile.getWakeUpTime().plusMinutes(BUFFER_MINUTES);
        LocalTime availableEnd = profile.getSleepTime().minusMinutes(BUFFER_MINUTES);

        if (!availableStart.isBefore(availableEnd)) return result;

        // 2. 기존 일정으로 점유된 구간 목록 생성
        List<TimeSlot> occupied = schedules.stream()
                .map(s -> new TimeSlot(s.getStartTime(), s.getEndTime()))
                .sorted()
                .toList();

        // 3. 빈 시간 슬롯 탐색
        List<TimeSlot> freeSlots = findFreeSlots(availableStart, availableEnd, occupied);

        // 4. 강도에 따른 하루 최대 배치 시간 (분)
        int maxDailyMinutes = switch (profile.getPreferredPlanIntensity()) {
            case LIGHT -> 60;
            case MODERATE -> 120;
            case INTENSIVE -> 180;
        };

        // 5. 목표별로 순환하며 빈 슬롯에 배치
        int totalAssigned = 0;
        int goalIndex = 0;

        for (TimeSlot slot : freeSlots) {
            if (totalAssigned >= maxDailyMinutes) break;
            if (goals.isEmpty()) break;

            Goal goal = goals.get(goalIndex % goals.size());
            int desiredMinutes = resolveDesiredMinutes(goal, profile.getPreferredPlanIntensity());

            // 슬롯이 너무 짧으면 스킵
            int slotMinutes = minutesBetween(slot.start(), slot.end());
            if (slotMinutes < MIN_SLOT_MINUTES) continue;

            // 실제 배치할 시간 결정 (연속 최대, 하루 남은 시간, 슬롯 크기, 목표 시간 중 최소)
            int remaining = maxDailyMinutes - totalAssigned;
            int canAssign = Math.min(remaining, Math.min(MAX_CONTINUOUS_MINUTES, Math.min(slotMinutes, desiredMinutes)));
            if (canAssign < MIN_SLOT_MINUTES) continue;

            LocalTime planEnd = slot.start().plusMinutes(canAssign);
            result.add(AiPlan.builder()
                    .user(user)
                    .goal(goal)
                    .recommendedDate(date)
                    .startTime(slot.start())
                    .endTime(planEnd)
                    .activityTitle(goal.getTitle())
                    .build());

            totalAssigned += canAssign;
            goalIndex++;
        }

        return result;
    }

    /**
     * 기존 일정(occupied)을 제외한 빈 시간 슬롯을 반환합니다.
     */
    private List<TimeSlot> findFreeSlots(LocalTime start, LocalTime end, List<TimeSlot> occupied) {
        List<TimeSlot> free = new ArrayList<>();
        LocalTime cursor = start;

        for (TimeSlot busy : occupied) {
            // 바쁜 구간이 현재 커서 이후에 시작하면 그 전까지 빈 슬롯
            if (busy.start().isAfter(cursor)) {
                LocalTime freeEnd = busy.start().isBefore(end) ? busy.start() : end;
                if (cursor.isBefore(freeEnd)) {
                    free.add(new TimeSlot(cursor, freeEnd));
                }
            }
            // 커서를 바쁜 구간 끝으로 이동
            if (busy.end().isAfter(cursor)) {
                cursor = busy.end();
            }
        }

        // 마지막 빈 슬롯
        if (cursor.isBefore(end)) {
            free.add(new TimeSlot(cursor, end));
        }

        return free;
    }

    /**
     * 목표와 강도를 반영한 실제 배치 희망 시간(분)을 결정합니다.
     */
    private int resolveDesiredMinutes(Goal goal, PlanIntensity intensity) {
        int base = goal.getPreferredMinutesPerSession() != null
                ? goal.getPreferredMinutesPerSession()
                : 30; // 기본값 30분

        return switch (intensity) {
            case LIGHT -> Math.max(MIN_SLOT_MINUTES, (int) (base * 0.7));
            case MODERATE -> base;
            case INTENSIVE -> Math.min(MAX_CONTINUOUS_MINUTES, (int) (base * 1.3));
        };
    }

    private int minutesBetween(LocalTime from, LocalTime to) {
        return (int) java.time.Duration.between(from, to).toMinutes();
    }

    private record TimeSlot(LocalTime start, LocalTime end) implements Comparable<TimeSlot> {
        @Override
        public int compareTo(TimeSlot other) {
            return this.start.compareTo(other.start);
        }
    }
}
