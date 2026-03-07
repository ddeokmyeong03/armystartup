import { useState, useEffect, useCallback } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../shared/lib/apiClient';
import BottomNavBar from '../../shared/ui/BottomNavBar';
import Tag from '../../shared/ui/Tag';
import EmptyState from '../../shared/ui/EmptyState';

dayjs.locale('ko');

type Schedule = {
  id: number;
  title: string;
  startTime: string;
  endTime: string;
  category: string;
};

type AiPlan = {
  id: number;
  title: string;
  startTime: string;
  endTime: string;
  status: 'RECOMMENDED' | 'APPLIED' | 'COMPLETED' | 'MISSED';
};

const CATEGORY_LABELS: Record<string, string> = {
  DUTY: '근무',
  TRAINING: '훈련',
  ROLL_CALL: '점호',
  MEDICAL: '의무',
  PERSONAL: '개인',
  OTHER: '기타',
};

const STATUS_CONFIG = {
  RECOMMENDED: { label: 'AI 추천', bg: 'bg-[#DCE8F8]', text: 'text-[#4A7BAF]' },
  APPLIED: { label: '적용됨', bg: 'bg-[#E8F4E8]', text: 'text-[#3A7D44]' },
  COMPLETED: { label: '완료', bg: 'bg-[#EFEFEF]', text: 'text-[#8E8E93]' },
  MISSED: { label: '미완료', bg: 'bg-[#FDE8E8]', text: 'text-[#E05C5C]' },
};

