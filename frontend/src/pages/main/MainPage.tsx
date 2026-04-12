import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import apiClient from '../../shared/lib/apiClient';
import { getNickname } from '../../shared/lib/auth';
import BottomNavBar from '../../shared/ui/BottomNavBar';
import Avatar from '../../shared/ui/Avatar';

// ─── 타입 ─────────────────────────────────────────────────────────────────────

type AvailableTime = {
  baseAvailableH: number;
  fatigueReductionH: number;
  finalAvailableH: number;
};

type ScheduleItem = {
  id: number;
  title: string;
  startTime: string;
  endTime: string;
  category: string;
  isMilitary: boolean;
};

type ActiveGoal = {
  id: number;
  title: string;
  type: string;
  progressPercent: number;
};

type RoadmapSummary = {
  id: number;
  title: string;
  progressPercent: number;
  nextUpdateDate: string | null;
  updateCount: number;
};

type DashboardData = {
  nickname: string;
  today: string;
  availableTime: AvailableTime;
  scheduleTimeline: ScheduleItem[];
  activeGoals: ActiveGoal[];
  roadmapSummary: RoadmapSummary | null;
};

// ─── 상수 ─────────────────────────────────────────────────────────────────────

const CATEGORY_LABEL: Record<string, string> = {
  MILITARY: '근무',
  SELF_DEV: '자기개발',
  PERSONAL: '개인',
  REST: '휴식',
  OTHER: '기타',
};

const CATEGORY_COLOR: Record<string, string> = {
  MILITARY: 'bg-[#DCE8F8] text-[#4A7BAF]',
  SELF_DEV: 'bg-[#E8F4E8] text-[#3A7D44]',
  PERSONAL: 'bg-[#EDE8F8] text-[#6040A0]',
  REST: 'bg-[#F8F8F6] text-[#8E8E93]',
  OTHER: 'bg-[#FFF3DC] text-[#B07830]',
};

const GOAL_TYPE_LABEL: Record<string, string> = {
  CERTIFICATE: '자격증',
  STUDY: '학습',
  CODING: '코딩',
  LANGUAGE: '어학',
  FITNESS: '체력',
  OTHER: '기타',
};

// ─── 가용시간 게이지 ──────────────────────────────────────────────────────────

