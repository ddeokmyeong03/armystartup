import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PageHeader from '../../shared/components/PageHeader';
import { Icon } from '../../shared/components/Icon';
import { apiCreateSchedule, apiUpdateSchedule, apiDeleteSchedule } from '../../shared/api/index';

const DUTY_TYPES = [
  { id: 'guard-night', label: '불침번',   fatigue: 0.9, color: '#8b5cf6', glyph: '불' },
  { id: 'cctv',        label: 'CCTV',    fatigue: 0.5, color: '#3b82f6', glyph: 'C' },
  { id: 'duty-day',    label: '주간 당직', fatigue: 0.7, color: '#f59e0b', glyph: '주' },
  { id: 'duty-night',  label: '야간 당직', fatigue: 1.0, color: '#ef4444', glyph: '야' },
  { id: 'mess-clean',  label: '식당청소', fatigue: 0.4, color: '#10b981', glyph: '식' },
  { id: 'training',    label: '훈련',     fatigue: 0.9, color: '#f43f5e', glyph: '훈' },
  { id: 'crst',        label: 'CRST',    fatigue: 1.0, color: '#dc2626', glyph: 'R' },
  { id: 'gate',        label: '위병소',   fatigue: 0.6, color: '#06b6d4', glyph: '위' },
];

const inputSt: React.CSSProperties = {
  width: '100%', height: 48, background: 'var(--bg-surface)',
  border: '1px solid var(--border-default)', borderRadius: 8,
  padding: '0 12px', fontSize: 14, color: 'var(--text-base)',
  outline: 'none', fontFamily: 'inherit',
};

function HourSelect({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div style={{ position: 'relative' }}>
      <select value={value} onChange={e => onChange(Number(e.target.value))}
        style={{ ...inputSt, appearance: 'none', WebkitAppearance: 'none', paddingRight: 32, cursor: 'pointer' }}>
        {Array.from({ length: 24 }, (_, i) => (
          <option key={i} value={i}>{String(i).padStart(2, '0')}:00</option>
        ))}
      </select>
      <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-subdued)', pointerEvents: 'none', fontSize: 12 }}>▼</span>
    </div>
  );
}

function SchSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <div className="t-section" style={{ fontSize: 15, marginBottom: 10 }}>{label}</div>
      {children}
    </div>
  );
}