export default function TodayPage() {
  const navigate = useNavigate();
  const today = dayjs().format('YYYY-MM-DD');
  const dateLabel = dayjs().format('M월 D일 dddd');

  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [aiPlans, setAiPlans] = useState<AiPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [actioningId, setActioningId] = useState<number | null>(null);

  const fetchToday = useCallback(() => {
    setLoading(true);
    apiClient
      .get<{ data: { schedules: Schedule[]; aiPlans: AiPlan[] } }>(
        `/api/calendar/daily-detail?date=${today}`,
      )
      .then((res) => {
        setSchedules(res.data.data.schedules);
        setAiPlans(res.data.data.aiPlans);
      })
      .catch(() => {
        setSchedules([]);
        setAiPlans([]);
      })
      .finally(() => setLoading(false));
  }, [today]);

  useEffect(() => {
    fetchToday();
  }, [fetchToday]);

  async function handleComplete(planId: number) {
    setActioningId(planId);
    try {
      await apiClient.patch(`/api/ai-plans/${planId}/complete`);
      setAiPlans((prev) =>
        prev.map((p) => (p.id === planId ? { ...p, status: 'COMPLETED' } : p)),
      );
    } catch {
      // ignore
    } finally {
      setActioningId(null);
    }
  }

  async function handleMiss(planId: number) {
    setActioningId(planId);
    try {
      await apiClient.patch(`/api/ai-plans/${planId}/miss`);
      setAiPlans((prev) =>
        prev.map((p) => (p.id === planId ? { ...p, status: 'MISSED' } : p)),
      );
    } catch {
      // ignore
    } finally {
      setActioningId(null);
    }
  }

  const hasContent = schedules.length > 0 || aiPlans.length > 0;
  const completedCount = aiPlans.filter((p) => p.status === 'COMPLETED').length;
  const totalAiPlans = aiPlans.length;

  return (
    <div className="min-h-screen bg-[#F8F8F6] flex flex-col">
      {/* 헤더 */}
      <div className="px-5 pt-12 pb-4 bg-[#F8F8F6]">
        <h1 className="text-[20px] font-bold text-[#111111]">오늘의 계획</h1>
        <p className="text-[13px] text-[#8E8E93] mt-0.5">{dateLabel}</p>
      </div>

      {/* 진행률 카드 */}
      {totalAiPlans > 0 && (
        <div className="mx-5 mb-4 bg-white rounded-[20px] px-5 py-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[13px] font-semibold text-[#111111]">자기개발 달성률</p>
            <p className="text-[13px] font-bold text-[#4A7BAF]">
              {completedCount}/{totalAiPlans}
            </p>
          </div>
          <div className="h-2 bg-[#EFEFEF] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#4A7BAF] rounded-full transition-all duration-500"
              style={{ width: `${totalAiPlans > 0 ? (completedCount / totalAiPlans) * 100 : 0}%` }}
            />
          </div>
        </div>
      )}

      {/* 스크롤 영역 */}
      <div className="flex-1 overflow-y-auto pb-24 px-5">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-6 h-6 border-2 border-[#111111] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : !hasContent ? (
          <EmptyState
            message="오늘 등록된 일정이 없어요."
            subMessage="일정을 추가하거나 AI 계획을 추천받아보세요."
          />
        ) : (
          <div className="flex flex-col gap-4">
            {/* 일반 일정 */}
            {schedules.length > 0 && (
              <div>
                <p className="text-[12px] font-semibold text-[#8E8E93] mb-2 pl-1">일정</p>
                <div className="flex flex-col gap-2">
                  {schedules.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => navigate(`/schedules/${s.id}`)}
                      className="flex items-center gap-3 bg-white rounded-[14px] px-4 py-3 text-left w-full"
                    >
                      <div className="w-1 h-8 bg-[#C7C7CC] rounded-full shrink-0" />
                      <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                        <p className="text-[14px] font-medium text-[#111111] truncate">{s.title}</p>
                        <p className="text-[12px] text-[#8E8E93]">{s.startTime} – {s.endTime}</p>
                      </div>
                      <Tag label={CATEGORY_LABELS[s.category] ?? s.category} />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* AI 계획 */}
            {aiPlans.length > 0 && (
              <div>
                <p className="text-[12px] font-semibold text-[#8E8E93] mb-2 pl-1">AI 자기개발 계획</p>
                <div className="flex flex-col gap-2">
                  {aiPlans.map((p) => {
                    const cfg = STATUS_CONFIG[p.status];
                    const isDone = p.status === 'COMPLETED' || p.status === 'MISSED';
                    return (
                      <div
                        key={p.id}
                        className={`rounded-[14px] px-4 py-3 ${cfg.bg}`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-1 h-8 rounded-full shrink-0 ${p.status === 'COMPLETED' ? 'bg-[#3A7D44]' : p.status === 'MISSED' ? 'bg-[#E05C5C]' : 'bg-[#4A7BAF]'}`} />
                          <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                            <p className={`text-[14px] font-medium truncate ${isDone ? 'text-[#8E8E93]' : 'text-[#111111]'} ${p.status === 'COMPLETED' ? 'line-through' : ''}`}>
                              {p.title}
                            </p>
                            <p className={`text-[12px] ${cfg.text}`}>{p.startTime} – {p.endTime}</p>
                          </div>
                          <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full bg-white/60 ${cfg.text}`}>
                            {cfg.label}
                          </span>
                        </div>

                        {/* 완료/미완료 버튼 */}
                        {!isDone && (
                          <div className="flex gap-2 mt-3 pl-4">
                            <button
                              onClick={() => handleComplete(p.id)}
                              disabled={actioningId === p.id}
                              className="flex-1 h-8 bg-[#111111] text-white rounded-[10px] text-[12px] font-semibold disabled:opacity-50"
                            >
                              완료
                            </button>
                            <button
                              onClick={() => handleMiss(p.id)}
                              disabled={actioningId === p.id}
                              className="flex-1 h-8 bg-white/70 text-[#E05C5C] rounded-[10px] text-[12px] font-semibold disabled:opacity-50"
                            >
                              미완료
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 일정 추가 FAB */}
      <button
        onClick={() => navigate('/schedules/new')}
        className="fixed bottom-[72px] right-5 w-12 h-12 bg-[#111111] rounded-full flex items-center justify-center shadow-lg z-40"
        aria-label="일정 추가"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </button>

      <BottomNavBar />
    </div>
  );
}
