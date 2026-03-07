package com.armystartup.domain.main.service;

import com.armystartup.domain.aiplan.entity.AiPlan;
import com.armystartup.domain.aiplan.repository.AiPlanRepository;
import com.armystartup.domain.calendar.dto.response.MonthlyCalendarDayResponse;
import com.armystartup.domain.calendar.service.CalendarQueryService;
import com.armystartup.domain.calendar.dto.response.WeeklyCalendarSummaryResponse;
import com.armystartup.domain.goal.repository.GoalRepository;
import com.armystartup.domain.main.dto.response.MainHomeResponse;
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
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MainHomeService {

    private final UserRepository userRepository;
    private final ScheduleRepository scheduleRepository;
    private final AiPlanRepository aiPlanRepository;
    private final GoalRepository goalRepository;
    private final CalendarQueryService calendarQueryService;

    public MainHomeResponse getHome(Long userId, LocalDate weekStartDate, LocalDate selectedDate) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        // 주간 캘린더
        WeeklyCalendarSummaryResponse weekly = calendarQueryService.getWeeklySummary(userId, weekStartDate);

        // 선택 날짜 일정
        List<Schedule> schedules = scheduleRepository
                .findByUserIdAndScheduleDateOrderByStartTimeAsc(userId, selectedDate);
        List<AiPlan> aiPlans = aiPlanRepository
                .findByUserIdAndRecommendedDateOrderByStartTimeAsc(userId, selectedDate);

        // 활성 목표 여부
        boolean hasActiveGoal = !goalRepository.findByUserIdAndIsActiveTrueOrderByCreatedAtDesc(userId).isEmpty();

        List<MainHomeResponse.ScheduleItem> scheduleItems = schedules.stream()
                .map(s -> MainHomeResponse.ScheduleItem.builder()
                        .id(s.getId()).title(s.getTitle())
                        .startTime(s.getStartTime()).endTime(s.getEndTime())
                        .category(s.getCategory().name()).memo(s.getMemo()).build())
                .collect(Collectors.toList());

        List<MainHomeResponse.AiPlanItem> aiPlanItems = aiPlans.stream()
                .map(p -> MainHomeResponse.AiPlanItem.builder()
                        .id(p.getId()).title(p.getActivityTitle())
                        .startTime(p.getStartTime()).endTime(p.getEndTime())
                        .status(p.getStatus().name())
                        .goalTitle(p.getGoal().getTitle()).build())
                .collect(Collectors.toList());

        return MainHomeResponse.builder()
                .user(MainHomeResponse.UserSummary.builder()
                        .nickname(user.getNickname())
                        .statusMessage(null)
                        .profileImageUrl(null)
                        .build())
                .unreadNotificationCount(0)
                .pendingFriendRequestCount(0)
                .hasActiveGoal(hasActiveGoal)
                .weekStartDate(weekly.getStartDate())
                .weekEndDate(weekly.getEndDate())
                .weeklyCalendarDays(weekly.getDays())
                .selectedDate(selectedDate)
                .todaySchedules(scheduleItems)
                .todayAiPlans(aiPlanItems)
                .build();
    }
}
