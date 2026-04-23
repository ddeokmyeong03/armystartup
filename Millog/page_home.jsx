// page_home.jsx — Home: 일과/근무 입력 + 가용시간 계산
const HomePage = () => {
  const { goto } = useNav();
  const [tab, setTab] = useState('quick'); // quick | week | calendar
  const [todayDuties, setTodayDuties] = useState(['duty-day', 'guard-night']);
  const [sleep, setSleep] = useState(7);   // hours
  const [meals, setMeals] = useState(2);   // hours total
  const [personal, setPersonal] = useState(1);
  const [showSheet, setShowSheet] = useState(false);

  const duties = todayDuties.map(id => DUTY_TYPES.find(d => d.id === id)).filter(Boolean);
  const dutyHours = duties.reduce((sum, d, i) => {
    // approximate: assume 4h per non-night duty, 2h for night-guard
    const w = d.id === 'guard-night' ? 2 : d.id === 'duty-night' ? 6 : d.id === 'training' ? 9 : 4;
    return sum + w;
  }, 0);
  const fatigue = duties.reduce((s, d) => s + d.fatigue, 0) / Math.max(duties.length, 1);
  const rawAvail = Math.max(0, 24 - sleep - meals - personal - dutyHours);
  const adjusted = Math.max(0, rawAvail * (1 - fatigue * 0.25));
  const pct = Math.min(1, adjusted / 6); // ring fills at 6h

  const toggleDuty = (id) => setTodayDuties(ts => ts.includes(id) ? ts.filter(x => x !== id) : [...ts, id]);

  return (
    <div className="page page-enter">
      <div className="page-gradient"/>
      <StatusSpacer/>
      <PageHeader
        title={`안녕하세요, ${USER.rank} ${USER.name}`}
        subtitle={`${USER.branch} · 전역 D-${USER.dDay}`}
        right={
          <button onClick={() => goto('profile')} style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--bg-surface-hi)', color: 'var(--text-base)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 13 }}>
            진
          </button>
        }
      />

      <div className="scroll-area" style={{ padding: '4px 0 24px', position: 'relative', zIndex: 1 }}>

        {/* Hero: 오늘의 가용시간 */}
        <div style={{ padding: '0 20px', marginBottom: 20 }}>
          <div style={{
            background: 'var(--bg-surface)',
            borderRadius: 16,
            padding: 20,
            display: 'flex',
            alignItems: 'center',
            gap: 20,
            position: 'relative',
            overflow: 'hidden',
          }}>
            <div className="ring-wrap">
              <svg width="120" height="120">
                <circle className="ring-track" cx="60" cy="60" r="52" strokeWidth="10"/>
                <circle className="ring-fill" cx="60" cy="60" r="52" strokeWidth="10"
                  strokeDasharray={`${2 * Math.PI * 52}`}
                  strokeDashoffset={`${2 * Math.PI * 52 * (1 - pct)}`}
                />
              </svg>
              <div className="ring-center">
                <div style={{ fontFamily: 'var(--font-title)', fontSize: 32, fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-bright)' }}>
                  {adjusted.toFixed(1)}
                </div>
                <div className="t-caption" style={{ color: 'var(--accent)', fontWeight: 700 }}>시간</div>
              </div>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="t-eyebrow">오늘의 가용시간</div>
              <div className="t-title" style={{ fontSize: 20, marginTop: 4 }}>집중 학습에 쓸 수 있어요</div>
              <div style={{ display: 'flex', gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
                <span className="chip chip-outline" style={{ fontSize: 11 }}>원본 {rawAvail.toFixed(1)}h</span>
                <span className="chip" style={{ fontSize: 11, background: 'rgba(239,68,68,0.15)', color: '#ffaaaa' }}>
                  피로 -{(rawAvail - adjusted).toFixed(1)}h
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Duty input — segmented */}
        <div style={{ padding: '0 20px', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <div className="t-section">오늘의 일과</div>
            <button onClick={() => setShowSheet(true)} style={{ color: 'var(--accent)', fontSize: 13, fontWeight: 700 }}>자세히 입력 →</button>
          </div>
          <div className="segmented" style={{ marginBottom: 14 }}>
            <button className={tab === 'quick' ? 'active' : ''} onClick={() => setTab('quick')}>퀵 입력</button>
            <button className={tab === 'week' ? 'active' : ''} onClick={() => setTab('week')}>주간</button>
            <button className={tab === 'calendar' ? 'active' : ''} onClick={() => setTab('calendar')}>캘린더</button>
          </div>

          {tab === 'quick' && (
            <div className="card" style={{ padding: 14 }}>
              <div className="t-subdued" style={{ marginBottom: 10 }}>오늘 수행 중인 근무를 모두 선택하세요.</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {DUTY_TYPES.map(d => {
                  const on = todayDuties.includes(d.id);
                  return (
                    <button key={d.id} onClick={() => toggleDuty(d.id)} style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      padding: '10px 12px',
                      borderRadius: 8,
                      background: on ? 'var(--bg-card)' : 'transparent',
                      border: on ? `1px solid ${d.color}` : '1px solid var(--border-default)',
                      color: 'var(--text-base)',
                      textAlign: 'left',
                    }}>
                      <span style={{ width: 28, height: 28, borderRadius: 6, background: d.color, color: '#000', fontWeight: 800, fontSize: 13, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                        {d.glyph}
                      </span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 600 }}>{d.label}</div>
                        <div style={{ fontSize: 10, color: 'var(--text-subdued)' }}>피로 {Math.round(d.fatigue * 100)}</div>
                      </div>
                      {on && <Icon name="check" size={16} style={{ color: 'var(--accent)' }}/>}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {tab === 'week' && (
            <div className="card" style={{ padding: 14 }}>
              <div style={{ display: 'flex', gap: 4 }}>
                {WEEK.map((d, i) => {
                  const color = d.items[0] ? DUTY_TYPES.find(x => x.id === d.items[0].type)?.color : null;
                  return (
                    <div key={i} style={{
                      flex: 1,
                      background: d.today ? 'var(--bg-card)' : 'transparent',
                      border: d.today ? '1px solid var(--accent)' : '1px solid transparent',
                      borderRadius: 8,
                      padding: '10px 4px 8px',
                      textAlign: 'center',
                    }}>
                      <div style={{ fontSize: 10, color: 'var(--text-subdued)' }}>{d.day}</div>
                      <div style={{ fontSize: 14, fontWeight: 700, marginTop: 2, color: d.today ? 'var(--accent)' : 'var(--text-base)' }}>{d.date}</div>
                      <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 3, alignItems: 'center' }}>
                        {d.items.slice(0, 2).map((it, j) => {
                          const dt = DUTY_TYPES.find(x => x.id === it.type);
                          return <div key={j} style={{ width: 18, height: 3, borderRadius: 2, background: dt?.color || 'transparent' }}/>;
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div style={{ marginTop: 14, borderTop: '1px solid var(--border-default)', paddingTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {WEEK[TODAY_INDEX].items.map((it, i) => {
                  const d = DUTY_TYPES.find(x => x.id === it.type);
                  return (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: d.color }}/>
                      <div style={{ flex: 1, fontSize: 13 }}>{d.label}</div>
                      <div className="t-caption">{it.start}:00 – {it.end}:00</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {tab === 'calendar' && (
            <div className="card" style={{ padding: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <button style={{ color: 'var(--text-subdued)' }}><Icon name="chevron-left" size={18}/></button>
                <div style={{ fontWeight: 700, fontSize: 15 }}>2026년 4월</div>
                <button style={{ color: 'var(--text-subdued)' }}><Icon name="chevron-right" size={18}/></button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 3, fontSize: 10, color: 'var(--text-subdued)', marginBottom: 6 }}>
                {['일','월','화','수','목','금','토'].map(d => <div key={d} style={{ textAlign: 'center' }}>{d}</div>)}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 3 }}>
                {Array.from({length: 30}, (_, i) => {
                  const d = i + 1;
                  const isToday = d === 22;
                  const hasEvent = [20,21,22,23,24,25,27,28].includes(d);
                  const eventColor = [18,25].includes(d) ? '#ef4444' : [22].includes(d) ? 'var(--accent)' : '#8b5cf6';
                  return (
                    <div key={d} style={{
                      aspectRatio: '1',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 3,
                      borderRadius: 6,
                      background: isToday ? 'var(--accent-soft)' : 'transparent',
                      color: isToday ? 'var(--accent)' : 'var(--text-base)',
                      fontSize: 12,
                      fontWeight: isToday ? 800 : 500,
                    }}>
                      {d}
                      {hasEvent && <span style={{ width: 4, height: 4, borderRadius: '50%', background: eventColor }}/>}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Time breakdown stacked bar */}
        <div style={{ padding: '0 20px', marginBottom: 20 }}>
          <div className="t-section" style={{ marginBottom: 10 }}>하루 24시간 구성</div>
          <StackedDay sleep={sleep} meals={meals} personal={personal} dutyHours={dutyHours} avail={adjusted}/>
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginTop: 12 }}>
            <Legend color="#8b5cf6" label="수면" value={sleep}/>
            <Legend color="#f59e0b" label="근무" value={dutyHours}/>
            <Legend color="#6b7280" label="식사/개인" value={meals + personal}/>
            <Legend color="var(--accent)" label="가용시간" value={adjusted}/>
          </div>
        </div>

        {/* Quick adjust sliders */}
        <div style={{ padding: '0 20px', marginBottom: 20 }}>
          <div className="card" style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>
            <Slider label="수면 시간" value={sleep} onChange={setSleep} min={4} max={10} step={0.5} suffix="h"/>
            <Slider label="식사/정비" value={meals} onChange={setMeals} min={1} max={5} step={0.5} suffix="h"/>
            <Slider label="개인정비" value={personal} onChange={setPersonal} min={0} max={4} step={0.5} suffix="h"/>
          </div>
        </div>

        {/* Today's roadmap picks shortcut */}
        <div style={{ padding: '0 20px', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <div>
              <div className="t-eyebrow">TODAY'S FOR YOU</div>
              <div className="t-section" style={{ marginTop: 4 }}>가용시간에 맞춘 추천</div>
            </div>
            <button onClick={() => goto('courses')} style={{ color: 'var(--text-subdued)', fontSize: 13 }}>더보기 →</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {ROADMAP_PICKS.slice(0, 2).map(c => (
              <div key={c.id} className="course-tile" onClick={() => goto('courses')}>
                <div className="course-thumb" style={{ background: c.color, color: '#000' }}>
                  {c.tag[0]}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-bright)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {c.title}
                  </div>
                  <div className="t-caption" style={{ marginTop: 2 }}>{c.provider} · {c.duration}분</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2 }}>
                  <span style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 800 }}>{c.match}%</span>
                  <span className="t-caption">매칭</span>
                </div>
                <button className="btn-icon-circle" style={{ width: 36, height: 36 }}>
                  <Icon name="play" size={14}/>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* CTA row */}
        <div style={{ padding: '0 20px 8px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <button className="card" style={{ textAlign: 'left', cursor: 'pointer', padding: 16 }} onClick={() => goto('goals')}>
            <IconGoal size={22} style={{ color: 'var(--accent)' }}/>
            <div style={{ fontWeight: 700, fontSize: 14, marginTop: 10 }}>목표 관리</div>
            <div className="t-caption" style={{ marginTop: 2 }}>{GOALS.length}개 진행 중</div>
          </button>
          <button className="card" style={{ textAlign: 'left', cursor: 'pointer', padding: 16 }} onClick={() => goto('roadmap')}>
            <IconSparkle size={22} style={{ color: 'var(--accent)' }}/>
            <div style={{ fontWeight: 700, fontSize: 14, marginTop: 10 }}>AI 로드맵</div>
            <div className="t-caption" style={{ marginTop: 2 }}>W3 진행 중</div>
          </button>
        </div>
      </div>

      {showSheet && <DetailSheet onClose={() => setShowSheet(false)}/>}
    </div>
  );
};

function Slider({ label, value, onChange, min, max, step, suffix }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <div style={{ fontSize: 13, fontWeight: 600 }}>{label}</div>
        <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--accent)' }}>{value}{suffix}</div>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={e => onChange(Number(e.target.value))}
        style={{
          width: '100%',
          accentColor: 'var(--accent)',
        }}
      />
    </div>
  );
}

function Legend({ color, label, value }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
      <span style={{ width: 10, height: 10, borderRadius: 2, background: color }}/>
      <span style={{ color: 'var(--text-subdued)' }}>{label}</span>
      <span style={{ fontWeight: 700 }}>{value.toFixed ? value.toFixed(1) : value}h</span>
    </div>
  );
}

function StackedDay({ sleep, meals, personal, dutyHours, avail }) {
  const total = 24;
  const other = Math.max(0, total - sleep - meals - personal - dutyHours - avail);
  const segs = [
    { label: '수면', h: sleep, c: '#8b5cf6' },
    { label: '근무', h: dutyHours, c: '#f59e0b' },
    { label: '식사/개인', h: meals + personal, c: '#6b7280' },
    { label: '가용', h: avail, c: 'var(--accent)' },
    { label: '잔여', h: other, c: 'var(--bg-surface-hi)' },
  ].filter(s => s.h > 0);

  return (
    <div>
      <div style={{ display: 'flex', height: 28, borderRadius: 8, overflow: 'hidden', background: 'var(--bg-surface)' }}>
        {segs.map((s, i) => (
          <div key={i} title={`${s.label} ${s.h.toFixed(1)}h`} style={{ width: `${(s.h / total) * 100}%`, background: s.c }}/>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 10, color: 'var(--text-subdued)' }}>
        <span>06:00 기상</span>
        <span>12:00</span>
        <span>18:00</span>
        <span>24:00 취침</span>
      </div>
    </div>
  );
}

function DetailSheet({ onClose }) {
  return (
    <>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 35, animation: 'fadeIn 200ms ease-out' }}/>
      <div className="sheet">
        <div className="sheet-handle"/>
        <div style={{ padding: '4px 20px 0' }}>
          <div className="t-title" style={{ fontSize: 20, marginBottom: 4 }}>상세 일과 입력</div>
          <div className="t-subdued" style={{ marginBottom: 14 }}>시간대별로 근무를 추가해보세요</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { t: '06:00 – 08:00', l: '기상 / 아침점호', c: '#6b7280' },
              { t: '09:00 – 12:00', l: '주간 당직 (오전)', c: '#f59e0b' },
              { t: '12:00 – 13:00', l: '점심 / 개인정비', c: '#6b7280' },
              { t: '13:00 – 18:00', l: '주간 당직 (오후)', c: '#f59e0b' },
              { t: '22:00 – 24:00', l: '불침번 1번초', c: '#8b5cf6' },
            ].map((it, i) => (
              <div key={i} className="row" style={{ background: 'var(--bg-surface-hi)' }}>
                <span style={{ width: 4, height: 32, borderRadius: 2, background: it.c }}/>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>{it.l}</div>
                  <div className="t-caption">{it.t}</div>
                </div>
                <button style={{ color: 'var(--text-subdued)' }}><Icon name="more" size={18}/></button>
              </div>
            ))}
            <button className="btn btn-ghost btn-full" style={{ marginTop: 8 }}>
              <Icon name="plus" size={16}/> 시간대 추가
            </button>
          </div>
          <button className="btn btn-primary btn-full" style={{ marginTop: 16, height: 52 }} onClick={onClose}>저장</button>
        </div>
      </div>
    </>
  );
}

Object.assign(window, { HomePage });
