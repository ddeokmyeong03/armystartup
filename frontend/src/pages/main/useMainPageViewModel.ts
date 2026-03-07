import { useState, useMemo } from 'react';
import dayjs from 'dayjs';
import { buildCalendarDays } from '../../shared/lib/calendar';
import {
  mockUser,
  mockChips,
  mockSchedulesByDate,
  mockAiPlansByDate,
} from '../../shared/model/mock';

export function useMainPageViewModel() {
  const [yearMonth, setYearMonth] = useState(() => dayjs().format('YYYY-MM'));
  const [selectedDate, setSelectedDate] = useState(() => dayjs().format('YYYY-MM-DD'));

  const scheduleDates = useMemo(
    () => new Set(Object.keys(mockSchedulesByDate)),
    [],
  );
  const aiPlanDates = useMemo(
    () => new Set(Object.keys(mockAiPlansByDate)),
    [],
  );
  const scheduleCountMap = useMemo(() => {
    const map: Record<string, number> = {};
    for (const [date, list] of Object.entries(mockSchedulesByDate)) {
      map[date] = list.length;
    }
    return map;
  }, []);

  const calendarDays = useMemo(
    () => buildCalendarDays(yearMonth, selectedDate, scheduleDates, aiPlanDates, scheduleCountMap),
    [yearMonth, selectedDate, scheduleDates, aiPlanDates, scheduleCountMap],
  );

  const selectedDateSchedules = mockSchedulesByDate[selectedDate] ?? [];
  const selectedDateAiPlans = mockAiPlansByDate[selectedDate] ?? [];

  const yearMonthLabel = dayjs(yearMonth, 'YYYY-MM').format('YYYY.MM');

  function onPrevMonth() {
    setYearMonth((prev) => dayjs(prev, 'YYYY-MM').subtract(1, 'month').format('YYYY-MM'));
  }
  function onNextMonth() {
    setYearMonth((prev) => dayjs(prev, 'YYYY-MM').add(1, 'month').format('YYYY-MM'));
  }
  function onSelectDate(date: string) {
    setSelectedDate(date);
    // 다른 달 날짜 클릭 시 해당 달로 이동
    const clickedYM = dayjs(date).format('YYYY-MM');
    if (clickedYM !== yearMonth) setYearMonth(clickedYM);
  }

  return {
    user: mockUser,
    chips: mockChips,
    yearMonthLabel,
    calendarDays,
    selectedDate,
    selectedDateSchedules,
    selectedDateAiPlans,
    onPrevMonth,
    onNextMonth,
    onSelectDate,
  };
}
