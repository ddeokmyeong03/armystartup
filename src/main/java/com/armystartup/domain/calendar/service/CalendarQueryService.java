package com.armystartup.domain.calendar.service;

import com.armystartup.domain.aiplan.entity.AiPlan;
import com.armystartup.domain.aiplan.repository.AiPlanRepository;
import com.armystartup.domain.calendar.dto.response.DailyCalendarDetailResponse;
import com.armystartup.domain.calendar.dto.response.MonthlyCalendarDayResponse;
import com.armystartup.domain.calendar.dto.response.MonthlyCalendarSummaryResponse;
import com.armystartup.domain.calendar.dto.response.WeeklyCalendarSummaryResponse;
import com.armystartup.domain.schedule.entity.Schedule;
import com.armystartup.domain.schedule.repository.ScheduleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
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

        Map<LocalDate, Long> scheduleCountByDate = countByDate(
                scheduleRepository.findByUserIdAndScheduleDateBetweenOrderByScheduleDateAscStartTimeAsc(userId, from, to),
                Schedule::getScheduleDate);
        Map<LocalDate, Long> aiPlanCountByDate = countByDate(
                aiPlanRepository.findByUserIdAndRecommendedDateBetweenOrderByRecommendedDateAscStartTimeAsc(userId, from, to),
                AiPlan::getRecommendedDate);

        List<MonthlyCalendarDayResponse> days = from.datesUntil(to.plusDays(1))
                .filter(date -> scheduleCountByDate.containsKey(date) || aiPlanCountByDate.containsKey(date))
                .map(date -> buildDayResponse(date, scheduleCountByDate, aiPlanCountByDate))
                .collect(Collectors.toList());

        return MonthlyCalendarSummaryResponse.builder()
                .year(year).month(month).days(days).build();
    }

    public WeeklyCalendarSummaryResponse getWeeklySummary(Long userId, LocalDate startDate) {
        // 항상 주의 시작(일요일)부터 7일
        LocalDate weekStart = startDate.with(DayOfWeek.SUNDAY);
        LocalDate weekEnd = weekStart.plusDays(6);

        Map<LocalDate, Long> scheduleCountByDate = countByDate(
                scheduleRepository.findByUserIdAndScheduleDateBetweenOrderByScheduleDateAscStartTimeAsc(userId, weekStart, weekEnd),
                Schedule::getScheduleDate);
        Map<LocalDate, Long> aiPlanCountByDate = countByDate(
                aiPlanRepository.findByUserIdAndRecommendedDateBetweenOrderByRecommendedDateAscStartTimeAsc(userId, weekStart, weekEnd),
                AiPlan::getRecommendedDate);

        List<MonthlyCalendarDayResponse> days = weekStart.datesUntil(weekEnd.plusDays(1))
                .map(date -> buildDayResponse(date, scheduleCountByDate, aiPlanCountByDate))
                .collect(Collectors.toList());

        return WeeklyCalendarSummaryResponse.builder()
                .startDate(weekStart).endDate(weekEnd).days(days).build();
    }

    public DailyCalendarDetailResponse getDailyDetail(Long userId, LocalDate date) {
        List<Schedule> schedules = scheduleRepository
                .findByUserIdAndScheduleDateOrderByStartTimeAsc(userId, date);
        List<AiPlan> aiPlans = aiPlanRepository
                .findByUserIdAndRecommendedDateOrderByStartTimeAsc(userId, date);

        List<DailyCalendarDetailResponse.ScheduleItem> scheduleItems = schedules.stream()
                .map(s -> DailyCalendarDetailResponse.ScheduleItem.builder()
                        .id(s.getId()).title(s.getTitle())
                        .startTime(s.getStartTime()).endTime(s.getEndTime())
                        .category(s.getCategory().name()).memo(s.getMemo()).build())
                .collect(Collectors.toList());

        List<DailyCalendarDetailResponse.AiPlanItem> aiPlanItems = aiPlans.stream()
                .map(p -> DailyCalendarDetailResponse.AiPlanItem.builder()
                        .id(p.getId()).title(p.getActivityTitle())
                        .startTime(p.getStartTime()).endTime(p.getEndTime())
                        .status(p.getStatus()).goalTitle(p.getGoal().getTitle()).build())
                .collect(Collectors.toList());

        return DailyCalendarDetailResponse.builder()
                .date(date).schedules(scheduleItems).aiPlans(aiPlanItems).build();
    }

    private <T> Map<LocalDate, Long> countByDate(List<T> items, java.util.function.Function<T, LocalDate> dateExtractor) {
        return items.stream().collect(Collectors.groupingBy(dateExtractor, Collectors.counting()));
    }

    private MonthlyCalendarDayResponse buildDayResponse(
            LocalDate date,
            Map<LocalDate, Long> scheduleCountByDate,
            Map<LocalDate, Long> aiPlanCountByDate) {
        int schCount = scheduleCountByDate.getOrDefault(date, 0L).intValue();
        int aiCount = aiPlanCountByDate.getOrDefault(date, 0L).intValue();
        return MonthlyCalendarDayResponse.builder()
                .date(date).scheduleCount(schCount).aiPlanCount(aiCount)
                .hasSchedule(schCount > 0).hasAiPlan(aiCount > 0).build();
    }
}
