package com.armystartup.domain.goal.service;

import com.armystartup.domain.goal.dto.request.GoalCreateRequest;
import com.armystartup.domain.goal.dto.request.GoalUpdateRequest;
import com.armystartup.domain.goal.dto.response.GoalResponse;
import com.armystartup.domain.goal.entity.Goal;
import com.armystartup.domain.goal.repository.GoalRepository;
import com.armystartup.domain.user.entity.User;
import com.armystartup.domain.user.repository.UserRepository;
import com.armystartup.global.exception.BusinessException;
import com.armystartup.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class GoalService {

    private final GoalRepository goalRepository;
    private final UserRepository userRepository;

    @Transactional
    public GoalResponse create(Long userId, GoalCreateRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        Goal goal = Goal.builder()
                .user(user)
                .title(request.getTitle())
                .type(request.getType())
                .targetDescription(request.getTargetDescription())
                .preferredMinutesPerSession(request.getPreferredMinutesPerSession())
                .preferredSessionsPerWeek(request.getPreferredSessionsPerWeek())
                .build();

        return GoalResponse.from(goalRepository.save(goal));
    }

    @Transactional(readOnly = true)
    public List<GoalResponse> getAll(Long userId, boolean activeOnly) {
        List<Goal> goals = activeOnly
                ? goalRepository.findByUserIdAndIsActiveTrueOrderByCreatedAtDesc(userId)
                : goalRepository.findByUserIdOrderByCreatedAtDesc(userId);
        return goals.stream().map(GoalResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public GoalResponse getOne(Long userId, Long goalId) {
        Goal goal = findAndVerifyOwner(userId, goalId);
        return GoalResponse.from(goal);
    }

    @Transactional
    public GoalResponse update(Long userId, Long goalId, GoalUpdateRequest request) {
        Goal goal = findAndVerifyOwner(userId, goalId);
        goal.update(
                request.getTitle(),
                request.getType(),
                request.getTargetDescription(),
                request.getPreferredMinutesPerSession(),
                request.getPreferredSessionsPerWeek()
        );
        return GoalResponse.from(goal);
    }

    @Transactional
    public void delete(Long userId, Long goalId) {
        Goal goal = findAndVerifyOwner(userId, goalId);
        goalRepository.delete(goal);
    }

    @Transactional
    public GoalResponse toggleActive(Long userId, Long goalId) {
        Goal goal = findAndVerifyOwner(userId, goalId);
        if (goal.getIsActive()) {
            goal.deactivate();
        } else {
            goal.activate();
        }
        return GoalResponse.from(goal);
    }

    private Goal findAndVerifyOwner(Long userId, Long goalId) {
        Goal goal = goalRepository.findById(goalId)
                .orElseThrow(() -> new BusinessException(ErrorCode.GOAL_NOT_FOUND));
        if (!goal.getUser().getId().equals(userId)) {
            throw new BusinessException(ErrorCode.GOAL_ACCESS_DENIED);
        }
        return goal;
    }
}
