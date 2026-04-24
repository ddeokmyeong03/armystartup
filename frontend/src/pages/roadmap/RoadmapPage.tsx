import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import TabBar from '../../shared/components/TabBar';
import PageHeader from '../../shared/components/PageHeader';
import { Icon } from '../../shared/components/Icon';
import { apiGetRoadmaps, apiGenerateRoadmap, apiGetGoals, apiAiChat, apiCheckRoadmapItem } from '../../shared/api/index';
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

function RoadmapView({ navigate }: { navigate: ReturnType<typeof useNavigate> }) {
  const [roadmaps, setRoadmaps] = useState<RoadmapItem[]>([]);
  const [goals, setGoals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    Promise.all([apiGetRoadmaps(), apiGetGoals()])
      .then(([rm, gl]) => { setRoadmaps(rm); setGoals(gl); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const toggleCheck = async (roadmapId: number, stageIndex: number, itemIndex: number, currentlyChecked: boolean) => {
    setRoadmaps(prev => prev.map(r => {
      if (r.id !== roadmapId) return r;
      const stages = r.stages.map((s, si) => {
        if (si !== stageIndex) return s;
        const set = new Set(s.checkedItems ?? []);
        currentlyChecked ? set.delete(itemIndex) : set.add(itemIndex);
        return { ...s, checkedItems: Array.from(set) };
      });
      return { ...r, stages };
    }));
    try {
      const updated = await apiCheckRoadmapItem(roadmapId, stageIndex, itemIndex, !currentlyChecked);
      if (updated) setRoadmaps(prev => prev.map(r => r.id === roadmapId ? updated : r));
    } catch {}
  };

  const handleGenerate = async (goalId: number) => {
    setGenerating(true);
    try {
      const rm = await apiGenerateRoadmap(goalId);
      setRoadmaps(prev => {
        const exists = prev.findIndex(r => r.goalId === goalId);
        return exists >= 0 ? prev.map((r, i) => i === exists ? rm : r) : [...prev, rm];
      });
    } catch {} finally { setGenerating(false); }
  };

  if (loading) return <div className="scroll-area" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div className="t-subdued">불러오는 중...</div></div>;

  if (roadmaps.length === 0) {
    return (
      <div className="scroll-area" style={{ padding: '20px', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🗺️</div>
          <div className="t-title" style={{ fontSize: 20 }}>아직 로드맵이 없어요</div>
          <div className="t-subdued" style={{ marginTop: 8 }}>목표를 기반으로 AI 로드맵을 생성하세요</div>
        </div>
        {goals.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div className="t-section" style={{ marginBottom: 4 }}>목표 선택</div>
            {goals.map((g: any) => (
              <button key={g.id} className="card" style={{ textAlign: 'left', display: 'flex', alignItems: 'center', gap: 12 }}
                onClick={() => handleGenerate(g.id)} disabled={generating}>
                <span style={{ flex: 1, fontSize: 14, fontWeight: 600 }}>{g.title}</span>
                <span style={{ color: 'var(--accent)', fontSize: 12, fontWeight: 700 }}>{generating ? '생성 중...' : '생성 →'}</span>
              </button>
            ))}
          </div>
        )}
        {goals.length === 0 && (
          <button className="btn btn-primary btn-full" style={{ marginTop: 20, height: 52 }} onClick={() => navigate('/goals')}>
            목표 먼저 추가하기
          </button>
        )}
      </div>
    );
  }

  const rm = roadmaps[0];
  if (!rm) return null;

  return (
    <div className="scroll-area" style={{ padding: '4px 0 24px', position: 'relative', zIndex: 1 }}>
      <div style={{ padding: '0 20px 16px' }}>
        <div className="hero-gradient">
          <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', opacity: 0.7 }}>PRIMARY GOAL</div>
          <div style={{ fontSize: 20, fontWeight: 800, marginTop: 6, lineHeight: 1.25 }}>{rm.goal?.title ?? rm.title}</div>
          <div style={{ display: 'flex', gap: 10, marginTop: 14, fontSize: 12 }}>
            <span style={{ background: 'rgba(0,0,0,0.2)', padding: '4px 10px', borderRadius: 999, fontWeight: 700 }}>{rm.totalWeeks}주 플랜</span>
            <span style={{ background: 'rgba(0,0,0,0.2)', padding: '4px 10px', borderRadius: 999, fontWeight: 700 }}>진행률 {rm.progressPercent}%</span>
            <span style={{ background: 'rgba(255,255,255,0.25)', padding: '4px 10px', borderRadius: 999, fontWeight: 700 }}>v{rm.updateCount}</span>
          </div>
        </div>
      </div>

      <div style={{ padding: '0 20px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div className="t-section">주차별 계획</div>
        {goals.length > 0 && (
          <button onClick={() => handleGenerate(rm.goalId)} disabled={generating}
            style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 700, opacity: generating ? 0.5 : 1 }}>
            {generating ? '재생성 중...' : '업데이트'}
          </button>
        )}
      </div>

      <div style={{ padding: '0 20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {rm.stages.map((stage: RoadmapStage) => (
            <div key={stage.week} style={{ paddingBottom: 2 }}>
              <div style={{
                background: stage.status === 'in_progress' ? 'var(--bg-card)' : 'var(--bg-surface)',
                borderRadius: 12, padding: 14,
                border: stage.status === 'in_progress' ? '1px solid var(--accent)' : '1px solid transparent',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 11, fontWeight: 800, color: stage.status === 'completed' ? 'var(--accent)' : 'var(--text-subdued)' }}>{stage.week}</span>
                  <span style={{ fontSize: 11, color: 'var(--text-subdued)' }}>·</span>
                  <span style={{ fontSize: 11, color: 'var(--text-subdued)' }}>
                    {stage.status === 'completed' ? '완료' : stage.status === 'in_progress' ? '진행 중' : '예정'}
                  </span>
                </div>
                <div style={{ fontSize: 15, fontWeight: 700, marginTop: 4, color: 'var(--text-bright)' }}>{stage.title}</div>
                <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {stage.items.map((item, j) => {
                    const stageIdx = rm.stages.indexOf(stage);
                    const isDone = (stage.checkedItems ?? []).includes(j);
                    return (
                      <div key={j} onClick={() => toggleCheck(rm.id, stageIdx, j, isDone)}
                        style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, cursor: 'pointer', padding: '4px 0', borderRadius: 6, transition: 'background 150ms' }}
                        onMouseDown={e => (e.currentTarget.style.background = 'rgba(34,255,178,0.06)')}
                        onMouseUp={e => (e.currentTarget.style.background = 'transparent')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                        <span style={{
                          width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
                          border: `2px solid ${isDone ? 'var(--accent)' : 'var(--border-default)'}`,
                          background: isDone ? 'var(--accent)' : 'transparent',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          transition: 'all 200ms cubic-bezier(.2,.8,.2,1)',
                          transform: isDone ? 'scale(1.05)' : 'scale(1)',
                        }}>
                          {isDone && <Icon name="check-filled" size={12} style={{ color: '#001f12' }}/>}
                        </span>
                        <span style={{ flex: 1, color: isDone ? 'var(--text-subdued)' : 'var(--text-base)', textDecoration: isDone ? 'line-through' : 'none', transition: 'all 200ms' }}>{item}</span>
                      </div>
                    );
                  })}
                </div>
                {stage.status === 'in_progress' && (
                  <div style={{ display: 'flex', gap: 8, marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--border-default)' }}>
                    <button onClick={() => navigate('/courses')} className="chip" style={{ background: 'var(--accent)', color: '#001f12' }}>
                      <Icon name="play" size={12}/> 추천 강의
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

type Msg = { role: 'user' | 'ai'; kind: 'text' | 'plan'; text: string; plan?: { time: string; task: string; tag: string }[] };

function AIChatView() {
  const [messages, setMessages] = useState<Msg[]>([
    { role: 'ai', kind: 'text', text: '안녕하세요! 저는 Millog AI 코치입니다. 학습 계획, 로드맵 조정, 강의 추천 등 자기개발에 관한 무엇이든 물어보세요 👋' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const send = async (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg: Msg = { role: 'user', kind: 'text', text };
    setMessages(m => [...m, userMsg]);
    setInput('');
    setLoading(true);
    try {
      const history = messages.map(m => ({ role: m.role === 'ai' ? 'assistant' : 'user', content: m.text }));
      const res = await apiAiChat(text, history);
      setMessages(m => [...m, { role: 'ai', kind: 'text', text: res.reply }]);
    } catch {
      setMessages(m => [...m, { role: 'ai', kind: 'text', text: 'AI 연결에 실패했습니다. 잠시 후 다시 시도해주세요.' }]);
    } finally { setLoading(false); }
  };

  return (
    <>
      <div ref={scrollRef} className="scroll-area" style={{ padding: '12px 16px 16px', position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {messages.map((m, i) => (
          m.role === 'user'
            ? <div key={i} className="bubble bubble-user">{m.text}</div>
            : <div key={i} className="bubble bubble-ai">{m.text}</div>
        ))}
        {loading && <div className="bubble bubble-ai" style={{ opacity: 0.6 }}>답변 생성 중...</div>}
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
