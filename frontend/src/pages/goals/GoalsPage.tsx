import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TabBar from '../../shared/components/TabBar';
import PageHeader from '../../shared/components/PageHeader';
import { Icon, IconSparkle, IconClock } from '../../shared/components/Icon';
import { apiGetGoals, apiCreateGoal, apiUpdateGoal, apiDeleteGoal } from '../../shared/api/index';
import type { GoalItem } from '../../shared/api/index';

const CAT_COLORS: Record<string, string> = { '자격증': '#8b5cf6', '어학': '#f59e0b', '취업': '#10b981', '취미': '#ef4444', '기타': '#6b7280' };

export default function GoalsPage() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');
  const [goals, setGoals] = useState<GoalItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNew, setShowNew] = useState(false);

  const load = () => {
    setLoading(true);
    apiGetGoals().then(setGoals).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const cats = ['all', '자격증', '어학', '취업', '취미', '기타'];
  const list = filter === 'all' ? goals : goals.filter(g => g.category === filter);
  const overall = goals.length ? goals.reduce((s, g) => s + g.progressPercent, 0) / goals.length / 100 : 0;

  const handleToggleActive = async (g: GoalItem) => {
    try {
      const updated = await apiUpdateGoal(g.id, { isActive: !g.isActive });
      if (updated) setGoals(prev => prev.map(x => x.id === g.id ? updated : x));
    } catch {}
  };

  const handleDelete = async (id: number) => {
    if (!confirm('목표를 삭제하시겠습니까?')) return;
    try {
      await apiDeleteGoal(id);
      setGoals(prev => prev.filter(x => x.id !== id));
    } catch {}
  };

  return (
    <div className="page page-enter">
      <div className="page-gradient"/>
      <div style={{ height: 8 }}/>
      <PageHeader title="목표 관리" subtitle={`${goals.length}개 진행 중`}
        right={
          <button onClick={() => setShowNew(true)} style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--accent)', color: '#001f12', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="plus" size={18}/>
          </button>
        }
      />

      <div className="scroll-area" style={{ padding: '4px 0 24px', position: 'relative', zIndex: 1 }}>
        <div style={{ padding: '0 20px 16px' }}>
          <div className="card" style={{ padding: 18, display: 'flex', alignItems: 'center', gap: 16 }}>
            <div className="ring-wrap" style={{ width: 84, height: 84, flexShrink: 0 }}>
              <svg width="84" height="84">
                <circle className="ring-track" cx="42" cy="42" r="36" strokeWidth="8"/>
                <circle className="ring-fill" cx="42" cy="42" r="36" strokeWidth="8"
                  strokeDasharray={`${2 * Math.PI * 36}`}
                  strokeDashoffset={`${2 * Math.PI * 36 * (1 - overall)}`}/>
              </svg>
              <div className="ring-center"><div style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-bright)' }}>{Math.round(overall * 100)}%</div></div>
            </div>
            <div style={{ flex: 1 }}>
              <div className="t-eyebrow">전체 진행률</div>
              <div className="t-title" style={{ fontSize: 18, marginTop: 4 }}>
                {goals.filter(g => g.progressPercent >= 100).length}개 완료 / {goals.length}개 진행 중
              </div>
            </div>
          </div>
        </div>

        <div className="h-scroll" style={{ padding: '0 20px', marginBottom: 14 }}>
          {cats.map(c => (
            <button key={c} className={`chip ${filter === c ? 'active' : ''}`} style={{ padding: '8px 14px' }} onClick={() => setFilter(c)}>
              {c === 'all' ? '전체' : c}
            </button>
          ))}
        </div>

        <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {loading ? (
            <div className="t-subdued" style={{ textAlign: 'center', padding: '40px 0' }}>불러오는 중...</div>
          ) : list.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>🎯</div>
              <div className="t-subdued">아직 목표가 없어요</div>
              <button onClick={() => setShowNew(true)} style={{ marginTop: 12, color: 'var(--accent)', fontWeight: 700 }}>첫 목표 추가하기 +</button>
            </div>
          ) : list.filter(g => g && g.id).map(g => (
            <GoalCard key={g.id} g={g}
              onToggle={() => handleToggleActive(g)}
              onDelete={() => handleDelete(g.id)}
              onUpdate={(updated) => { if (updated) setGoals(prev => prev.map(x => x.id === updated.id ? updated : x)); }}
            />
          ))}
        </div>

        {goals.length > 0 && (
          <div style={{ padding: '20px 20px 0' }}>
            <div style={{ background: 'var(--accent-soft)', border: '1px solid var(--accent)', borderRadius: 12, padding: 14, display: 'flex', gap: 10 }}>
              <IconSparkle size={20} style={{ color: 'var(--accent)', flexShrink: 0, marginTop: 2 }}/>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-bright)' }}>AI 로드맵으로 계획을 세워보세요</div>
                <div style={{ fontSize: 12, color: 'var(--text-subdued)', marginTop: 4, lineHeight: 1.5 }}>
                  목표를 기반으로 AI가 맞춤형 학습 로드맵을 생성해드립니다.
                </div>
                <button onClick={() => navigate('/roadmap')} style={{ marginTop: 10, color: 'var(--accent)', fontSize: 12, fontWeight: 700 }}>
                  AI 로드맵에서 보기 →
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {showNew && <NewGoalSheet onClose={() => setShowNew(false)} onCreated={load}/>}
      <TabBar/>
    </div>
  );
}

