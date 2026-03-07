package com.armystartup.domain.dashboard.service;

import com.armystartup.domain.aiplan.entity.AiPlan;
import com.armystartup.domain.aiplan.entity.AiPlanStatus;
import com.armystartup.domain.aiplan.repository.AiPlanRepository;
import com.armystartup.domain.dashboard.dto.response.DashboardHomeResponse;
import com.armystartup.domain.goal.repository.GoalRepository;
import com.armystartup.domain.schedule.repository.ScheduleRepository;
import com.armystartup.domain.user.entity.User;
import com.armystartup.domain.user.repository.UserRepository;
import com.armystartup.global.exception.BusinessException;
import com.armystartup.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DashboardService {

    private final UserRepository userRepository;
    private final ScheduleRepository scheduleRepository;
    private final AiPlanRepository aiPlanRepository;
    private final GoalRepository goalRepository;

    public DashboardHomeResponse getHome(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        LocalDate today = LocalDate.now();

        int todayScheduleCount = scheduleRepository
                .findByUserIdAndScheduleDateOrderByStartTimeAsc(userId, today).size();

        List<AiPlan> todayAiPlans = aiPlanRepository
                .findByUserIdAndRecommendedDateOrderByStartTimeAsc(userId, today);

        int todayAiPlanCount = todayAiPlans.size();
        int completedPlanCount = (int) todayAiPlans.stream()
                .filter(p -> p.getStatus() == AiPlanStatus.COMPLETED)
                .count();

        int activeGoalCount = goalRepository
                .findByUserIdAndIsActiveTrueOrderByCreatedAtDesc(userId).size();

        return DashboardHomeResponse.builder()
                .nickname(user.getNickname())
                .todayScheduleCount(todayScheduleCount)
                .todayAiPlanCount(todayAiPlanCount)
                .completedPlanCount(completedPlanCount)
                .activeGoalCount(activeGoalCount)
                .build();
    }
}
