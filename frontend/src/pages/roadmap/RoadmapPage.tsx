import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import TabBar from '../../shared/components/TabBar';
import PageHeader from '../../shared/components/PageHeader';
import { Icon } from '../../shared/components/Icon';
import {
  apiGetRoadmaps, apiGenerateRoadmap, apiGetGoals,
  apiAiChat, apiCheckRoadmapItem, apiUpdateRoadmapItem,
} from '../../shared/api/index';
import type { RoadmapItem, RoadmapStage } from '../../shared/api/index';

export default function RoadmapPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<'roadmap' | 'ai'>('roadmap');

  return (
    <div className="page page-enter">
      <div className="page-gradient"/>
      <div style={{ height: 8 }}/>
      <PageHeader title="자기개발 로드맵" subtitle="AI가 매주 업데이트해요"/>
      <div style={{ padding: '0 20px 12px', position: 'relative', zIndex: 1 }}>
        <div className="segmented">
          <button className={tab === 'roadmap' ? 'active' : ''} onClick={() => setTab('roadmap')}>로드맵</button>
          <button className={tab === 'ai' ? 'active' : ''} onClick={() => setTab('ai')}>AI 코치</button>
        </div>
      </div>
      {tab === 'roadmap' ? <RoadmapView navigate={navigate}/> : <AIChatView/>}
      <TabBar/>
    </div>
  );
}

// ─── 진행률 계산 (항목 기반) ──────────────────────────────────────────────────
function calcLocalProgress(stages: RoadmapStage[]): number {
  const total = stages.reduce((s, st) => s + st.items.length, 0);
  if (total === 0) return 0;
  const checked = stages.reduce((s, st) => s + (st.checkedItems?.length ?? 0), 0);
  return Math.round((checked / total) * 100);
}

