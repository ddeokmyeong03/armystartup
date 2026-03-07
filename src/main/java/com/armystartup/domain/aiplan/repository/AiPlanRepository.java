package com.armystartup.domain.aiplan.repository;

import com.armystartup.domain.aiplan.entity.AiPlan;
import com.armystartup.domain.aiplan.entity.AiPlanStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface AiPlanRepository extends JpaRepository<AiPlan, Long> {

    List<AiPlan> findByUserIdAndRecommendedDateOrderByStartTimeAsc(Long userId, LocalDate date);

    List<AiPlan> findByUserIdAndRecommendedDateBetweenOrderByRecommendedDateAscStartTimeAsc(
            Long userId, LocalDate from, LocalDate to);

    // 해당 날짜의 RECOMMENDED 상태 계획만 (재추천 시 기존 삭제용)
    List<AiPlan> findByUserIdAndRecommendedDateAndStatus(
            Long userId, LocalDate date, AiPlanStatus status);
}
