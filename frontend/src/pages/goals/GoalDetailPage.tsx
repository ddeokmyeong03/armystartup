import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import apiClient from '../../shared/lib/apiClient';

type Goal = {
  id: number;
  title: string;
  type: string;
  targetDescription?: string;
  preferredMinutesPerSession: number;
  preferredSessionsPerWeek: number;
  progressPercent: number;
  isActive: boolean;
  createdAt: string;
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

const GOAL_TYPE_ICONS: Record<string, string> = {
  STUDY: '📖',
  CERTIFICATE: '🏆',
  EXERCISE: '💪',
  READING: '📚',
  CODING: '💻',
  OTHER: '⭐',
};

export default function GoalDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [goal, setGoal] = useState<Goal | null>(null);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [generatingRoadmap, setGeneratingRoadmap] = useState(false);

  useEffect(() => {
    if (!id) return;
    apiClient
      .get<{ data: Goal }>(`/api/goals/${id}`)
      .then((res) => setGoal(res.data.data))
      .catch(() => navigate(-1))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  async function handleToggle() {
    if (!goal) return;
    setToggling(true);
    try {
      await apiClient.patch(`/api/goals/${goal.id}`, { isActive: !goal.isActive });
      setGoal((prev) => prev ? { ...prev, isActive: !prev.isActive } : prev);
    } catch {
      // ignore
    } finally {
      setToggling(false);
    }
  }

  async function handleDelete() {
    if (!goal) return;
    if (!confirm('이 목표를 삭제하시겠어요? 관련 로드맵도 함께 삭제됩니다.')) return;
    setDeleting(true);
    try {
      await apiClient.delete(`/api/goals/${goal.id}`);
      navigate('/goals', { replace: true });
    } catch {
      setDeleting(false);
    }
  }

  async function handleGenerateRoadmap() {
    if (!goal) return;
    setGeneratingRoadmap(true);
    try {
      await apiClient.post('/api/roadmap/generate', { goalId: goal.id });
      navigate('/roadmap');
    } catch {
      setGeneratingRoadmap(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F8F6] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[#111111] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!goal) return null;

  const typeColor = GOAL_TYPE_COLORS[goal.type] ?? GOAL_TYPE_COLORS.OTHER;
  const typeLabel = GOAL_TYPE_LABELS[goal.type] ?? goal.type;
  const typeIcon = GOAL_TYPE_ICONS[goal.type] ?? '⭐';
  const totalMinutesPerWeek = goal.preferredMinutesPerSession * goal.preferredSessionsPerWeek;
  const startDate = new Date(goal.createdAt).toLocaleDateString('ko-KR', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-[#F8F8F6] flex flex-col">
      {/* 헤더 */}
      <div className="flex items-center justify-between px-5 pt-12 pb-4 bg-[#F8F8F6]">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 flex items-center justify-center"
            aria-label="뒤로가기"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#111111" strokeWidth="2">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <h1 className="text-[17px] font-semibold text-[#111111]">목표 상세</h1>
        </div>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="text-[13px] font-medium text-[#E05C5C] disabled:opacity-50"
        >
          삭제
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pb-12 px-5 flex flex-col gap-4">
        {/* 목표 헤더 카드 */}
        <div className="bg-white rounded-[20px] px-5 py-5">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">{typeIcon}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${typeColor}`}>
                  {typeLabel}
                </span>
                {!goal.isActive && (
                  <span className="text-[11px] font-medium text-[#C7C7CC]">일시 중지</span>
                )}
              </div>
              <p className="text-[18px] font-bold text-[#111111]">{goal.title}</p>
            </div>
          </div>

          {goal.targetDescription && (
            <p className="text-[14px] text-[#8E8E93] leading-relaxed">{goal.targetDescription}</p>
          )}
        </div>

        {/* 진행률 */}
        <div className="bg-white rounded-[20px] px-5 py-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[14px] font-semibold text-[#111111]">현재 진행률</p>
            <p className="text-[16px] font-bold text-[#111111]">{goal.progressPercent}%</p>
          </div>
          <div className="h-2.5 bg-[#F0F0EE] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#111111] rounded-full transition-all"
              style={{ width: `${goal.progressPercent}%` }}
            />
          </div>
        </div>

        {/* 학습 계획 */}
        <div className="bg-white rounded-[20px] px-5 py-5">
          <p className="text-[14px] font-semibold text-[#111111] mb-3">학습 계획</p>
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-[13px] text-[#8E8E93]">1회 학습 시간</span>
              <span className="text-[13px] font-semibold text-[#111111]">
                {goal.preferredMinutesPerSession}분
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[13px] text-[#8E8E93]">주간 학습 횟수</span>
              <span className="text-[13px] font-semibold text-[#111111]">
                주 {goal.preferredSessionsPerWeek}회
              </span>
            </div>
            <div className="h-px bg-[#F0F0EE]" />
            <div className="flex items-center justify-between">
              <span className="text-[13px] text-[#8E8E93]">주간 총 학습 시간</span>
              <span className="text-[13px] font-bold text-[#111111]">
                {totalMinutesPerWeek}분 / 주
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[13px] text-[#8E8E93]">시작일</span>
              <span className="text-[13px] font-semibold text-[#111111]">{startDate}</span>
            </div>
          </div>
        </div>

        {/* 액션 버튼 */}
        <div className="flex flex-col gap-3">
          <button
            onClick={handleGenerateRoadmap}
            disabled={generatingRoadmap}
            className="h-[52px] bg-[#111111] text-white rounded-[16px] text-[15px] font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {generatingRoadmap ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>로드맵 생성 중...</span>
              </>
            ) : (
              'AI 로드맵 생성'
            )}
          </button>
          <button
            onClick={handleToggle}
            disabled={toggling}
            className={`h-[52px] rounded-[16px] text-[15px] font-semibold disabled:opacity-50 ${
              goal.isActive
                ? 'bg-white text-[#8E8E93] border border-[#EFEFEF]'
                : 'bg-white text-[#111111] border border-[#111111]'
            }`}
          >
            {toggling ? '처리 중...' : goal.isActive ? '목표 일시 중지' : '목표 재개'}
          </button>
        </div>
      </div>
    </div>
  );
}
