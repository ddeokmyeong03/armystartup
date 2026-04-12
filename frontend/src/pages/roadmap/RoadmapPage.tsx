import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../shared/lib/apiClient';
import BottomNavBar from '../../shared/ui/BottomNavBar';

// ─── 타입 ─────────────────────────────────────────────────────────────────────

type RoadmapStage = {
  week: string;
  title: string;
  status: 'completed' | 'in_progress' | 'pending';
  items: string[];
};

type Goal = {
  id: number;
  title: string;
  type: string;
  progressPercent: number;
};

type Roadmap = {
  id: number;
  goalId: number;
  title: string;
  totalWeeks: number;
  stages: RoadmapStage[];
  progressPercent: number;
  updateCount: number;
  nextUpdateDate: string | null;
  goal?: { title: string; type: string; progressPercent: number };
};

// ─── 상수 ─────────────────────────────────────────────────────────────────────

const GOAL_TYPE_LABEL: Record<string, string> = {
  CERTIFICATE: '자격증',
  STUDY: '학습',
  CODING: '코딩',
  LANGUAGE: '어학',
  FITNESS: '체력',
  OTHER: '기타',
};

const STATUS_CONFIG = {
  completed: { label: '완료', color: 'bg-[#E8F4E8] text-[#3A7D44]', dot: 'bg-[#3A7D44]' },
  in_progress: { label: '진행 중', color: 'bg-[#DCE8F8] text-[#4A7BAF]', dot: 'bg-[#4A7BAF]' },
  pending: { label: '예정', color: 'bg-[#F8F8F6] text-[#8E8E93]', dot: 'bg-[#C7C7CC]' },
};

// ─── 서브컴포넌트 ──────────────────────────────────────────────────────────────

