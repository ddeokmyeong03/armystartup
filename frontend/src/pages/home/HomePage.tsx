import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TabBar from '../../shared/components/TabBar';
import PageHeader from '../../shared/components/PageHeader';
import { Icon, IconGoal, IconSparkle, IconClock } from '../../shared/components/Icon';
import { apiGetHome, apiGetSchedulesByDate } from '../../shared/api/index';

const DUTY_TYPES = [
  { id: 'guard-night', label: '불침번',    fatigue: 0.9, color: '#8b5cf6', glyph: '불', hours: 2 },
  { id: 'cctv',        label: 'CCTV',      fatigue: 0.5, color: '#3b82f6', glyph: 'C',  hours: 4 },
  { id: 'duty-day',    label: '주간 당직', fatigue: 0.7, color: '#f59e0b', glyph: '주', hours: 4 },
  { id: 'duty-night',  label: '야간 당직', fatigue: 1.0, color: '#ef4444', glyph: '야', hours: 6 },
  { id: 'mess-clean',  label: '식당청소',  fatigue: 0.4, color: '#10b981', glyph: '식', hours: 2 },
  { id: 'training',    label: '훈련',      fatigue: 0.9, color: '#f43f5e', glyph: '훈', hours: 9 },
  { id: 'crst',        label: 'CRST',      fatigue: 1.0, color: '#dc2626', glyph: 'R',  hours: 8 },
  { id: 'gate',        label: '위병소',    fatigue: 0.6, color: '#06b6d4', glyph: '위', hours: 4 },
];

const today = new Date().toISOString().slice(0, 10);

