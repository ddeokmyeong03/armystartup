// page_roadmap.jsx — Roadmap + AI chat
const RoadmapPage = () => {
  const { goto } = useNav();
  const [tab, setTab] = useState('roadmap'); // roadmap | ai

  return (
    <div className="page page-enter">
      <div className="page-gradient"/>
      <StatusSpacer/>
      <PageHeader title="자기개발 로드맵" subtitle="AI가 매주 업데이트해요"
        right={<button style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--bg-surface-hi)', color: 'var(--text-base)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="more" size={18}/></button>}
      />
      <div style={{ padding: '0 20px 12px', position: 'relative', zIndex: 1 }}>
        <div className="segmented">
          <button className={tab === 'roadmap' ? 'active' : ''} onClick={() => setTab('roadmap')}>로드맵</button>
          <button className={tab === 'ai' ? 'active' : ''} onClick={() => setTab('ai')}>AI 코치</button>
        </div>
      </div>
      {tab === 'roadmap' ? <RoadmapView goto={goto}/> : <AIChatView/>}
    </div>
  );
};

function RoadmapView({ goto }) {
  return (
    <div className="scroll-area" style={{ padding: '4px 0 24px', position: 'relative', zIndex: 1 }}>
      {/* Current goal context */}
      <div style={{ padding: '0 20px 16px' }}>
        <div className="hero-gradient">
          <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', opacity: 0.7 }}>PRIMARY GOAL</div>
          <div style={{ fontSize: 20, fontWeight: 800, marginTop: 6, lineHeight: 1.25 }}>정보처리기사 필기 합격<br/><span style={{ opacity: 0.7 }}>+ TOEIC 850점</span></div>
          <div style={{ display: 'flex', gap: 10, marginTop: 14, fontSize: 12 }}>
            <span style={{ background: 'rgba(0,0,0,0.2)', padding: '4px 10px', borderRadius: 999, fontWeight: 700 }}>D-23</span>
            <span style={{ background: 'rgba(0,0,0,0.2)', padding: '4px 10px', borderRadius: 999, fontWeight: 700 }}>5주 플랜</span>
            <span style={{ background: 'rgba(255,255,255,0.25)', padding: '4px 10px', borderRadius: 999, fontWeight: 700 }}>v3 · 이번 주 업데이트</span>
          </div>
        </div>
      </div>

      {/* Week timeline */}
      <div style={{ padding: '0 20px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div className="t-section">주차별 계획</div>
        <button style={{ fontSize: 12, color: 'var(--text-subdued)' }}>모두 펼치기</button>
      </div>

      <div style={{ padding: '0 20px' }}>
        <div className="roadmap-rail" style={{ paddingLeft: 36 }}>
          {ROADMAP.map((r, i) => (
            <div key={r.week} className={`roadmap-node ${r.status === 'done' ? 'done' : r.status === 'current' ? 'current' : ''}`}
              style={{ paddingBottom: 18 }}>
              <div style={{
                background: r.status === 'current' ? 'var(--bg-card)' : 'var(--bg-surface)',
                borderRadius: 12,
                padding: 14,
                border: r.status === 'current' ? '1px solid var(--accent)' : '1px solid transparent',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 11, fontWeight: 800, color: r.status === 'done' ? 'var(--accent)' : 'var(--text-subdued)' }}>{r.week}</span>
                  <span style={{ fontSize: 11, color: 'var(--text-subdued)' }}>·</span>
                  <span style={{ fontSize: 11, color: 'var(--text-subdued)' }}>
                    {r.status === 'done' ? '완료' : r.status === 'current' ? '진행 중' : '예정'}
                  </span>
                </div>
                <div style={{ fontSize: 15, fontWeight: 700, marginTop: 4, color: 'var(--text-bright)' }}>{r.title}</div>
                <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {r.items.map((it, j) => (
                    <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                      {r.status === 'done' ? (
                        <span style={{ color: 'var(--accent)' }}><Icon name="check-filled" size={16}/></span>
                      ) : (
                        <span style={{ width: 16, height: 16, borderRadius: '50%', border: '1.5px solid var(--border-default)' }}/>
                      )}
                      <span style={{ color: r.status === 'done' ? 'var(--text-subdued)' : 'var(--text-base)', textDecoration: r.status === 'done' ? 'line-through' : 'none' }}>{it}</span>
                    </div>
                  ))}
                </div>
                {r.status === 'current' && (
                  <div style={{ display: 'flex', gap: 8, marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--border-default)' }}>
                    <button onClick={() => goto('courses')} className="chip" style={{ background: 'var(--accent)', color: '#001f12' }}>
                      <Icon name="play" size={12}/> 추천 강의 {ROADMAP_PICKS.length}
                    </button>
                    <button className="chip">일정 조정</button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Version history */}
      <div style={{ padding: '12px 20px 0' }}>
        <div className="t-section" style={{ marginBottom: 10 }}>업데이트 히스토리</div>
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          {[
            { v: 'v3', date: '2026-04-22', note: '근무 피로도 상승 반영, TOEIC 주당 학습량 -20%' },
            { v: 'v2', date: '2026-04-15', note: '정보처리기사 약점(DB) 보완 추가' },
            { v: 'v1', date: '2026-04-08', note: '첫 로드맵 생성 (정처기 + TOEIC)' },
          ].map((h, i) => (
            <div key={h.v} style={{ padding: 14, display: 'flex', alignItems: 'flex-start', gap: 10, borderBottom: i < 2 ? '1px solid var(--border-default)' : 'none' }}>
              <span style={{ background: i === 0 ? 'var(--accent)' : 'var(--bg-surface-hi)', color: i === 0 ? '#001f12' : 'var(--text-base)', padding: '2px 8px', borderRadius: 6, fontSize: 11, fontWeight: 800 }}>{h.v}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, color: 'var(--text-bright)' }}>{h.note}</div>
                <div className="t-caption" style={{ marginTop: 4 }}>{h.date}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AIChatView() {
  const [messages, setMessages] = useState(AI_MESSAGES_SEED);
  const [input, setInput] = useState('');
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const send = (text) => {
    if (!text.trim()) return;
    setMessages(m => [...m, { role: 'user', kind: 'text', text }]);
    setInput('');
    setTimeout(() => {
      setMessages(m => [...m, {
        role: 'ai', kind: 'plan',
        text: '좋아요. 오늘 저녁 시간을 이렇게 나눠봤어요.',
        plan: [
          { time: '19:00 – 20:00', task: '데이터베이스 정규화 개념 복습', tag: '정처기' },
          { time: '20:10 – 21:00', task: 'RC 파트5 30문제 + 오답 정리', tag: '토익' },
          { time: '21:10 – 21:40', task: 'pandas groupby 실습', tag: '파이썬' },
        ],
      }]);
    }, 420);
  };

  const pickOption = (label) => send(label);

  return (
    <>
      <div ref={scrollRef} className="scroll-area" style={{ padding: '12px 16px 16px', position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {messages.map((m, i) => {
          if (m.role === 'ai' && m.kind === 'options') {
            return (
              <React.Fragment key={i}>
                {m.text && <div className="bubble bubble-ai">{m.text}</div>}
                {m.options.map(o => (
                  <div key={o.id} className="bubble bubble-ai bubble-action" onClick={() => pickOption(o.label)}
                    style={{ display: 'flex', alignItems: 'center', gap: 10, maxWidth: '84%' }}>
                    <span style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--accent-soft)', color: 'var(--accent)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <IconSparkle size={16}/>
                    </span>
                    <span style={{ flex: 1 }}>{o.label}</span>
                    <Icon name="chevron-right" size={16} style={{ color: 'var(--text-subdued)' }}/>
                  </div>
                ))}
              </React.Fragment>
            );
          }
          if (m.role === 'ai' && m.kind === 'plan') {
            return (
              <div key={i} style={{ maxWidth: '88%' }}>
                <div className="bubble bubble-ai" style={{ marginBottom: 6 }}>{m.text}</div>
                <div style={{ background: 'var(--bg-surface)', borderRadius: 14, padding: 12, border: '1px solid var(--border-default)' }}>
                  <div className="t-eyebrow" style={{ marginBottom: 8 }}>오늘 저녁 플랜 · 2.7h</div>
                  {m.plan.map((p, j) => (
                    <div key={j} style={{ display: 'flex', gap: 10, padding: '8px 0', borderBottom: j < m.plan.length - 1 ? '1px solid var(--border-default)' : 'none' }}>
                      <div style={{ fontFamily: 'var(--font-title)', fontSize: 13, fontWeight: 800, minWidth: 88, color: 'var(--text-bright)' }}>{p.time}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, color: 'var(--text-bright)' }}>{p.task}</div>
                        <div style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 700, marginTop: 2 }}>#{p.tag}</div>
                      </div>
                    </div>
                  ))}
                  <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
                    <button className="chip active">캘린더에 추가</button>
                    <button className="chip">다시 짜기</button>
                  </div>
                </div>
              </div>
            );
          }
          if (m.role === 'user') {
            return <div key={i} className="bubble bubble-user">{m.text}</div>;
          }
          return <div key={i} className="bubble bubble-ai">{m.text}</div>;
        })}
      </div>

      {/* Quick prompts */}
      <div style={{ padding: '0 16px 8px', display: 'flex', gap: 6, overflowX: 'auto', flexShrink: 0 }}>
        {['약점 진단', '일정 조정', '이번 주 요약', '강의 추천'].map(p => (
          <button key={p} className="chip chip-outline" style={{ flexShrink: 0 }} onClick={() => send(p)}>{p}</button>
        ))}
      </div>

      {/* Input */}
      <div style={{ padding: '8px 16px 14px', display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0, borderTop: '1px solid var(--border-default)' }}>
        <input className="input" style={{ height: 44, flex: 1 }} placeholder="AI 코치에게 물어보기..." value={input}
          onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send(input)}/>
        <button className="btn-icon-circle" style={{ width: 44, height: 44, flexShrink: 0 }} onClick={() => send(input)}>
          <Icon name="arrow-right" size={18}/>
        </button>
      </div>
    </>
  );
}

Object.assign(window, { RoadmapPage });
