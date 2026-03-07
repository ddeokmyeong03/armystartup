package com.armystartup.domain.aiplan.service;

import com.armystartup.domain.aiplan.dto.request.AiPlanAdjustRequest;
import com.armystartup.domain.aiplan.dto.request.AiPlanBatchApplyRequest;
import com.armystartup.domain.aiplan.dto.request.AiPlanRecommendRequest;
import com.armystartup.domain.aiplan.dto.response.AiPlanResponse;
import com.armystartup.domain.aiplan.entity.AiPlan;
import com.armystartup.domain.aiplan.entity.AiPlanStatus;
import com.armystartup.domain.aiplan.repository.AiPlanRepository;
import com.armystartup.domain.goal.entity.Goal;
import com.armystartup.domain.goal.repository.GoalRepository;
import com.armystartup.domain.profile.entity.UserProfile;
import com.armystartup.domain.profile.repository.UserProfileRepository;
import com.armystartup.domain.schedule.entity.Schedule;
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
public class AiPlanService {

    private final AiPlanRepository aiPlanRepository;
    private final UserRepository userRepository;
    private final UserProfileRepository userProfileRepository;
    private final GoalRepository goalRepository;
    private final ScheduleRepository scheduleRepository;
    private final AiRecommendationService aiRecommendationService;

    /**
     * 특정 날짜에 대한 AI 추천 계획을 생성/저장합니다.
     * 이미 RECOMMENDED 상태의 계획이 있으면 삭제 후 재생성합니다.
     */
    @Transactional
    public List<AiPlanResponse> recommend(Long userId, AiPlanRecommendRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        UserProfile profile = userProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        LocalDate targetDate = request.getTargetDate();

        // 목표 목록 결정
        List<Goal> goals = resolveGoals(userId, request.getGoalIds());
        if (goals.isEmpty()) {
            throw new BusinessException(ErrorCode.GOAL_NOT_FOUND);
        }

        // 해당 날짜 일정 조회
        List<Schedule> schedules = scheduleRepository
                .findByUserIdAndScheduleDateOrderByStartTimeAsc(userId, targetDate);

        // 기존 RECOMMENDED 상태 계획 삭제 (재추천 허용)
        List<AiPlan> existing = aiPlanRepository
                .findByUserIdAndRecommendedDateAndStatus(userId, targetDate, AiPlanStatus.RECOMMENDED);
        aiPlanRepository.deleteAll(existing);

        // 추천 실행
        List<AiPlan> recommended = aiRecommendationService.recommend(user, profile, goals, schedules, targetDate);
        List<AiPlan> saved = aiPlanRepository.saveAll(recommended);

        return saved.stream().map(AiPlanResponse::from).toList();
    }

    /**
     * 날짜별 AI 계획 목록 조회
     */
    @Transactional(readOnly = true)
    public List<AiPlanResponse> getByDate(Long userId, LocalDate date) {
        return aiPlanRepository
                .findByUserIdAndRecommendedDateOrderByStartTimeAsc(userId, date)
                .stream()
                .map(AiPlanResponse::from)
                .toList();
    }

    /**
     * 추천 계획 적용 (RECOMMENDED → APPLIED)
     */
    @Transactional
    public AiPlanResponse apply(Long userId, Long planId) {
        AiPlan plan = findAndVerifyOwner(userId, planId);
        plan.apply();
        return AiPlanResponse.from(plan);
    }

    /**
     * 추천 계획 일괄 적용 (RECOMMENDED → APPLIED)
     */
    @Transactional
    public List<AiPlanResponse> applyBatch(Long userId, AiPlanBatchApplyRequest request) {
        return request.getPlanIds().stream()
                .map(planId -> {
                    AiPlan plan = findAndVerifyOwner(userId, planId);
                    plan.apply();
                    return AiPlanResponse.from(plan);
                })
                .toList();
    }

    /**
     * 추천 계획 시간 수동 조정
     */
    @Transactional
    public AiPlanResponse adjust(Long userId, Long planId, AiPlanAdjustRequest request) {
        AiPlan plan = findAndVerifyOwner(userId, planId);
        plan.adjustTime(request.getStartTime(), request.getEndTime());
        return AiPlanResponse.from(plan);
    }

    /**
     * 계획 수행 완료 체크 (APPLIED → COMPLETED)
     */
    @Transactional
    public AiPlanResponse complete(Long userId, Long planId) {
        AiPlan plan = findAndVerifyOwner(userId, planId);
        plan.complete();
        return AiPlanResponse.from(plan);
    }

    /**
     * 계획 미완료 기록 (APPLIED → MISSED)
     */
    @Transactional
    public AiPlanResponse miss(Long userId, Long planId) {
        AiPlan plan = findAndVerifyOwner(userId, planId);
        plan.miss();
        return AiPlanResponse.from(plan);
    }

    /**
     * 특정 날짜 추천 계획 재생성
     */
    @Transactional
    public List<AiPlanResponse> regenerate(Long userId, AiPlanRecommendRequest request) {
        return recommend(userId, request);
    }

    private List<Goal> resolveGoals(Long userId, List<Long> goalIds) {
        if (goalIds == null || goalIds.isEmpty()) {
            return goalRepository.findByUserIdAndIsActiveTrueOrderByCreatedAtDesc(userId);
        }
        return goalIds.stream()
                .map(id -> goalRepository.findById(id)
                        .filter(g -> g.getUser().getId().equals(userId))
                        .orElseThrow(() -> new BusinessException(ErrorCode.GOAL_NOT_FOUND)))
                .toList();
    }

    private AiPlan findAndVerifyOwner(Long userId, Long planId) {
        AiPlan plan = aiPlanRepository.findById(planId)
                .orElseThrow(() -> new BusinessException(ErrorCode.AI_PLAN_NOT_FOUND));
        if (!plan.getUser().getId().equals(userId)) {
            throw new BusinessException(ErrorCode.AI_PLAN_ACCESS_DENIED);
        }
        return plan;
    }
}