function dDay(_enlistedAt?: string, dischargeDate?: string): number | null {
  if (!dischargeDate) return null;
  return Math.ceil((new Date(dischargeDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
}

export default function HomePage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<'quick' | 'week' | 'calendar'>('quick');
  const [todayDuties, setTodayDuties] = useState<string[]>([]);
  const [sleep, setSleep] = useState(7);
  const [meals, setMeals] = useState(2);
  const [personal, setPersonal] = useState(1);
  const [homeData, setHomeData] = useState<any>(null);
  const [todaySchedules, setTodaySchedules] = useState<any[]>([]);

  useEffect(() => {
    apiGetHome().then(setHomeData).catch(() => {});
    apiGetSchedulesByDate(today).then(setTodaySchedules).catch(() => {});
  }, []);

  const nickname = homeData?.nickname ?? localStorage.getItem('nickname') ?? '장병';
  const info = homeData?.profile;
  const dDayNum = dDay(info?.enlistedAt, info?.dischargeDate);

  const duties = todayDuties.map(id => DUTY_TYPES.find(d => d.id === id)).filter(Boolean) as typeof DUTY_TYPES;
  const dutyHours = duties.reduce((sum, d) => sum + d.hours, 0);
  const fatigue = duties.length ? duties.reduce((s, d) => s + d.fatigue, 0) / duties.length : 0;
  const rawAvail = Math.max(0, 24 - sleep - meals - personal - dutyHours);
  const adjusted = Math.max(0, rawAvail * (1 - fatigue * 0.25));
  const pct = Math.min(1, adjusted / 6);
  const r = 52;

  const toggleDuty = (id: string) =>
    setTodayDuties(ts => ts.includes(id) ? ts.filter(x => x !== id) : [...ts, id]);

  const goals = homeData?.activeGoals ?? [];

  return (
    <div className="page page-enter">
      <div className="page-gradient"/>
      <div style={{ height: 8 }}/>
      <PageHeader
        title={`안녕하세요, ${nickname}`}
        subtitle={info ? `${info.branch ?? ''} · ${dDayNum != null ? `전역 D-${dDayNum}` : ''}` : undefined}
        right={
          <button onClick={() => navigate('/profile')} style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--bg-surface-hi)', color: 'var(--text-base)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 13 }}>
            {nickname[0]}
          </button>
        }
      />

      <div className="scroll-area" style={{ padding: '4px 0 24px', position: 'relative', zIndex: 1 }}>
        {/* Hero: 가용시간 */}
        <div style={{ padding: '0 20px', marginBottom: 20 }}>
          <div style={{ background: 'var(--bg-surface)', borderRadius: 16, padding: 20, display: 'flex', alignItems: 'center', gap: 20, position: 'relative', overflow: 'hidden' }}>
            <div className="ring-wrap">
              <svg width="120" height="120">
                <circle className="ring-track" cx="60" cy="60" r={r} strokeWidth="10"/>
                <circle className="ring-fill" cx="60" cy="60" r={r} strokeWidth="10"
                  strokeDasharray={`${2 * Math.PI * r}`}
                  strokeDashoffset={`${2 * Math.PI * r * (1 - pct)}`}/>
              </svg>
              <div className="ring-center">
                <div style={{ fontFamily: 'var(--font-title)', fontSize: 32, fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-bright)' }}>{adjusted.toFixed(1)}</div>
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

        {/* 피로도 표시 */}
        {duties.length > 0 && (
          <div style={{ padding: '0 20px', marginBottom: 14 }}>
            <div style={{ background: 'var(--bg-surface)', borderRadius: 10, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, color: 'var(--text-subdued)', marginBottom: 4 }}>근무 피로도</div>
                <div style={{ height: 6, borderRadius: 3, background: 'var(--bg-surface-hi)', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${fatigue * 100}%`, background: fatigue > 0.7 ? '#ef4444' : fatigue > 0.4 ? '#f59e0b' : 'var(--accent)', borderRadius: 3, transition: 'width 400ms' }}/>
                </div>
              </div>
              <span style={{ fontSize: 14, fontWeight: 800, color: fatigue > 0.7 ? '#ef4444' : fatigue > 0.4 ? '#f59e0b' : 'var(--accent)' }}>
                {Math.round(fatigue * 100)}%
              </span>
            </div>
          </div>
        )}

        {/* 오늘의 일과 */}
        <div style={{ padding: '0 20px', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <div className="t-section">오늘의 일과</div>
            <button onClick={() => navigate('/schedule')} style={{ color: 'var(--accent)', fontSize: 13, fontWeight: 700 }}>일정 추가 +</button>
          </div>
          <div className="segmented" style={{ marginBottom: 14 }}>
            <button className={tab === 'quick' ? 'active' : ''} onClick={() => setTab('quick')}>퀵 입력</button>
            <button className={tab === 'week' ? 'active' : ''} onClick={() => setTab('week')}>오늘 일정</button>
            <button className={tab === 'calendar' ? 'active' : ''} onClick={() => setTab('calendar')}>시간 분석</button>
          </div>

          {tab === 'quick' && (
            <div className="card" style={{ padding: 14 }}>
              <div className="t-subdued" style={{ marginBottom: 10 }}>오늘 수행 중인 근무를 모두 선택하세요.</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {DUTY_TYPES.map(d => {
                  const on = todayDuties.includes(d.id);
                  return (
                    <button key={d.id} onClick={() => toggleDuty(d.id)} style={{
                      display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
                      borderRadius: 8, textAlign: 'left',
                      background: on ? 'var(--bg-card)' : 'transparent',
                      border: on ? `1px solid ${d.color}` : '1px solid var(--border-default)',
                      color: 'var(--text-base)',
                    }}>
                      <span style={{ width: 28, height: 28, borderRadius: 6, background: d.color, color: '#000', fontWeight: 800, fontSize: 13, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{d.glyph}</span>
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
              {todaySchedules.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '20px 0', color: 'var(--text-subdued)', fontSize: 13 }}>
                  오늘 등록된 일정이 없습니다.<br/>
                  <button onClick={() => navigate('/schedule')} style={{ marginTop: 10, color: 'var(--accent)', fontWeight: 700 }}>일정 추가 +</button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {todaySchedules.map((s: any) => (
                    <div key={s.id} onClick={() => navigate('/schedule/new', { state: { editItem: s } })} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)', flexShrink: 0 }}/>
                      <div style={{ flex: 1, fontSize: 13 }}>{s.title}</div>
                      <div className="t-caption"><IconClock size={10}/> {s.startTime} – {s.endTime}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {tab === 'calendar' && (
            <div className="card" style={{ padding: 16 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <Slider label="수면 시간" value={sleep} onChange={setSleep} min={4} max={10} step={0.5} suffix="h"/>
                <Slider label="식사/정비" value={meals} onChange={setMeals} min={1} max={5} step={0.5} suffix="h"/>
                <Slider label="개인정비" value={personal} onChange={setPersonal} min={0} max={4} step={0.5} suffix="h"/>
              </div>
              <div style={{ marginTop: 16, height: 28, borderRadius: 8, overflow: 'hidden', background: 'var(--bg-surface-hi)', display: 'flex' }}>
                {[
                  { h: sleep, c: '#8b5cf6' }, { h: dutyHours, c: '#f59e0b' },
                  { h: meals + personal, c: '#6b7280' }, { h: adjusted, c: 'var(--accent)' },
                ].filter(s => s.h > 0).map((s, i) => (
                  <div key={i} style={{ width: `${(s.h / 24) * 100}%`, background: s.c }}/>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 8 }}>
                {[{ c: '#8b5cf6', l: '수면', v: sleep }, { c: '#f59e0b', l: '근무', v: dutyHours }, { c: '#6b7280', l: '식사/개인', v: meals + personal }, { c: 'var(--accent)', l: '가용', v: adjusted }].map(x => (
                  <div key={x.l} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11 }}>
                    <span style={{ width: 8, height: 8, borderRadius: 2, background: x.c }}/><span style={{ color: 'var(--text-subdued)' }}>{x.l}</span><span style={{ fontWeight: 700 }}>{(x.v).toFixed(1)}h</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 목표 & 로드맵 CTA */}
        <div style={{ padding: '0 20px', marginBottom: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <button className="card" style={{ textAlign: 'left', cursor: 'pointer', padding: 16 }} onClick={() => navigate('/goals')}>
              <IconGoal size={22} style={{ color: 'var(--accent)' }}/>
              <div style={{ fontWeight: 700, fontSize: 14, marginTop: 10 }}>목표 관리</div>
              <div className="t-caption" style={{ marginTop: 2 }}>{goals.length}개 진행 중</div>
            </button>
            <button className="card" style={{ textAlign: 'left', cursor: 'pointer', padding: 16 }} onClick={() => navigate('/roadmap')}>
              <IconSparkle size={22} style={{ color: 'var(--accent)' }}/>
              <div style={{ fontWeight: 700, fontSize: 14, marginTop: 10 }}>AI 로드맵</div>
              <div className="t-caption" style={{ marginTop: 2 }}>AI 코치에게 묻기</div>
            </button>
          </div>
        </div>
      </div>

      <TabBar/>
    </div>
  );
}

function Slider({ label, value, onChange, min, max, step, suffix }: { label: string; value: number; onChange: (v: number) => void; min: number; max: number; step: number; suffix: string }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <div style={{ fontSize: 13, fontWeight: 600 }}>{label}</div>
        <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--accent)' }}>{value}{suffix}</div>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(Number(e.target.value))}
        style={{ width: '100%', accentColor: 'var(--accent)' }}/>
    </div>
  );
}