function GoalCard({ g, onToggle, onDelete, onUpdate }: { g: GoalItem; onToggle: () => void; onDelete: () => void; onUpdate: (g: GoalItem) => void }) {
  const [expanded, setExpanded] = useState(false);
  const [progress, setProgress] = useState(g.progressPercent);
  const [saving, setSaving] = useState(false);

  const catColor = CAT_COLORS[g.category] ?? '#6b7280';
  const daysLeft = g.deadline ? Math.ceil((new Date(g.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : null;

  const handleProgressSave = async () => {
    setSaving(true);
    try {
      const updated = await apiUpdateGoal(g.id, { progressPercent: progress });
      onUpdate(updated);
    } catch {} finally { setSaving(false); }
  };

  return (
    <div style={{ background: 'var(--bg-surface)', borderRadius: 12, padding: 16, position: 'relative', opacity: g.isActive ? 1 : 0.65 }}>
      {g.pinned && <div style={{ position: 'absolute', top: 12, right: 12, fontSize: 10, color: 'var(--accent)', fontWeight: 800 }}>📌 PINNED</div>}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
        <span style={{ width: 8, height: 8, borderRadius: 2, background: catColor }}/>
        <span style={{ fontSize: 11, fontWeight: 700, color: catColor, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{g.category}</span>
        {!g.isActive && <span style={{ fontSize: 10, color: '#f59e0b', fontWeight: 700, marginLeft: 4 }}>일시중지</span>}
      </div>
      <button style={{ width: '100%', textAlign: 'left', color: 'var(--text-bright)' }} onClick={() => setExpanded(e => !e)}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 16, fontWeight: 700, lineHeight: 1.3, flex: 1 }}>{g.title}</span>
          <Icon name="chevron-right" size={16} style={{ color: 'var(--text-subdued)', flexShrink: 0, transform: expanded ? 'rotate(-90deg)' : 'rotate(90deg)', transition: 'transform 200ms' }}/>
        </div>
      </button>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 14, marginBottom: 6 }}>
        <div style={{ fontSize: 12, color: 'var(--text-subdued)' }}>진행률</div>
        <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--accent)' }}>{g.progressPercent}%</div>
      </div>
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${g.progressPercent}%`, background: catColor }}/>
      </div>

      {expanded && (
        <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--border-default)' }}>
          {g.targetDescription && (
            <div style={{ marginBottom: 12, fontSize: 13, color: 'var(--text-subdued)', lineHeight: 1.6 }}>{g.targetDescription}</div>
          )}
          <div style={{ marginBottom: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <div style={{ fontSize: 12, color: 'var(--text-subdued)' }}>진행률 업데이트</div>
              <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--accent)' }}>{progress}%</div>
            </div>
            <input type="range" min={0} max={100} step={5} value={progress}
              onChange={e => setProgress(Number(e.target.value))}
              style={{ width: '100%', accentColor: catColor }}/>
            {progress !== g.progressPercent && (
              <button className="btn btn-primary btn-full" style={{ marginTop: 8, height: 40, fontSize: 13 }}
                onClick={handleProgressSave} disabled={saving}>
                {saving ? '저장 중...' : '진행률 저장'}
              </button>
            )}
          </div>
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 }}>
        {g.deadline ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: daysLeft !== null && daysLeft < 30 ? '#f59e0b' : 'var(--text-subdued)' }}>
            <IconClock size={14}/> {daysLeft !== null ? `D-${daysLeft}` : ''} · {g.deadline}
          </div>
        ) : (
          <div style={{ fontSize: 12, color: 'var(--text-subdued)' }}>상시 목표</div>
        )}
        <div style={{ display: 'flex', gap: 6 }}>
          <button className="chip" style={{ padding: '4px 10px', fontSize: 11 }} onClick={e => { e.stopPropagation(); onToggle(); }}>
            {g.isActive ? '⏸ 중지' : '▶ 재개'}
          </button>
          <button className="chip" style={{ padding: '4px 10px', fontSize: 11, background: 'rgba(239,68,68,0.15)', color: '#ff8888' }} onClick={e => { e.stopPropagation(); onDelete(); }}>삭제</button>
        </div>
      </div>
    </div>
  );
}

function NewGoalSheet({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [title, setTitle] = useState('');
  const [cat, setCat] = useState('자격증');
  const [deadline, setDeadline] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!title.trim()) return;
    setLoading(true);
    try {
      await apiCreateGoal({ title, category: cat, deadline: deadline || undefined, pinned: false });
      onCreated(); onClose();
    } catch {} finally { setLoading(false); }
  };

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 55 }}/>
      <div className="sheet" style={{ zIndex: 60 }}>
        <div className="sheet-handle"/>
        <div style={{ padding: '4px 20px 0' }}>
          <div className="t-title" style={{ fontSize: 20, marginBottom: 4 }}>새 목표</div>
          <div className="t-subdued" style={{ marginBottom: 16 }}>달성하고 싶은 목표를 설정해보세요</div>
          <div><div className="t-caption" style={{ marginBottom: 8 }}>목표</div>
            <input className="input" placeholder="예: 정보처리기사 필기 합격" value={title} onChange={e => setTitle(e.target.value)}
              style={{ background: 'var(--bg-base)', border: '1px solid var(--border-default)', borderRadius: 8 }}/></div>
          <div style={{ marginTop: 12 }}><div className="t-caption" style={{ marginBottom: 8 }}>카테고리</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {['자격증','어학','취업','취미','독서','체력','기타'].map(c => (
                <button key={c} className={`chip ${cat === c ? 'active' : ''}`} onClick={() => setCat(c)}>{c}</button>
              ))}
            </div>
          </div>
          <div style={{ marginTop: 12 }}><div className="t-caption" style={{ marginBottom: 8 }}>마감일 (선택)</div>
            <input className="input" type="date" value={deadline} onChange={e => setDeadline(e.target.value)}
              style={{ background: 'var(--bg-base)', border: '1px solid var(--border-default)', borderRadius: 8 }}/></div>
          <div style={{ marginTop: 20, padding: 14, background: 'var(--accent-soft)', borderRadius: 10, display: 'flex', gap: 10 }}>
            <IconSparkle size={20} style={{ color: 'var(--accent)', flexShrink: 0 }}/>
            <div style={{ fontSize: 12, lineHeight: 1.5 }}>목표를 저장하면 AI가 전역일까지 맞춤 로드맵을 만들어드려요.</div>
          </div>
          <button className="btn btn-primary btn-full" style={{ marginTop: 16, height: 52 }} onClick={handleSave} disabled={loading || !title.trim()}>
            {loading ? '저장 중...' : '목표 저장'}
          </button>
        </div>
      </div>
    </>
  );
}
