import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../shared/lib/apiClient';
import BottomNavBar from '../../shared/ui/BottomNavBar';
import EmptyState from '../../shared/ui/EmptyState';

type Goal = {
  id: number;
  title: string;
  type: string;
  targetDescription?: string;
  preferredMinutesPerSession: number;
  preferredSessionsPerWeek: number;
  isActive: boolean;
};

const GOAL_TYPE_LABELS: Record<string, string> = {
  STUDY: '공부',
  CERTIFICATE: '자격증',
  EXERCISE: '운동',
  READING: '독서',
  CODING: '코딩',
  OTHER: '기타',
};

const GOAL_TYPE_COLORS: Record<string, string> = {
  STUDY: 'bg-[#DCE8F8] text-[#4A7BAF]',
  CERTIFICATE: 'bg-[#FDE8F0] text-[#C05080]',
  EXERCISE: 'bg-[#E8F4E8] text-[#3A7D44]',
  READING: 'bg-[#FFF3DC] text-[#B07830]',
  CODING: 'bg-[#EDE8F8] text-[#6040A0]',
  OTHER: 'bg-[#EFEFEF] text-[#8E8E93]',
};

export default function GoalsPage() {
  const navigate = useNavigate();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [togglingId, setTogglingId] = useState<number | null>(null);

  const fetchGoals = useCallback(() => {
    setLoading(true);
    apiClient
      .get<{ data: Goal[] }>('/api/goals')
      .then((res) => setGoals(res.data.data))
      .catch(() => setGoals([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  async function handleToggleActive(goal: Goal) {
    setTogglingId(goal.id);
    try {
      await apiClient.patch(`/api/goals/${goal.id}`, { isActive: !goal.isActive });
      setGoals((prev) =>
        prev.map((g) => (g.id === goal.id ? { ...g, isActive: !g.isActive } : g)),
      );
    } catch {
      // ignore
    } finally {
      setTogglingId(null);
    }
  }

  async function handleDelete(goalId: number) {
    if (!confirm('이 목표를 삭제하시겠어요?')) return;
    try {
      await apiClient.delete(`/api/goals/${goalId}`);
      setGoals((prev) => prev.filter((g) => g.id !== goalId));
    } catch {
      // ignore
    }
  }

  const activeGoals = goals.filter((g) => g.isActive);
  const inactiveGoals = goals.filter((g) => !g.isActive);

  return (
    <div className="min-h-screen bg-[#F8F8F6] flex flex-col">
      {/* 헤더 */}
      <div className="px-5 pt-12 pb-4 bg-[#F8F8F6]">
        <h1 className="text-[20px] font-bold text-[#111111]">목표 관리</h1>
        <p className="text-[13px] text-[#8E8E93] mt-0.5">자기개발 목표를 설정하고 관리하세요</p>
      </div>

      {/* 스크롤 영역 */}
      <div className="flex-1 overflow-y-auto pb-24 px-5">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-6 h-6 border-2 border-[#111111] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : goals.length === 0 ? (
          <div className="pt-8">
            <EmptyState
              message="아직 목표가 없어요."
              subMessage="+ 버튼으로 첫 번째 목표를 추가해보세요."
            />
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {/* 활성 목표 */}
            {activeGoals.length > 0 && (
              <div>
                <p className="text-[12px] font-semibold text-[#8E8E93] mb-2 pl-1">
                  진행 중 ({activeGoals.length})
                </p>
                <div className="flex flex-col gap-2">
                  {activeGoals.map((goal) => (
                    <GoalCard
                      key={goal.id}
                      goal={goal}
                      isToggling={togglingId === goal.id}
                      onToggle={() => handleToggleActive(goal)}
                      onDelete={() => handleDelete(goal.id)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* 비활성 목표 */}
            {inactiveGoals.length > 0 && (
              <div>
                <p className="text-[12px] font-semibold text-[#8E8E93] mb-2 pl-1">
                  일시 중지 ({inactiveGoals.length})
                </p>
                <div className="flex flex-col gap-2 opacity-60">
                  {inactiveGoals.map((goal) => (
                    <GoalCard
                      key={goal.id}
                      goal={goal}
                      isToggling={togglingId === goal.id}
                      onToggle={() => handleToggleActive(goal)}
                      onDelete={() => handleDelete(goal.id)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 목표 추가 FAB */}
      <button
        onClick={() => navigate('/goals/new')}
        className="fixed bottom-[72px] right-5 w-12 h-12 bg-[#111111] rounded-full flex items-center justify-center shadow-lg z-40"
        aria-label="목표 추가"
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

type GoalCardProps = {
  goal: Goal;
  isToggling: boolean;
  onToggle: () => void;
  onDelete: () => void;
};

function GoalCard({ goal, isToggling, onToggle, onDelete }: GoalCardProps) {
  const navigate = useNavigate();
  const typeColor = GOAL_TYPE_COLORS[goal.type] ?? GOAL_TYPE_COLORS.OTHER;
  const typeLabel = GOAL_TYPE_LABELS[goal.type] ?? goal.type;

  return (
    <div
      className="bg-white rounded-[16px] px-4 py-4 cursor-pointer active:scale-[0.99] transition-transform"
      onClick={() => navigate(`/goals/${goal.id}`)}
    >
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${typeColor}`}>
              {typeLabel}
            </span>
            {!goal.isActive && (
              <span className="text-[11px] font-medium text-[#C7C7CC]">일시 중지</span>
            )}
          </div>
          <p className="text-[15px] font-semibold text-[#111111] truncate">{goal.title}</p>
          {goal.targetDescription && (
            <p className="text-[12px] text-[#8E8E93] mt-0.5 line-clamp-2">{goal.targetDescription}</p>
          )}
          <p className="text-[12px] text-[#8E8E93] mt-1.5">
            회당 {goal.preferredMinutesPerSession}분 · 주 {goal.preferredSessionsPerWeek}회
          </p>
        </div>

        {/* 더보기 메뉴 */}
        <div className="flex flex-col items-end gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={onToggle}
            disabled={isToggling}
            className={`text-[11px] font-medium px-3 py-1 rounded-full transition-colors disabled:opacity-50 ${
              goal.isActive
                ? 'bg-[#EFEFEF] text-[#8E8E93]'
                : 'bg-[#111111] text-white'
            }`}
          >
            {goal.isActive ? '중지' : '재개'}
          </button>
          <button
            onClick={onDelete}
            className="text-[11px] font-medium text-[#E05C5C] px-3 py-1"
          >
            삭제
          </button>
        </div>
      </div>
    </div>
  );
}