function StageCard({ stage, index }: { stage: RoadmapStage; index: number }) {
  const [open, setOpen] = useState(stage.status === 'in_progress');
  const cfg = STATUS_CONFIG[stage.status];

  return (
    <div className="bg-white rounded-[18px] overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-3 px-4 py-4 text-left"
      >
        {/* Step number */}
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-[13px] font-bold ${
            stage.status === 'completed'
              ? 'bg-[#3A7D44] text-white'
              : stage.status === 'in_progress'
              ? 'bg-[#4A7BAF] text-white'
              : 'bg-[#EFEFEF] text-[#8E8E93]'
          }`}
        >
          {stage.status === 'completed' ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          ) : (
            index + 1
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[15px] font-semibold text-[#111111]">{stage.title}</span>
            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${cfg.color}`}>
              {cfg.label}
            </span>
          </div>
          <p className="text-[12px] text-[#8E8E93] mt-0.5">{stage.week}</p>
        </div>

        <svg
          width="16" height="16" viewBox="0 0 24 24" fill="none"
          stroke="#C7C7CC" strokeWidth="2"
          className={`shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div className="px-4 pb-4">
          <div className="h-px bg-[#F0F0F0] mb-3" />
          <div className="flex flex-col gap-2">
            {stage.items.map((item, i) => (
              <div key={i} className="flex items-start gap-2">
                <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${cfg.dot}`} />
                <p className="text-[13px] text-[#333333] leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function RoadmapCard({
  roadmap,
  onGenerate,
  generating,
}: {
  roadmap: Roadmap;
  onGenerate: (goalId: number) => void;
  generating: boolean;
}) {
  const completedCount = roadmap.stages.filter((s) => s.status === 'completed').length;

  return (
    <div className="flex flex-col gap-3">
      {/* 헤더 카드 */}
      <div className="bg-white rounded-[20px] px-5 py-5">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-semibold text-[#8E8E93] mb-1">
              {roadmap.goal ? GOAL_TYPE_LABEL[roadmap.goal.type] ?? roadmap.goal.type : ''}
            </p>
            <h3 className="text-[17px] font-bold text-[#111111] leading-snug">{roadmap.title}</h3>
          </div>
          <button
            onClick={() => onGenerate(roadmap.goalId)}
            disabled={generating}
            className="shrink-0 h-8 px-3 bg-[#111111] text-white rounded-[10px] text-[12px] font-semibold disabled:opacity-50 flex items-center gap-1"
          >
            {generating ? (
              <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="1 4 1 10 7 10" />
                  <path d="M3.51 15a9 9 0 1 0 .49-4.5" />
                </svg>
                업데이트
              </>
            )}
          </button>
        </div>

        {/* 진행률 바 */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-2 bg-[#F0F0F0] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#4A7BAF] rounded-full transition-all"
              style={{ width: `${roadmap.progressPercent}%` }}
            />
          </div>
          <span className="text-[13px] font-semibold text-[#4A7BAF] shrink-0">
            {roadmap.progressPercent}%
          </span>
        </div>

        <div className="flex items-center gap-4 mt-3">
          <span className="text-[12px] text-[#8E8E93]">
            {completedCount}/{roadmap.stages.length} 단계 완료
          </span>
          <span className="text-[12px] text-[#8E8E93]">총 {roadmap.totalWeeks}주</span>
          {roadmap.updateCount > 0 && (
            <span className="text-[12px] text-[#8E8E93]">업데이트 {roadmap.updateCount}회</span>
          )}
        </div>

        {roadmap.nextUpdateDate && (
          <div className="mt-3 flex items-center gap-1.5 bg-[#FFF3DC] rounded-[10px] px-3 py-2">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#B07830" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <p className="text-[12px] text-[#B07830] font-medium">
              다음 업데이트 권장: {roadmap.nextUpdateDate}
            </p>
          </div>
        )}
      </div>

      {/* 단계 목록 */}
      <div className="flex flex-col gap-2">
        {roadmap.stages.map((stage, i) => (
          <StageCard key={i} stage={stage} index={i} />
        ))}
      </div>
    </div>
  );
}

// ─── 메인 페이지 ──────────────────────────────────────────────────────────────

export default function RoadmapPage() {
  const navigate = useNavigate();
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [generatingGoalId, setGeneratingGoalId] = useState<number | null>(null);
  const [selectedRoadmapId, setSelectedRoadmapId] = useState<number | null>(null);

  useEffect(() => {
    Promise.all([
      apiClient.get<{ data: Roadmap[] }>('/api/roadmap'),
      apiClient.get<{ data: Goal[] }>('/api/goals'),
    ])
      .then(([rmRes, goalRes]) => {
        const rm = rmRes.data.data;
        setRoadmaps(rm);
        if (rm.length > 0) setSelectedRoadmapId(rm[0].id);
        setGoals(Array.isArray(goalRes.data.data) ? goalRes.data.data : []);
      })
      .catch(() => {
        setRoadmaps([]);
        setGoals([]);
      })
      .finally(() => setLoading(false));
  }, []);

  async function handleGenerate(goalId: number) {
    setGeneratingGoalId(goalId);
    try {
      const res = await apiClient.post<{ data: Roadmap }>('/api/roadmap/generate', { goalId });
      const updated = res.data.data;
      setRoadmaps((prev) => {
        const existing = prev.find((r) => r.goalId === goalId);
        if (existing) return prev.map((r) => (r.goalId === goalId ? updated : r));
        return [updated, ...prev];
      });
      setSelectedRoadmapId(updated.id);
    } catch {
      //
    } finally {
      setGeneratingGoalId(null);
    }
  }

  const selectedRoadmap = roadmaps.find((r) => r.id === selectedRoadmapId) ?? roadmaps[0];
  const goalsWithoutRoadmap = goals.filter((g) => !roadmaps.some((r) => r.goalId === g.id));

  return (
    <div className="min-h-screen bg-[#F8F8F6] flex flex-col">
      {/* 헤더 */}
      <div className="px-5 pt-12 pb-3 bg-[#F8F8F6]">
        <h1 className="text-[20px] font-bold text-[#111111]">학습 로드맵</h1>
        <p className="text-[13px] text-[#8E8E93] mt-0.5">AI가 목표 기반 학습 경로를 설계해드려요</p>
      </div>

      <div className="flex-1 overflow-y-auto pb-24 px-5">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-6 h-6 border-2 border-[#111111] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : roadmaps.length === 0 ? (
          /* 로드맵 없음 — 빈 상태 */
          <div className="flex flex-col gap-4">
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <div className="w-16 h-16 rounded-full bg-[#DCE8F8] flex items-center justify-center">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#4A7BAF" strokeWidth="1.8">
                  <path d="M3 3h7v7H3z" />
                  <path d="M14 3h7v7h-7z" />
                  <path d="M3 14h7v7H3z" />
                  <circle cx="17.5" cy="17.5" r="3.5" />
                </svg>
              </div>
              <p className="text-[17px] font-bold text-[#111111]">로드맵이 없어요</p>
              <p className="text-[13px] text-[#8E8E93] text-center">
                목표를 등록하고 AI 로드맵을 생성해보세요
              </p>
            </div>

            {goals.length === 0 ? (
              <button
                onClick={() => navigate('/goals/new')}
                className="w-full h-[52px] bg-[#111111] text-white rounded-[16px] text-[15px] font-semibold flex items-center justify-center gap-2"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                목표 등록하기
              </button>
            ) : (
              <div className="flex flex-col gap-2">
                <p className="text-[13px] font-semibold text-[#8E8E93] px-1">목표 선택 후 로드맵 생성</p>
                {goals.map((g) => (
                  <button
                    key={g.id}
                    onClick={() => handleGenerate(g.id)}
                    disabled={generatingGoalId === g.id}
                    className="w-full bg-white rounded-[16px] px-4 py-4 flex items-center gap-3 text-left disabled:opacity-60"
                  >
                    <div className="w-9 h-9 rounded-full bg-[#DCE8F8] flex items-center justify-center shrink-0">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4A7BAF" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <circle cx="12" cy="12" r="6" />
                        <circle cx="12" cy="12" r="2" fill="#4A7BAF" stroke="none" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[15px] font-semibold text-[#111111] truncate">{g.title}</p>
                      <p className="text-[12px] text-[#8E8E93]">
                        {GOAL_TYPE_LABEL[g.type] ?? g.type} · {g.progressPercent}% 진행
                      </p>
                    </div>
                    {generatingGoalId === g.id ? (
                      <div className="w-5 h-5 border-2 border-[#4A7BAF] border-t-transparent rounded-full animate-spin shrink-0" />
                    ) : (
                      <span className="text-[12px] font-semibold text-[#4A7BAF] shrink-0">생성</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {/* 로드맵 탭 선택 (여러 로드맵) */}
            {roadmaps.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                {roadmaps.map((rm) => (
                  <button
                    key={rm.id}
                    onClick={() => setSelectedRoadmapId(rm.id)}
                    className={`shrink-0 h-9 px-4 rounded-full text-[13px] font-semibold transition-colors ${
                      selectedRoadmapId === rm.id
                        ? 'bg-[#111111] text-white'
                        : 'bg-white text-[#8E8E93]'
                    }`}
                  >
                    {rm.goal?.title ?? rm.title}
                  </button>
                ))}
              </div>
            )}

            {/* 선택된 로드맵 */}
            {selectedRoadmap && (
              <RoadmapCard
                roadmap={selectedRoadmap}
                onGenerate={handleGenerate}
                generating={generatingGoalId === selectedRoadmap.goalId}
              />
            )}

            {/* 로드맵 없는 목표 → 생성 버튼 */}
            {goalsWithoutRoadmap.length > 0 && (
              <div className="flex flex-col gap-2 mt-2">
                <p className="text-[13px] font-semibold text-[#8E8E93] px-1">다른 목표 로드맵 생성</p>
                {goalsWithoutRoadmap.map((g) => (
                  <button
                    key={g.id}
                    onClick={() => handleGenerate(g.id)}
                    disabled={generatingGoalId === g.id}
                    className="w-full bg-white rounded-[16px] px-4 py-4 flex items-center gap-3 text-left disabled:opacity-60"
                  >
                    <div className="w-9 h-9 rounded-full bg-[#F8F8F6] flex items-center justify-center shrink-0">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8E8E93" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <circle cx="12" cy="12" r="6" />
                        <circle cx="12" cy="12" r="2" fill="#8E8E93" stroke="none" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[15px] font-semibold text-[#111111] truncate">{g.title}</p>
                      <p className="text-[12px] text-[#8E8E93]">{GOAL_TYPE_LABEL[g.type] ?? g.type}</p>
                    </div>
                    {generatingGoalId === g.id ? (
                      <div className="w-5 h-5 border-2 border-[#4A7BAF] border-t-transparent rounded-full animate-spin shrink-0" />
                    ) : (
                      <span className="text-[12px] font-semibold text-[#4A7BAF] shrink-0">+ 생성</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <BottomNavBar />
    </div>
  );
}
