package com.armystartup.domain.goal.repository;

import com.armystartup.domain.goal.entity.Goal;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GoalRepository extends JpaRepository<Goal, Long> {

    List<Goal> findByUserIdOrderByCreatedAtDesc(Long userId);

    List<Goal> findByUserIdAndIsActiveTrueOrderByCreatedAtDesc(Long userId);
}