function AvailableTimeGauge({ available }: { available: AvailableTime }) {
  const maxH = 16; // 기준 최대 시간
  const pct = Math.min(100, (available.finalAvailableH / maxH) * 100);
  const circumference = 2 * Math.PI * 38;
  const strokeDash = (pct / 100) * circumference;

  const fatigueLevel =
    available.fatigueReductionH >= 1.5
      ? { label: '높음', color: 'text-[#E05C5C]' }
      : available.fatigueReductionH >= 0.5
      ? { label: '보통', color: 'text-[#B07830]' }
      : { label: '낮음', color: 'text-[#3A7D44]' };

  return (
    <div className="bg-white rounded-[20px] px-5 py-5">
      <p className="text-[13px] font-semibold text-[#8E8E93] mb-4">오늘의 가용 시간</p>

      <div className="flex items-center gap-5">
        {/* 원형 게이지 */}
        <div className="relative w-24 h-24 shrink-0">
          <svg width="96" height="96" viewBox="0 0 96 96" className="-rotate-90">
            <circle cx="48" cy="48" r="38" fill="none" stroke="#F0F0F0" strokeWidth="8" />
            <circle
              cx="48" cy="48" r="38"
              fill="none"
              stroke="#4A7BAF"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${strokeDash} ${circumference}`}
              className="transition-all duration-700"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[22px] font-bold text-[#111111] leading-none">
              {available.finalAvailableH.toFixed(1)}
            </span>
            <span className="text-[11px] text-[#8E8E93]">시간</span>
          </div>
        </div>

        {/* 세부 정보 */}
        <div className="flex flex-col gap-2.5 flex-1">
          <div className="flex items-center justify-between">
            <span className="text-[12px] text-[#8E8E93]">기본 가용시간</span>
            <span className="text-[13px] font-semibold text-[#111111]">
              {available.baseAvailableH.toFixed(1)}h
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[12px] text-[#8E8E93]">피로도 감소</span>
            <span className="text-[13px] font-semibold text-[#E05C5C]">
              -{available.fatigueReductionH.toFixed(1)}h
            </span>
          </div>
          <div className="h-px bg-[#F0F0F0]" />
          <div className="flex items-center justify-between">
            <span className="text-[12px] text-[#8E8E93]">피로도 수준</span>
            <span className={`text-[13px] font-semibold ${fatigueLevel.color}`}>
              {fatigueLevel.label}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── 일과 시간표 ──────────────────────────────────────────────────────────────

function ScheduleTimeline({
  schedules,
  onAdd,
}: {
  schedules: ScheduleItem[];
  onAdd: () => void;
}) {
  return (
    <div className="bg-white rounded-[20px] px-5 py-5">
      <div className="flex items-center justify-between mb-4">
        <p className="text-[13px] font-semibold text-[#111111]">오늘 일과</p>
        <button
          onClick={onAdd}
          className="w-7 h-7 rounded-full bg-[#F8F8F6] flex items-center justify-center"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8E8E93" strokeWidth="2.2">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
      </div>

      {schedules.length === 0 ? (
        <div className="flex flex-col items-center py-6 gap-1">
          <p className="text-[14px] font-medium text-[#8E8E93]">오늘 등록된 일과가 없어요</p>
          <button
            onClick={onAdd}
            className="text-[13px] font-semibold text-[#4A7BAF] mt-1"
          >
            + 일과 추가하기
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {schedules.map((s) => {
            const catColor = CATEGORY_COLOR[s.category] ?? CATEGORY_COLOR.OTHER;
            const catLabel = CATEGORY_LABEL[s.category] ?? s.category;
            return (
              <div key={s.id} className="flex items-center gap-3">
                <div className="flex flex-col items-center shrink-0 w-12">
                  <span className="text-[11px] font-medium text-[#8E8E93]">{s.startTime}</span>
                  <span className="text-[11px] text-[#C7C7CC]">{s.endTime}</span>
                </div>
                <div className="flex-1 bg-[#F8F8F6] rounded-[12px] px-3 py-2.5 flex items-center justify-between gap-2">
                  <span className="text-[14px] font-medium text-[#111111] truncate">{s.title}</span>
                  <span className={`shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full ${catColor}`}>
                    {catLabel}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── 활성 목표 카드 ───────────────────────────────────────────────────────────

function ActiveGoalsSection({
  goals,
  onGoTo,
}: {
  goals: ActiveGoal[];
  onGoTo: () => void;
}) {
  if (goals.length === 0) return null;

  return (
    <div className="bg-white rounded-[20px] px-5 py-5">
      <div className="flex items-center justify-between mb-3">
        <p className="text-[13px] font-semibold text-[#111111]">진행 중인 목표</p>
        <button onClick={onGoTo} className="text-[12px] font-medium text-[#4A7BAF]">
          전체 보기
        </button>
      </div>
      <div className="flex flex-col gap-3">
        {goals.map((goal) => (
          <div key={goal.id}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[14px] font-medium text-[#111111] truncate flex-1 mr-2">
                {goal.title}
              </span>
              <span className="text-[12px] font-semibold text-[#4A7BAF] shrink-0">
                {goal.progressPercent}%
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1.5 bg-[#F0F0F0] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#4A7BAF] rounded-full"
                  style={{ width: `${goal.progressPercent}%` }}
                />
              </div>
              <span className="text-[11px] text-[#8E8E93] shrink-0">
                {GOAL_TYPE_LABEL[goal.type] ?? goal.type}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── 로드맵 요약 카드 ─────────────────────────────────────────────────────────

function RoadmapSummaryCard({
  roadmap,
  onGoTo,
}: {
  roadmap: RoadmapSummary;
  onGoTo: () => void;
}) {
  return (
    <button
      onClick={onGoTo}
      className="w-full bg-white rounded-[20px] px-5 py-4 flex items-center gap-4 text-left"
    >
      <div className="w-10 h-10 rounded-full bg-[#DCE8F8] flex items-center justify-center shrink-0">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4A7BAF" strokeWidth="2">
          <path d="M3 3h7v7H3z" />
          <path d="M14 3h7v7h-7z" />
          <path d="M3 14h7v7H3z" />
          <circle cx="17.5" cy="17.5" r="3.5" />
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-semibold text-[#111111] truncate">{roadmap.title}</p>
        <div className="flex items-center gap-2 mt-1">
          <div className="flex-1 h-1 bg-[#F0F0F0] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#4A7BAF] rounded-full"
              style={{ width: `${roadmap.progressPercent}%` }}
            />
          </div>
          <span className="text-[11px] text-[#8E8E93] shrink-0">{roadmap.progressPercent}%</span>
        </div>
      </div>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C7C7CC" strokeWidth="2">
        <polyline points="9 18 15 12 9 6" />
      </svg>
    </button>
  );
}

// ─── 메인 페이지 ──────────────────────────────────────────────────────────────

export default function MainPage() {
  const navigate = useNavigate();
  const nickname = getNickname();
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  const today = dayjs().format('YYYY년 MM월 DD일');
  const dayOfWeek = ['일', '월', '화', '수', '목', '금', '토'][dayjs().day()];

  useEffect(() => {
    apiClient
      .get<{ data: DashboardData }>('/api/dashboard/home')
      .then((res) => setDashboard(res.data.data))
      .catch(() => setDashboard(null))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#F8F8F6] flex flex-col">
      {/* 상단 헤더 */}
      <div className="bg-[#F8F8F6] pt-10 px-5">
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-[8px] bg-[#111111] flex items-center justify-center">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7l10 5 10-5-10-5z" fill="white" />
                <path d="M2 17l10 5 10-5" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M2 12l10 5 10-5" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </div>
            <span className="text-[17px] font-bold text-[#111111]">Millog</span>
          </div>
          <button onClick={() => navigate('/profile')} className="rounded-full overflow-hidden">
            <Avatar size={34} alt={nickname} />
          </button>
        </div>

        {/* 인사말 */}
        <div className="pb-4">
          <p className="text-[13px] text-[#8E8E93]">
            {today} ({dayOfWeek})
          </p>
          <h2 className="text-[20px] font-bold text-[#111111] mt-0.5">
            안녕하세요, {dashboard?.nickname ?? nickname}님
          </h2>
        </div>
      </div>

      {/* 스크롤 영역 */}
      <div className="flex-1 overflow-y-auto pb-24 px-5 flex flex-col gap-3">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-6 h-6 border-2 border-[#111111] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* 가용시간 게이지 */}
            <AvailableTimeGauge
              available={
                dashboard?.availableTime ?? {
                  baseAvailableH: 0,
                  fatigueReductionH: 0,
                  finalAvailableH: 0,
                }
              }
            />

            {/* 일과 시간표 */}
            <ScheduleTimeline
              schedules={dashboard?.scheduleTimeline ?? []}
              onAdd={() => navigate('/schedules/new')}
            />

            {/* 로드맵 요약 */}
            {dashboard?.roadmapSummary && (
              <div className="flex flex-col gap-1">
                <p className="text-[12px] font-semibold text-[#8E8E93] px-1">학습 로드맵</p>
                <RoadmapSummaryCard
                  roadmap={dashboard.roadmapSummary}
                  onGoTo={() => navigate('/roadmap')}
                />
              </div>
            )}

            {/* 활성 목표 */}
            {dashboard && dashboard.activeGoals.length > 0 && (
              <ActiveGoalsSection
                goals={dashboard.activeGoals}
                onGoTo={() => navigate('/goals')}
              />
            )}

            {/* 빠른 링크 */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => navigate('/schedules/new')}
                className="bg-white rounded-[16px] px-4 py-4 flex flex-col gap-2 text-left"
              >
                <div className="w-9 h-9 rounded-full bg-[#DCE8F8] flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4A7BAF" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                </div>
                <p className="text-[13px] font-semibold text-[#111111]">일과 추가</p>
              </button>
              <button
                onClick={() => navigate('/recommend')}
                className="bg-white rounded-[16px] px-4 py-4 flex flex-col gap-2 text-left"
              >
                <div className="w-9 h-9 rounded-full bg-[#E8F4E8] flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3A7D44" strokeWidth="2">
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                    <line x1="12" y1="17" x2="12.01" y2="17" strokeWidth="3" strokeLinecap="round" />
                    <circle cx="12" cy="12" r="10" />
                  </svg>
                </div>
                <p className="text-[13px] font-semibold text-[#111111]">강의 추천</p>
              </button>
            </div>
          </>
        )}
      </div>

      <BottomNavBar />
    </div>
  );
}