// ─── 로드맵 뷰 ────────────────────────────────────────────────────────────────
function RoadmapView({ navigate }: { navigate: ReturnType<typeof useNavigate> }) {
  const [roadmaps, setRoadmaps] = useState<RoadmapItem[]>([]);
  const [goals, setGoals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  useEffect(() => {
    Promise.all([apiGetRoadmaps(), apiGetGoals()])
      .then(([rm, gl]) => {
        setRoadmaps(rm);
        setGoals(gl);
        if (rm.length > 0) setSelectedId(rm[0].id);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleGenerate = async (goalId: number) => {
    setGenerating(true);
    try {
      const rm = await apiGenerateRoadmap(goalId);
      setRoadmaps(prev => {
        const exists = prev.findIndex(r => r.goalId === goalId);
        const next = exists >= 0 ? prev.map((r, i) => i === exists ? rm : r) : [...prev, rm];
        return next;
      });
      setSelectedId(rm.id);
    } catch {} finally { setGenerating(false); }
  };

  const handleCheckItem = async (roadmapId: number, stageIndex: number, itemIndex: number, currentlyChecked: boolean) => {
    // 낙관적 업데이트
    setRoadmaps(prev => prev.map(r => {
      if (r.id !== roadmapId) return r;
      const stages = r.stages.map((s, si) => {
        if (si !== stageIndex) return s;
        const set = new Set(s.checkedItems ?? []);
        currentlyChecked ? set.delete(itemIndex) : set.add(itemIndex);
        const checkedItems = Array.from(set);
        const allChecked = checkedItems.length >= s.items.length;
        let status = s.status;
        if (allChecked && status !== 'completed') status = 'completed';
        if (!allChecked && status === 'completed') status = 'in_progress';
        return { ...s, checkedItems, status };
      });
      // 다음 단계 자동 in_progress
      const updated = stages.map((s, si) => {
        if (si === stageIndex + 1 && stages[stageIndex].status === 'completed' && s.status === 'pending') {
          return { ...s, status: 'in_progress' as const };
        }
        return s;
      });
      return { ...r, stages: updated, progressPercent: calcLocalProgress(updated) };
    }));
    try {
      const updated = await apiCheckRoadmapItem(roadmapId, stageIndex, itemIndex, !currentlyChecked);
      if (updated) setRoadmaps(prev => prev.map(r => r.id === roadmapId ? updated : r));
    } catch {}
  };

  const handleUpdateItem = async (roadmapId: number, stageIndex: number, itemIndex: number, text: string) => {
    setRoadmaps(prev => prev.map(r => {
      if (r.id !== roadmapId) return r;
      const stages = r.stages.map((s, si) => {
        if (si !== stageIndex) return s;
        const items = [...s.items];
        items[itemIndex] = text;
        return { ...s, items };
      });
      return { ...r, stages };
    }));
    try {
      await apiUpdateRoadmapItem(roadmapId, stageIndex, itemIndex, text);
    } catch {}
  };

  if (loading) return (
    <div className="scroll-area" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="t-subdued">불러오는 중...</div>
    </div>
  );

  // 로드맵 없는 목표 목록
  const goalsWithoutRoadmap = goals.filter(g => !roadmaps.some(r => r.goalId === g.id));

  const selected = roadmaps.find(r => r.id === selectedId) ?? roadmaps[0] ?? null;

  return (
    <div className="scroll-area" style={{ padding: '4px 0 24px', position: 'relative', zIndex: 1 }}>

      {/* 로드맵 선택 목록 */}
      <div style={{ padding: '0 20px 16px' }}>
        <div className="t-section" style={{ marginBottom: 10 }}>내 로드맵</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {roadmaps.map(rm => {
            const prog = calcLocalProgress(rm.stages);
            const isSelected = rm.id === selected?.id;
            return (
              <button key={rm.id} onClick={() => setSelectedId(rm.id)}
                style={{
                  textAlign: 'left', padding: '14px 16px',
                  background: isSelected ? 'var(--bg-card)' : 'var(--bg-surface)',
                  border: isSelected ? '1px solid var(--accent)' : '1px solid var(--border-default)',
                  borderRadius: 12, transition: 'all 150ms',
                }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-bright)' }}>
                    {rm.goal?.title ?? rm.title}
                  </span>
                  <span style={{ fontSize: 13, fontWeight: 800, color: isSelected ? 'var(--accent)' : 'var(--text-subdued)' }}>
                    {prog}%
                  </span>
                </div>
                <div style={{ height: 4, borderRadius: 2, background: 'var(--bg-surface-hi)', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${prog}%`, background: 'var(--accent)', borderRadius: 2, transition: 'width 400ms' }}/>
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-subdued)', marginTop: 6 }}>
                  {rm.totalWeeks}주 · v{rm.updateCount}
                </div>
              </button>
            );
          })}

          {/* 로드맵 없는 목표 → 생성 버튼 */}
          {goalsWithoutRoadmap.map(g => (
            <button key={g.id} onClick={() => handleGenerate(g.id)} disabled={generating}
              style={{
                textAlign: 'left', padding: '14px 16px',
                background: 'var(--bg-surface)', border: '1px dashed var(--border-default)',
                borderRadius: 12, opacity: generating ? 0.6 : 1,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}>
              <span style={{ fontSize: 14, color: 'var(--text-subdued)' }}>{g.title}</span>
              <span style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 700 }}>
                {generating ? '생성 중...' : '+ 로드맵 생성'}
              </span>
            </button>
          ))}

          {goals.length === 0 && roadmaps.length === 0 && (
            <button className="btn btn-primary btn-full" style={{ height: 52, marginTop: 8 }} onClick={() => navigate('/goals')}>
              목표 먼저 추가하기
            </button>
          )}
        </div>
      </div>

      {/* 선택된 로드맵 상세 */}
      {selected && (
        <>
          {/* 헤더 */}
          <div style={{ padding: '0 20px 16px' }}>
            <div className="hero-gradient">
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', opacity: 0.7 }}>
                ROADMAP
              </div>
              <div style={{ fontSize: 20, fontWeight: 800, marginTop: 6, lineHeight: 1.25 }}>
                {selected.goal?.title ?? selected.title}
              </div>
              <div style={{ fontSize: 12, opacity: 0.75, marginTop: 4 }}>{selected.title}</div>
              <div style={{ display: 'flex', gap: 10, marginTop: 12, fontSize: 12 }}>
                <span style={{ background: 'rgba(0,0,0,0.2)', padding: '4px 10px', borderRadius: 999, fontWeight: 700 }}>
                  {selected.totalWeeks}주 플랜
                </span>
                <span style={{ background: 'rgba(0,0,0,0.2)', padding: '4px 10px', borderRadius: 999, fontWeight: 700 }}>
                  진행률 {calcLocalProgress(selected.stages)}%
                </span>
                <span style={{ background: 'rgba(255,255,255,0.25)', padding: '4px 10px', borderRadius: 999, fontWeight: 700 }}>
                  v{selected.updateCount}
                </span>
              </div>
            </div>
          </div>

          {/* 주차별 계획 */}
          <div style={{ padding: '0 20px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div className="t-section">주차별 계획</div>
            <button onClick={() => handleGenerate(selected.goalId)} disabled={generating}
              style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 700, opacity: generating ? 0.5 : 1 }}>
              {generating ? '재생성 중...' : '업데이트'}
            </button>
          </div>

          <div style={{ padding: '0 20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {selected.stages.map((stage: RoadmapStage, stageIdx: number) => (
                <StageCard
                  key={stageIdx}
                  stage={stage}
                  stageIdx={stageIdx}
                  roadmapId={selected.id}
                  onCheck={handleCheckItem}
                  onUpdateItem={handleUpdateItem}
                  onNavigateCourses={() => navigate('/courses')}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ─── 단계 카드 컴포넌트 ──────────────────────────────────────────────────────
function StageCard({
  stage, stageIdx, roadmapId, onCheck, onUpdateItem, onNavigateCourses,
}: {
  stage: RoadmapStage;
  stageIdx: number;
  roadmapId: number;
  onCheck: (rid: number, si: number, ii: number, checked: boolean) => void;
  onUpdateItem: (rid: number, si: number, ii: number, text: string) => void;
  onNavigateCourses: () => void;
}) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editText, setEditText] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const startEdit = (idx: number, currentText: string) => {
    setEditingIndex(idx);
    setEditText(currentText);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const commitEdit = (idx: number) => {
    if (editText.trim() && editText.trim() !== stage.items[idx]) {
      onUpdateItem(roadmapId, stageIdx, idx, editText.trim());
    }
    setEditingIndex(null);
  };

  return (
    <div style={{
      background: stage.status === 'in_progress' ? 'var(--bg-card)' : 'var(--bg-surface)',
      borderRadius: 12, padding: 14,
      border: stage.status === 'in_progress' ? '1px solid var(--accent)' : '1px solid transparent',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 11, fontWeight: 800, color: stage.status === 'completed' ? 'var(--accent)' : 'var(--text-subdued)' }}>
          {stage.week}
        </span>
        <span style={{ fontSize: 11, color: 'var(--text-subdued)' }}>·</span>
        <span style={{ fontSize: 11, color: 'var(--text-subdued)' }}>
          {stage.status === 'completed' ? '✓ 완료' : stage.status === 'in_progress' ? '진행 중' : '예정'}
        </span>
      </div>
      <div style={{ fontSize: 15, fontWeight: 700, marginTop: 4, color: 'var(--text-bright)' }}>{stage.title}</div>

      <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
        {stage.items.map((item, j) => {
          const isDone = (stage.checkedItems ?? []).includes(j);
          const isEditing = editingIndex === j;
          return (
            <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, padding: '4px 0', borderRadius: 6 }}>
              {/* 체크박스 */}
              <span onClick={() => !isEditing && onCheck(roadmapId, stageIdx, j, isDone)}
                style={{
                  width: 20, height: 20, borderRadius: '50%', flexShrink: 0, cursor: 'pointer',
                  border: `2px solid ${isDone ? 'var(--accent)' : 'var(--border-default)'}`,
                  background: isDone ? 'var(--accent)' : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 200ms cubic-bezier(.2,.8,.2,1)',
                  transform: isDone ? 'scale(1.05)' : 'scale(1)',
                }}>
                {isDone && <Icon name="check-filled" size={12} style={{ color: '#001f12' }}/>}
              </span>

              {/* 항목 텍스트 or 편집 인풋 */}
              {isEditing ? (
                <input
                  ref={inputRef}
                  value={editText}
                  onChange={e => setEditText(e.target.value)}
                  onBlur={() => commitEdit(j)}
                  onKeyDown={e => { if (e.key === 'Enter') commitEdit(j); if (e.key === 'Escape') setEditingIndex(null); }}
                  style={{
                    flex: 1, fontSize: 13, background: 'var(--bg-surface-hi)',
                    border: '1px solid var(--accent)', borderRadius: 6, padding: '3px 8px',
                    color: 'var(--text-base)', outline: 'none',
                  }}
                />
              ) : (
                <span
                  style={{
                    flex: 1, color: isDone ? 'var(--text-subdued)' : 'var(--text-base)',
                    textDecoration: isDone ? 'line-through' : 'none', transition: 'all 200ms',
                  }}>
                  {item}
                </span>
              )}

              {/* 편집 버튼 */}
              {!isEditing && (
                <button onClick={() => startEdit(j, item)}
                  style={{ opacity: 0.35, transition: 'opacity 150ms', padding: '2px 4px', flexShrink: 0 }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
                  onMouseLeave={e => (e.currentTarget.style.opacity = '0.35')}>
                  <Icon name="edit" size={13} style={{ color: 'var(--text-subdued)' }}/>
                </button>
              )}
            </div>
          );
        })}
      </div>

      {stage.status === 'in_progress' && (
        <div style={{ display: 'flex', gap: 8, marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--border-default)' }}>
          <button onClick={onNavigateCourses} className="chip" style={{ background: 'var(--accent)', color: '#001f12' }}>
            <Icon name="play" size={12}/> 추천 강의
          </button>
        </div>
      )}
    </div>
  );
}

// ─── AI 코치 뷰 ──────────────────────────────────────────────────────────────
type Msg = { role: 'user' | 'ai'; text: string };

function AIChatView() {
  const [messages, setMessages] = useState<Msg[]>([
    { role: 'ai', text: '안녕하세요! 저는 Millog AI 코치입니다. 학습 계획, 로드맵 조정, 강의 추천 등 자기개발에 관한 무엇이든 물어보세요 👋' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const send = async (text: string) => {
    if (!text.trim() || loading) return;
    setMessages(m => [...m, { role: 'user', text }]);
    setInput('');
    setLoading(true);
    try {
      const history = messages.map(m => ({ role: m.role === 'ai' ? 'assistant' : 'user', content: m.text }));
      const res = await apiAiChat(text, history);
      setMessages(m => [...m, { role: 'ai', text: res.reply }]);
    } catch {
      setMessages(m => [...m, { role: 'ai', text: 'AI 연결에 실패했습니다. 잠시 후 다시 시도해주세요.' }]);
    } finally { setLoading(false); }
  };

  return (
    <>
      <div ref={scrollRef} className="scroll-area" style={{ padding: '12px 16px 16px', position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {messages.map((m, i) => (
          m.role === 'user'
            ? <div key={i} className="bubble bubble-user">{m.text}</div>
            : <div key={i} className="bubble bubble-ai">
                <ReactMarkdown>{m.text}</ReactMarkdown>
              </div>
        ))}
        {loading && (
          <div className="bubble bubble-ai" style={{ paddingTop: 4, paddingBottom: 4 }}>
            <div className="typing-dots">
              <span/><span/><span/>
            </div>
          </div>
        )}
      </div>

      <div style={{ padding: '0 16px 8px', display: 'flex', gap: 6, overflowX: 'auto', flexShrink: 0 }}>
        {['약점 진단', '일정 조정', '이번 주 요약', '강의 추천'].map(p => (
          <button key={p} className="chip chip-outline" style={{ flexShrink: 0 }} onClick={() => send(p)}>{p}</button>
        ))}
      </div>

      <div style={{ padding: '8px 16px 14px', display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0, borderTop: '1px solid var(--border-default)' }}>
        <input className="input" style={{ height: 44, flex: 1, background: 'var(--bg-surface)', border: '1px solid var(--border-default)', borderRadius: 8 }}
          placeholder="AI 코치에게 물어보기..." value={input}
          onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send(input)}/>
        <button className="btn-icon-circle" style={{ width: 44, height: 44, flexShrink: 0 }} onClick={() => send(input)}>
          <Icon name="arrow-right" size={18}/>
        </button>
      </div>
    </>
  );
}
