import { useState, useMemo, useCallback, useEffect } from 'react';
import dayjs from 'dayjs';
import { buildWeeklyDays } from '../../shared/lib/calendar';
import { mockChips, mockSchedulesByDate, mockAiPlansByDate } from '../../shared/model/mock';
import type { CourseRecommendationModel, UserModel } from '../../shared/model/types';
import apiClient from '../../shared/lib/apiClient';
import { getNickname } from '../../shared/lib/auth';

function getSundayOfWeek(date: string): string {
  return dayjs(date).startOf('week').format('YYYY-MM-DD');
}

export function useMainPageViewModel() {
  const [selectedDate, setSelectedDate] = useState(() => dayjs().format('YYYY-MM-DD'));
  const [weekStart, setWeekStart] = useState(() => getSundayOfWeek(dayjs().format('YYYY-MM-DD')));

  const user: UserModel = {
    id: 0,
    nickname: getNickname(),
    email: '',
    message: '오늘 하루도 파이팅!',
  };

  // 강의 추천 상태
  const [courseRecommendations, setCourseRecommendations] = useState<CourseRecommendationModel[]>([]);
  const [courseLoading, setCourseLoading] = useState(false);

  // 일정 마커 상태
  const [scheduleDates, setScheduleDates] = useState<Set<string>>(() => new Set(Object.keys(mockSchedulesByDate)));
  const [aiPlanDates, setAiPlanDates] = useState<Set<string>>(() => new Set(Object.keys(mockAiPlansByDate)));
  const [scheduleCountMap, setScheduleCountMap] = useState<Record<string, number>>(() => {
    const map: Record<string, number> = {};
    for (const [date, list] of Object.entries(mockSchedulesByDate)) map[date] = list.length;
    return map;
  });

  // 주간 캘린더 마커 API
  useEffect(() => {
    apiClient
      .get<{
        data: {
          days: Array<{
            date: string;
            scheduleCount: number;
            aiPlanCount: number;
            hasSchedule: boolean;
            hasAiPlan: boolean;
          }>;
        };
      }>(`/api/calendar/weekly-summary?startDate=${weekStart}`)
      .then((res) => {
        const days = res.data.data.days;
        const newScheduleDates = new Set<string>();
        const newAiPlanDates = new Set<string>();
        const newCountMap: Record<string, number> = {};
        days.forEach((d) => {
          if (d.hasSchedule) newScheduleDates.add(d.date);
          if (d.hasAiPlan) newAiPlanDates.add(d.date);
          newCountMap[d.date] = d.scheduleCount;
        });
        setScheduleDates(newScheduleDates);
        setAiPlanDates(newAiPlanDates);
        setScheduleCountMap(newCountMap);
      })
      .catch(() => {});
  }, [weekStart]);

  const weeklyDays = useMemo(
    () => buildWeeklyDays(weekStart, selectedDate, scheduleDates, aiPlanDates, scheduleCountMap),
    [weekStart, selectedDate, scheduleDates, aiPlanDates, scheduleCountMap],
  );

  const weekLabel = useMemo(() => {
    const start = dayjs(weekStart);
    const end = start.add(6, 'day');
    if (start.month() === end.month()) {
      return `${start.format('YYYY.MM.DD')} ~ ${end.format('DD')}`;
    }
    return `${start.format('YYYY.MM.DD')} ~ ${end.format('MM.DD')}`;
  }, [weekStart]);

  // 선택 날짜 일정
  const [selectedDateSchedules, setSelectedDateSchedules] = useState(
    mockSchedulesByDate[dayjs().format('YYYY-MM-DD')] ?? [],
  );
  const [selectedDateAiPlans, setSelectedDateAiPlans] = useState(
    mockAiPlansByDate[dayjs().format('YYYY-MM-DD')] ?? [],
  );

  useEffect(() => {
    apiClient
      .get<{
        data: {
          schedules: Array<{ id: number; title: string; startTime: string; endTime: string; category: string; memo?: string }>;
          aiPlans: Array<{ id: number; title: string; startTime: string; endTime: string; status: 'RECOMMENDED' | 'APPLIED' | 'COMPLETED' | 'MISSED' }>;
        };
      }>(`/api/calendar/daily-detail?date=${selectedDate}`)
      .then((res) => {
        setSelectedDateSchedules(res.data.data.schedules);
        setSelectedDateAiPlans(res.data.data.aiPlans);
      })
      .catch(() => {
        setSelectedDateSchedules(mockSchedulesByDate[selectedDate] ?? []);
        setSelectedDateAiPlans(mockAiPlansByDate[selectedDate] ?? []);
      });
  }, [selectedDate]);

  // 강의 추천 API 호출
  const fetchCourseRecommendations = useCallback(async () => {
    setCourseLoading(true);
    try {
      // 1차: AI 추천 (목표 기반)
      const res = await apiClient.get<{
        data: { recommendations: CourseRecommendationModel[] };
      }>('/api/courses/recommend');
      const recs = res.data.data.recommendations;

      if (recs.length > 0) {
        setCourseRecommendations(recs);
      } else {
        // 목표 없는 경우: 전체 강의를 추천 형식으로 변환
        await fetchAllCoursesAsFallback();
      }
    } catch {
      await fetchAllCoursesAsFallback();
    } finally {
      setCourseLoading(false);
    }
  }, []);

  async function fetchAllCoursesAsFallback() {
    try {
      const res = await apiClient.get<{
        data: { courses: CourseRecommendationModel['course'][] };
      }>('/api/courses');
      const courses = res.data.data.courses;
      const asFallback: CourseRecommendationModel[] = courses.map((c, i) => ({
        id: c.id,
        course: c,
        reason: c.description,
        priority: i + 1,
        goalTitle: null,
      }));
      setCourseRecommendations(asFallback);
    } catch {
      setCourseRecommendations([]);
    }
  }

  useEffect(() => {
    fetchCourseRecommendations();
  }, [fetchCourseRecommendations]);

  function onPrevWeek() {
    setWeekStart((prev) => dayjs(prev).subtract(7, 'day').format('YYYY-MM-DD'));
  }
  function onNextWeek() {
    setWeekStart((prev) => dayjs(prev).add(7, 'day').format('YYYY-MM-DD'));
  }
  function onSelectDate(date: string) {
    setSelectedDate(date);
    setWeekStart(getSundayOfWeek(date));
  }

  return {
    user,
    chips: mockChips,
    weeklyDays,
    weekLabel,
    selectedDate,
    selectedDateSchedules,
    selectedDateAiPlans,
    courseRecommendations,
    courseLoading,
    onPrevWeek,
    onNextWeek,
    onSelectDate,
    onRefreshCourses: fetchCourseRecommendations,
  };
}
