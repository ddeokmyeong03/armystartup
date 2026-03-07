package com.armystartup.domain.schedule.repository;

import com.armystartup.domain.schedule.entity.Schedule;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface ScheduleRepository extends JpaRepository<Schedule, Long> {

    List<Schedule> findByUserIdOrderByScheduleDateAscStartTimeAsc(Long userId);

    List<Schedule> findByUserIdAndScheduleDateOrderByStartTimeAsc(Long userId, LocalDate scheduleDate);

    List<Schedule> findByUserIdAndScheduleDateBetweenOrderByScheduleDateAscStartTimeAsc(
            Long userId, LocalDate from, LocalDate to);
}
