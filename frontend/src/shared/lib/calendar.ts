import dayjs from 'dayjs';
import type { CalendarDayModel, WeeklyDayModel } from '../model/types';

const DAY_LABELS = ['일', '월', '화', '수', '목', '금', '토'];

export function buildWeeklyDays(
  weekStart: string, // 'YYYY-MM-DD' (항상 일요일 기준)
  selectedDate: string,
  scheduleDates: Set<string>,
  aiPlanDates: Set<string>,
  scheduleCountMap: Record<string, number>,
): WeeklyDayModel[] {
  const today = dayjs().format('YYYY-MM-DD');
  const start = dayjs(weekStart);

  return Array.from({ length: 7 }, (_, i) => {
    const d = start.add(i, 'day');
    const dateStr = d.format('YYYY-MM-DD');
    return {
      date: dateStr,
      dayNumber: d.date(),
      dayLabel: DAY_LABELS[i],
      isCurrentMonth: true,
      isToday: dateStr === today,
      isSelected: dateStr === selectedDate,
      hasSchedule: scheduleDates.has(dateStr),
      hasAiPlan: aiPlanDates.has(dateStr),
      scheduleCount: scheduleCountMap[dateStr] ?? 0,
    };
  });
}

export function buildCalendarDays(
  yearMonth: string, // 'YYYY-MM'
  selectedDate: string,
  scheduleDates: Set<string>,
  aiPlanDates: Set<string>,
  scheduleCountMap: Record<string, number>,
): CalendarDayModel[] {
  const today = dayjs().format('YYYY-MM-DD');
  const base = dayjs(yearMonth, 'YYYY-MM');
  const firstDay = base.startOf('month');
  const lastDay = base.endOf('month');

  // 캘린더 시작: 해당 월 1일의 요일(일=0)에 맞춰 이전 달 날짜 채움
  const startPad = firstDay.day(); // 0=일 ~ 6=토
  // 캘린더 끝: 마지막 날의 요일에 따라 다음 달 날짜 채움
  const endPad = 6 - lastDay.day();

  const days: CalendarDayModel[] = [];

  // 이전 달 패딩
  for (let i = startPad - 1; i >= 0; i--) {
    const d = firstDay.subtract(i + 1, 'day');
    const dateStr = d.format('YYYY-MM-DD');
    days.push(makeDay(dateStr, d.date(), false, today, selectedDate, scheduleDates, aiPlanDates, scheduleCountMap));
  }

  // 이번 달
  for (let d = 1; d <= lastDay.date(); d++) {
    const dateStr = base.date(d).format('YYYY-MM-DD');
    days.push(makeDay(dateStr, d, true, today, selectedDate, scheduleDates, aiPlanDates, scheduleCountMap));
  }

  // 다음 달 패딩
  for (let i = 1; i <= endPad; i++) {
    const d = lastDay.add(i, 'day');
    const dateStr = d.format('YYYY-MM-DD');
    days.push(makeDay(dateStr, d.date(), false, today, selectedDate, scheduleDates, aiPlanDates, scheduleCountMap));
  }

  return days;
}

function makeDay(
  dateStr: string,
  dayNumber: number,
  isCurrentMonth: boolean,
  today: string,
  selectedDate: string,
  scheduleDates: Set<string>,
  aiPlanDates: Set<string>,
  scheduleCountMap: Record<string, number>,
): CalendarDayModel {
  return {
    date: dateStr,
    dayNumber,
    isCurrentMonth,
    isToday: dateStr === today,
    isSelected: dateStr === selectedDate,
    hasSchedule: scheduleDates.has(dateStr),
    hasAiPlan: aiPlanDates.has(dateStr),
    scheduleCount: scheduleCountMap[dateStr] ?? 0,
  };
}
