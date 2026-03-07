package com.armystartup.domain.calendar.service;

import com.armystartup.domain.aiplan.entity.AiPlan;
import com.armystartup.domain.aiplan.repository.AiPlanRepository;
import com.armystartup.domain.calendar.dto.response.DailyCalendarDetailResponse;
import com.armystartup.domain.calendar.dto.response.MonthlyCalendarDayResponse;
import com.armystartup.domain.calendar.dto.response.MonthlyCalendarSummaryResponse;
import com.armystartup.domain.schedule.entity.Schedule;
import com.armystartup.domain.schedule.repository.ScheduleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CalendarQueryService {

    private final ScheduleRepository scheduleRepository;
    private final AiPlanRepository aiPlanRepository;

    public MonthlyCalendarSummaryResponse getMonthlySummary(Long userId, int year, int month) {
        YearMonth yearMonth = YearMonth.of(year, month);
        LocalDate from = yearMonth.atDay(1);
        LocalDate to = yearMonth.atEndOfMonth();

        List<Schedule> schedules = scheduleRepository
                .findByUserIdAndScheduleDateBetweenOrderByScheduleDateAscStartTimeAsc(userId, from, to);
        List<AiPlan> aiPlans = aiPlanRepository
                .findByUserIdAndRecommendedDateBetweenOrderByRecommendedDateAscStartTimeAsc(userId, from, to);

        // 날짜별 일정 수 집계
        Map<LocalDate, Long> scheduleCountByDate = schedules.stream()
                .collect(Collectors.groupingBy(Schedule::getScheduleDate, Collectors.counting()));

        // 날짜별 AI 계획 수 집계
        Map<LocalDate, Long> aiPlanCountByDate = aiPlans.stream()
                .collect(Collectors.groupingBy(AiPlan::getRecommendedDate, Collectors.counting()));

        // 해당 월의 모든 날짜에 대해 요약 생성 (일정이 있는 날만)
        List<MonthlyCalendarDayResponse> days = from.datesUntil(to.plusDays(1))
                .filter(date -> scheduleCountByDate.containsKey(date) || aiPlanCountByDate.containsKey(date))
                .map(date -> {
                    int schCount = scheduleCountByDate.getOrDefault(date, 0L).intValue();
                    int aiCount = aiPlanCountByDate.getOrDefault(date, 0L).intValue();
                    return MonthlyCalendarDayResponse.builder()
                            .date(date)
                            .scheduleCount(schCount)
                            .aiPlanCount(aiCount)
                            .hasSchedule(schCount > 0)
                            .hasAiPlan(aiCount > 0)
                            .build();
                })
                .collect(Collectors.toList());

        return MonthlyCalendarSummaryResponse.builder()
                .year(year)
                .month(month)
                .days(days)
                .build();
    }

    public DailyCalendarDetailResponse getDailyDetail(Long userId, LocalDate date) {
        List<Schedule> schedules = scheduleRepository
                .findByUserIdAndScheduleDateOrderByStartTimeAsc(userId, date);
        List<AiPlan> aiPlans = aiPlanRepository
                .findByUserIdAndRecommendedDateOrderByStartTimeAsc(userId, date);

        List<DailyCalendarDetailResponse.ScheduleItem> scheduleItems = schedules.stream()
                .map(s -> DailyCalendarDetailResponse.ScheduleItem.builder()
                        .id(s.getId())
                        .title(s.getTitle())
                        .startTime(s.getStartTime())
                        .endTime(s.getEndTime())
                        .category(s.getCategory().name())
                        .memo(s.getMemo())
                        .build())
                .collect(Collectors.toList());

        List<DailyCalendarDetailResponse.AiPlanItem> aiPlanItems = aiPlans.stream()
                .map(p -> DailyCalendarDetailResponse.AiPlanItem.builder()
                        .id(p.getId())
                        .title(p.getActivityTitle())
                        .startTime(p.getStartTime())
                        .endTime(p.getEndTime())
                        .status(p.getStatus())
                        .goalTitle(p.getGoal().getTitle())
                        .build())
                .collect(Collectors.toList());

        return DailyCalendarDetailResponse.builder()
                .date(date)
                .schedules(scheduleItems)
                .aiPlans(aiPlanItems)
                .build();
    }
}
