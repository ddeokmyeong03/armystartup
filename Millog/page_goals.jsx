// page_goals.jsx — Goals management
const GoalsPage = () => {
  const { goto } = useNav();
  const [filter, setFilter] = useState('all');
  const [showNew, setShowNew] = useState(false);
  const cats = ['all','자격증','어학','취업','취미'];
  const list = filter === 'all' ? GOALS : GOALS.filter(g => g.category === filter);
  const overall = GOALS.reduce((s, g) => s + g.progress, 0) / GOALS.length;

  return (
    <div className="page page-enter">
      <div className="page-gradient"/>
      <StatusSpacer/>
      <PageHeader title="목표 관리" subtitle={`${USER.rank} ${USER.name} · 전역 D-${USER.dDay}`}
        right={<button onClick={() => setShowNew(true)} style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--accent)', color: '#001f12', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="plus" size={18}/></button>}
      />

      <div className="scroll-area" style={{ padding: '4px 0 24px', position: 'relative', zIndex: 1 }}>
        {/* Overall summary */}
        <div style={{ padding: '0 20px 16px' }}>
          <div className="card" style={{ padding: 18, display: 'flex', alignItems: 'center', gap: 16 }}>
            <div className="ring-wrap" style={{ width: 84, height: 84 }}>
              <svg width="84" height="84">
                <circle className="ring-track" cx="42" cy="42" r="36" strokeWidth="8"/>
                <circle className="ring-fill" cx="42" cy="42" r="36" strokeWidth="8"
                  strokeDasharray={`${2 * Math.PI * 36}`}
                  strokeDashoffset={`${2 * Math.PI * 36 * (1 - overall)}`}
                />
              </svg>
              <div className="ring-center">
                <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-bright)' }}>{Math.round(overall * 100)}%</div>
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <div className="t-eyebrow">전체 진행률</div>
              <div className="t-title" style={{ fontSize: 18, marginTop: 4 }}>
                {GOALS.filter(g => g.progress >= 1).length}개 완료 / {GOALS.length}개 진행 중
              </div>
              <div className="t-subdued" style={{ marginTop: 4, fontSize: 12 }}>전역까지 {USER.dDay}일 남았어요</div>
            </div>
          </div>
        </div>

        {/* Category filter */}
        <div className="h-scroll" style={{ padding: '0 20px', marginBottom: 14 }}>
          {cats.map(c => (
            <button key={c} className={`chip ${filter === c ? 'active' : ''}`} style={{ padding: '8px 14px' }} onClick={() => setFilter(c)}>
              {c === 'all' ? '전체' : c}
            </button>
          ))}
        </div>

        {/* Goals list */}
        <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {list.map(g => <GoalCard key={g.id} g={g}/>)}
        </div>

        {/* Tip */}
        <div style={{ padding: '20px 20px 0' }}>
          <div style={{ background: 'var(--accent-soft)', border: '1px solid var(--accent)', borderRadius: 12, padding: 14, display: 'flex', gap: 10 }}>
            <IconSparkle size={20} style={{ color: 'var(--accent)', flexShrink: 0, marginTop: 2 }}/>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-bright)' }}>AI가 이번 주 초점을 추천해요</div>
              <div style={{ fontSize: 12, color: 'var(--text-subdued)', marginTop: 4, lineHeight: 1.5 }}>
                "정보처리기사 필기"가 마감까지 23일. 남은 가용시간으로 모의고사 3회차를 권장합니다.
              </div>
              <button onClick={() => goto('roadmap')} style={{ marginTop: 10, color: 'var(--accent)', fontSize: 12, fontWeight: 700 }}>
                AI 로드맵에서 보기 →
              </button>
            </div>
          </div>
        </div>
      </div>

      {showNew && <NewGoalSheet onClose={() => setShowNew(false)}/>}
    </div>
  );
};