export default function ScheduleCreatePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const editItem = (location.state as any)?.editItem ?? null;

  const todayStr = new Date().toISOString().slice(0, 10);
  const [dutyType, setDutyType] = useState<string>(editItem?.category ?? '');
  const [customTitle, setCustomTitle] = useState<string>(editItem?.title ?? '');
  const [startDate, setStartDate] = useState<string>(editItem?.scheduleDate ?? todayStr);
  const [startHour, setStartHour] = useState<number>(editItem?.startTime ? parseInt(editItem.startTime) : 9);
  const [endDate, setEndDate] = useState<string>(editItem?.endDate ?? todayStr);
  const [endHour, setEndHour] = useState<number>(editItem?.endTime ? parseInt(editItem.endTime) : 18);
  const [note, setNote] = useState<string>(editItem?.memo ?? '');
  const [loading, setLoading] = useState(false);

  const crossDay = endDate > startDate;
  const selectedDuty = DUTY_TYPES.find(d => d.id === dutyType);
  const isEdit = !!editItem?.id;

  const pad = (n: number) => String(n).padStart(2, '0');

  const handleSave = async () => {
    const title = customTitle || selectedDuty?.label || '';
    if (!title) { return; }
    setLoading(true);
    try {
      if (isEdit) {
        await apiUpdateSchedule(editItem.id, {
          title, scheduleDate: startDate,
          startTime: `${pad(startHour)}:00`, endTime: `${pad(endHour)}:00`,
          endDate: crossDay ? endDate : undefined,
          category: dutyType || undefined,
          fatigueType: selectedDuty ? String(Math.round(selectedDuty.fatigue * 100)) : undefined,
          memo: note || undefined,
        } as any);
      } else {
        await apiCreateSchedule({
          title, scheduleDate: startDate,
          startTime: `${pad(startHour)}:00`, endTime: `${pad(endHour)}:00`,
          endDate: crossDay ? endDate : undefined,
          category: dutyType || undefined,
          fatigueType: selectedDuty ? String(Math.round(selectedDuty.fatigue * 100)) : undefined,
          memo: note || undefined,
        });
      }
      navigate(-1);
    } catch {} finally { setLoading(false); }
  };

  const handleDelete = async () => {
    if (!isEdit) return;
    setLoading(true);
    try { await apiDeleteSchedule(editItem.id); navigate(-1); }
    catch {} finally { setLoading(false); }
  };

  return (
    <div className="page page-enter" style={{ display: 'flex', flexDirection: 'column', position: 'fixed', inset: 0 }}>
      <div className="page-gradient"/>
      <div style={{ height: 8, flexShrink: 0 }}/>
      <PageHeader title={isEdit ? '일정 수정' : '일정 추가'} showBack/>

      <div className="scroll-area" style={{ padding: '8px 20px 48px', position: 'relative', zIndex: 1 }}>

        <SchSection label="근무 종류">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {DUTY_TYPES.map(d => {
              const on = dutyType === d.id;
              return (
                <button key={d.id} onClick={() => setDutyType(on ? '' : d.id)} style={{
                  display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 8, textAlign: 'left',
                  background: on ? 'var(--bg-card)' : 'transparent',
                  border: on ? `1.5px solid ${d.color}` : '1px solid var(--border-default)',
                  color: 'var(--text-base)',
                }}>
                  <span style={{ width: 28, height: 28, borderRadius: 6, background: d.color, color: '#000', fontWeight: 800, fontSize: 13, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {d.glyph}
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{d.label}</div>
                    <div style={{ fontSize: 10, color: 'var(--text-subdued)' }}>피로 {Math.round(d.fatigue * 100)}</div>
                  </div>
                  {on && <Icon name="check" size={14} style={{ color: d.color, flexShrink: 0 }}/>}
                </button>
              );
            })}
          </div>
          <div style={{ marginTop: 12 }}>
            <div className="t-caption" style={{ marginBottom: 8 }}>직접 입력 (선택)</div>
            <input className="input" placeholder="근무명 직접 입력" value={customTitle}
              onChange={e => setCustomTitle(e.target.value)} style={inputSt}/>
          </div>
        </SchSection>

        <SchSection label="시작 시간">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>
              <div className="t-caption" style={{ marginBottom: 8 }}>날짜</div>
              <input type="date" value={startDate} style={inputSt}
                onChange={e => {
                  setStartDate(e.target.value);
                  if (e.target.value > endDate) setEndDate(e.target.value);
                }}/>
            </div>
            <div>
              <div className="t-caption" style={{ marginBottom: 8 }}>시간</div>
              <HourSelect value={startHour} onChange={setStartHour}/>
            </div>
          </div>
        </SchSection>

        <SchSection label="종료 시간">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>
              <div className="t-caption" style={{ marginBottom: 8 }}>날짜</div>
              <input type="date" value={endDate} min={startDate} style={inputSt}
                onChange={e => setEndDate(e.target.value)}/>
            </div>
            <div>
              <div className="t-caption" style={{ marginBottom: 8 }}>시간</div>
              <HourSelect value={endHour} onChange={setEndHour}/>
            </div>
          </div>
          {crossDay && (
            <div style={{ marginTop: 10, padding: '10px 12px', background: 'var(--accent-soft)', border: '1px solid var(--accent)', borderRadius: 8, fontSize: 12, color: 'var(--accent)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Icon name="check-filled" size={14}/>
              익일 {pad(endHour)}:00 종료 — 다음날로 이어지는 근무
            </div>
          )}
        </SchSection>

        {(selectedDuty || customTitle) && (
          <div style={{ marginBottom: 20, padding: 14, background: 'var(--bg-surface)', borderRadius: 12, border: '1px solid var(--border-default)', display: 'flex', alignItems: 'center', gap: 12 }}>
            {selectedDuty && (
              <span style={{ width: 36, height: 36, borderRadius: 8, background: selectedDuty.color, color: '#000', fontWeight: 800, fontSize: 15, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {selectedDuty.glyph}
              </span>
            )}
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-bright)' }}>{customTitle || selectedDuty?.label}</div>
              <div className="t-caption" style={{ marginTop: 2 }}>
                {startDate} {pad(startHour)}:00 → {crossDay ? `${endDate} ` : ''}{pad(endHour)}:00
              </div>
            </div>
          </div>
        )}

        <SchSection label="메모 (선택)">
          <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="추가 메모를 입력하세요"
            style={{ width: '100%', minHeight: 80, background: 'var(--bg-surface)', border: '1px solid var(--border-default)', borderRadius: 8, padding: '10px 14px', fontSize: 14, color: 'var(--text-base)', resize: 'none', outline: 'none', fontFamily: 'inherit', lineHeight: 1.5 }}/>
        </SchSection>

        <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
          {isEdit && (
            <button className="btn btn-ghost" style={{ flex: 1, height: 52, color: '#ef4444', borderColor: '#ef4444' }}
              onClick={handleDelete} disabled={loading}>삭제</button>
          )}
          <button className="btn btn-primary" style={{ flex: 2, height: 52 }}
            onClick={handleSave} disabled={loading}>
            {loading ? '저장 중...' : isEdit ? '수정 완료' : '일정 저장'}
          </button>
        </div>
      </div>
    </div>
  );
}
