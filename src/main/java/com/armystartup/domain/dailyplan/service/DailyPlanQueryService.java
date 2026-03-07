package com.armystartup.domain.dailyplan.service;

import com.armystartup.domain.aiplan.entity.AiPlan;
import com.armystartup.domain.aiplan.entity.AiPlanStatus;
import com.armystartup.domain.aiplan.repository.AiPlanRepository;
import com.armystartup.domain.dailyplan.dto.response.DailyAiPlanItem;
import com.armystartup.domain.dailyplan.dto.response.DailyPlanResponse;
import com.armystartup.domain.dailyplan.dto.response.DailyScheduleItem;
import com.armystartup.domain.schedule.entity.Schedule;
import com.armystartup.domain.schedule.repository.ScheduleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DailyPlanQueryService {

    private final ScheduleRepository scheduleRepository;
    private final AiPlanRepository aiPlanRepository;

    /**
     * 특정 날짜의 일반 일정 + AI 계획(APPLIED/COMPLETED/MISSED)을 통합 조회합니다.
     */
    @Transactional(readOnly = true)
    public DailyPlanResponse getDailyPlan(Long userId, LocalDate date) {
        // 일반 일정 조회
        List<Schedule> schedules = scheduleRepository
                .findByUserIdAndScheduleDateOrderByStartTimeAsc(userId, date);

        // AI 계획 조회 (적용된 것만 - RECOMMENDED 제외)
        List<AiPlan> allAiPlans = aiPlanRepository
                .findByUserIdAndRecommendedDateOrderByStartTimeAsc(userId, date);

        List<AiPlan> activeAiPlans = allAiPlans.stream()
                .filter(p -> p.getStatus() != AiPlanStatus.RECOMMENDED)
                .toList();

        List<DailyScheduleItem> scheduleItems = schedules.stream()
                .map(DailyScheduleItem::from)
                .toList();

        List<DailyAiPlanItem> aiPlanItems = activeAiPlans.stream()
                .map(DailyAiPlanItem::from)
                .toList();

        long completed = activeAiPlans.stream()
                .filter(p -> p.getStatus() == AiPlanStatus.COMPLETED)
                .count();

        long missed = activeAiPlans.stream()
                .filter(p -> p.getStatus() == AiPlanStatus.MISSED)
                .count();

        return DailyPlanResponse.builder()
                .date(date)
                .schedules(scheduleItems)
                .aiPlans(aiPlanItems)
                .totalSchedules(scheduleItems.size())
                .totalAiPlans(aiPlanItems.size())
                .completedAiPlans((int) completed)
                .missedAiPlans((int) missed)
                .build();
    }
}