function GoalCard({ g }) {
  const catColor = { '자격증': '#8b5cf6', '어학': '#f59e0b', '취업': '#10b981', '취미': '#ef4444' }[g.category];
  const daysLeft = g.deadline ? Math.ceil((new Date(g.deadline) - new Date('2026-04-23')) / (1000*60*60*24)) : null;
  return (
    <div style={{
      background: 'var(--bg-surface)',
      borderRadius: 12,
      padding: 16,
      position: 'relative',
      overflow: 'hidden',
    }}>
      {g.pinned && <div style={{ position: 'absolute', top: 12, right: 12, fontSize: 10, color: 'var(--accent)', fontWeight: 800 }}>📌 PINNED</div>}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
        <span style={{ width: 8, height: 8, borderRadius: 2, background: catColor }}/>
        <span style={{ fontSize: 11, fontWeight: 700, color: catColor, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{g.category}</span>
      </div>
      <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-bright)', lineHeight: 1.3 }}>{g.title}</div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 14, marginBottom: 6 }}>
        <div style={{ fontSize: 12, color: 'var(--text-subdued)' }}>
          {g.tasksDone} / {g.tasksTotal} 단계
        </div>
        <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--accent)' }}>{Math.round(g.progress * 100)}%</div>
      </div>
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${g.progress * 100}%`, background: catColor }}/>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 }}>
        {g.deadline ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: daysLeft < 30 ? 'var(--text-warning)' : 'var(--text-subdued)' }}>
            <IconClock size={14}/> D-{daysLeft} · {g.deadline}
          </div>
        ) : (
          <div style={{ fontSize: 12, color: 'var(--text-subdued)' }}>상시 목표</div>
        )}
        <div style={{ display: 'flex', gap: 6 }}>
          <button className="chip" style={{ padding: '4px 10px', fontSize: 11 }}>수정</button>
          <button className="chip" style={{ padding: '4px 10px', fontSize: 11, background: 'var(--accent-soft)', color: 'var(--accent)' }}>+ 단계</button>
        </div>
      </div>
    </div>
  );
}

function NewGoalSheet({ onClose }) {
  const [title, setTitle] = useState('');
  const [cat, setCat] = useState('자격증');
  return (
    <>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 35 }}/>
      <div className="sheet">
        <div className="sheet-handle"/>
        <div style={{ padding: '4px 20px 0' }}>
          <div className="t-title" style={{ fontSize: 20, marginBottom: 4 }}>새 목표</div>
          <div className="t-subdued" style={{ marginBottom: 16 }}>달성하고 싶은 목표를 설정해보세요</div>
          <div>
            <div className="t-caption" style={{ marginBottom: 8 }}>목표</div>
            <input className="input" placeholder="예: 정보처리기사 필기 합격" value={title} onChange={e => setTitle(e.target.value)}/>
          </div>
          <div style={{ marginTop: 12 }}>
            <div className="t-caption" style={{ marginBottom: 8 }}>카테고리</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {['자격증','어학','취업','취미','독서','체력'].map(c => (
                <button key={c} className={`chip ${cat === c ? 'active' : ''}`} onClick={() => setCat(c)}>{c}</button>
              ))}
            </div>
          </div>
          <div style={{ marginTop: 12 }}>
            <div className="t-caption" style={{ marginBottom: 8 }}>마감일</div>
            <input className="input" type="date" defaultValue="2026-06-30"/>
          </div>
          <div style={{ marginTop: 20, padding: 14, background: 'var(--accent-soft)', borderRadius: 10, display: 'flex', gap: 10 }}>
            <IconSparkle size={20} style={{ color: 'var(--accent)', flexShrink: 0 }}/>
            <div style={{ fontSize: 12, lineHeight: 1.5, color: 'var(--text-base)' }}>
              목표를 저장하면 AI가 전역일까지 맞춤 로드맵을 만들어드려요.
            </div>
          </div>
          <button className="btn btn-primary btn-full" style={{ marginTop: 16, height: 52 }} onClick={onClose}>목표 저장 & 로드맵 생성</button>
        </div>
      </div>
    </>
  );
}

Object.assign(window, { GoalsPage });
