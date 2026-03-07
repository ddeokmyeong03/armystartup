import { useState, useMemo, useCallback, useEffect } from 'react';
import dayjs from 'dayjs';
import { buildWeeklyDays } from '../../shared/lib/calendar';
import { mockChips, mockSchedulesByDate, mockAiPlansByDate } from '../../shared/model/mock';
import type { AiChatMessage, UserModel } from '../../shared/model/types';
import apiClient from '../../shared/lib/apiClient';
import { getNickname } from '../../shared/lib/auth';

function getSundayOfWeek(date: string): string {
  return dayjs(date).startOf('week').format('YYYY-MM-DD');
}

export function useMainPageViewModel() {
  const [selectedDate, setSelectedDate] = useState(() => dayjs().format('YYYY-MM-DD'));
  const [weekStart, setWeekStart] = useState(() => getSundayOfWeek(dayjs().format('YYYY-MM-DD')));

  // 실제 사용자 닉네임 (로그인 시 저장된 값)
  const user: UserModel = {
    id: 0,
    nickname: getNickname(),
    email: '',
    message: '오늘 하루도 파이팅!',
  };

  // AI 채팅 상태
  const [aiMessages, setAiMessages] = useState<AiChatMessage[]>([]);
  const [aiLoading, setAiLoading] = useState(false);

  // 실제 일정 데이터 상태 (API 연동 준비)
  const [scheduleDates, setScheduleDates] = useState<Set<string>>(() => new Set(Object.keys(mockSchedulesByDate)));
  const [aiPlanDates, setAiPlanDates] = useState<Set<string>>(() => new Set(Object.keys(mockAiPlansByDate)));
  const [scheduleCountMap, setScheduleCountMap] = useState<Record<string, number>>(() => {
    const map: Record<string, number> = {};
    for (const [date, list] of Object.entries(mockSchedulesByDate)) map[date] = list.length;
    return map;
  });

  // 주간 캘린더 API에서 마커 데이터 갱신
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
      .catch(() => {
        // API 실패 시 mock 유지
      });
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

  // 선택된 날짜의 일정 (API 연동 준비 - 현재 mock)
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

  const onSendAiMessage = useCallback(async (message: string) => {
    const userMsg: AiChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: message,
      timestamp: dayjs().toISOString(),
    };
    setAiMessages((prev) => [...prev, userMsg]);
    setAiLoading(true);

    try {
      const res = await apiClient.post<{ data: { reply: string; timestamp: string } }>(
        '/api/ai/chat',
        { message },
      );
      const aiMsg: AiChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'ai',
        content: res.data.data.reply,
        timestamp: res.data.data.timestamp,
      };
      setAiMessages((prev) => [...prev, aiMsg]);
    } catch {
      const errMsg: AiChatMessage = {
        id: `ai-err-${Date.now()}`,
        role: 'ai',
        content: '답변을 불러오지 못했어요. 잠시 후 다시 시도해주세요.',
        timestamp: dayjs().toISOString(),
      };
      setAiMessages((prev) => [...prev, errMsg]);
    } finally {
      setAiLoading(false);
    }
  }, []);

  return {
    user,
    chips: mockChips,
    weeklyDays,
    weekLabel,
    selectedDate,
    selectedDateSchedules,
    selectedDateAiPlans,
    aiMessages,
    aiLoading,
    onPrevWeek,
    onNextWeek,
    onSelectDate,
    onSendAiMessage,
  };
}
