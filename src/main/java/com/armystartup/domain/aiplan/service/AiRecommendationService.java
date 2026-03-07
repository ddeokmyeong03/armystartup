package com.armystartup.domain.aiplan.service;

import com.armystartup.domain.aiplan.entity.AiPlan;
import com.armystartup.domain.goal.entity.Goal;
import com.armystartup.domain.schedule.entity.Schedule;
import com.armystartup.domain.user.entity.User;
import com.armystartup.domain.profile.entity.UserProfile;

import java.time.LocalDate;
import java.util.List;

/**
 * AI 추천 엔진 인터페이스.
 * 현재는 규칙 기반(RuleBasedAiRecommendationService)으로 구현하며,
 * 이후 LlmAiRecommendationService 등으로 교체 가능하도록 추상화합니다.
 */
public interface AiRecommendationService {

    /**
     * 특정 날짜에 대해 사용자의 일정과 목표를 기반으로 자기개발 계획을 추천합니다.
     *
     * @param user      대상 사용자
     * @param profile   사용자 생활 패턴 프로필
     * @param goals     추천에 활용할 활성 목표 목록
     * @param schedules 해당 날짜의 기존 일정 목록
     * @param date      추천 대상 날짜
     * @return 추천된 AiPlan 목록 (저장 전 상태)
     */
    List<AiPlan> recommend(User user, UserProfile profile, List<Goal> goals,
                           List<Schedule> schedules, LocalDate date);
}
