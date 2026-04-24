// page_schedule.jsx — 일정 추가 / 수정
const SchedulePage = () => {
  const { back } = useNav();
  const editItem = window.__scheduleEdit || null;

  const [dutyType, setDutyType] = useState(editItem?.dutyType || '');
  const [customTitle, setCustomTitle] = useState(editItem?.customTitle || '');
  const [startDate, setStartDate] = useState(editItem?.startDate || '2026-04-23');
  const [startHour, setStartHour] = useState(editItem?.startHour ?? 9);
  const [endDate, setEndDate] = useState(editItem?.endDate || '2026-04-23');
  const [endHour, setEndHour] = useState(editItem?.endHour ?? 18);
  const [note, setNote] = useState(editItem?.note || '');

  const crossDay = endDate > startDate;
  const selectedDuty = DUTY_TYPES.find(d => d.id === dutyType);

  const handleSave = () => {
    window.__scheduleEdit = null;
    back();
  };
  const handleDelete = () => {
    window.__scheduleEdit = null;
    back();
  };

  return (
    <div className="page page-enter">
      <div className="page-gradient"/>
      <StatusSpacer/>
      <PageHeader title={editItem ? '일정 수정' : '일정 추가'} showBack/>

      <div className="scroll-area" style={{ padding: '8px 20px 48px', position: 'relative', zIndex: 1 }}>

        {/* 근무 종류 */}
        <SchSection label="근무 종류">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {DUTY_TYPES.map(d => {
              const on = dutyType === d.id;
              return (
                <button key={d.id} onClick={() => setDutyType(on ? '' : d.id)} style={{
                  display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
                  borderRadius: 8, textAlign: 'left',
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
            <input className="input" placeholder="근무명 직접 입력"
              value={customTitle} onChange={e => setCustomTitle(e.target.value)}
              style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-default)', borderRadius: 8 }}/>
          </div>
        </SchSection>

        {/* 시작 시간 */}
        <SchSection label="시작 시간">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>
              <div className="t-caption" style={{ marginBottom: 8 }}>날짜</div>
              <input type="date" value={startDate} onChange={e => {
                setStartDate(e.target.value);
                if (e.target.value > endDate) setEndDate(e.target.value);
              }} style={inputStyle}/>
            </div>
            <div>
              <div className="t-caption" style={{ marginBottom: 8 }}>시간</div>
              <HourSelect value={startHour} onChange={setStartHour}/>
            </div>
          </div>
        </SchSection>

        {/* 종료 시간 */}
        <SchSection label="종료 시간">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>
              <div className="t-caption" style={{ marginBottom: 8 }}>날짜</div>
              <input type="date" value={endDate} min={startDate}
                onChange={e => setEndDate(e.target.value)} style={inputStyle}/>
            </div>
            <div>
              <div className="t-caption" style={{ marginBottom: 8 }}>시간</div>
              <HourSelect value={endHour} onChange={setEndHour}/>
            </div>
          </div>
          {crossDay && (
            <div style={{ marginTop: 10, padding: '10px 12px', background: 'var(--accent-soft)', border: '1px solid var(--accent)', borderRadius: 8, fontSize: 12, color: 'var(--accent)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Icon name="check-filled" size={14}/>
              익일 {String(endHour).padStart(2,'0')}:00 종료 — 다음날로 이어지는 근무
            </div>
          )}
        </SchSection>

        {/* 시간 요약 미리보기 */}
        {(selectedDuty || customTitle) && (
          <div style={{ marginBottom: 20, padding: 14, background: 'var(--bg-surface)', borderRadius: 12, border: '1px solid var(--border-default)', display: 'flex', alignItems: 'center', gap: 12 }}>
            {selectedDuty && (
              <span style={{ width: 36, height: 36, borderRadius: 8, background: selectedDuty.color, color: '#000', fontWeight: 800, fontSize: 15, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {selectedDuty.glyph}
              </span>
            )}
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-bright)' }}>
                {customTitle || selectedDuty?.label}
              </div>
              <div className="t-caption" style={{ marginTop: 2 }}>
                {startDate} {String(startHour).padStart(2,'0')}:00
                {' → '}
                {crossDay ? `${endDate} ` : ''}{String(endHour).padStart(2,'0')}:00
              </div>
            </div>
          </div>
        )}

        {/* 메모 */}
        <SchSection label="메모 (선택)">
          <textarea value={note} onChange={e => setNote(e.target.value)}
            placeholder="추가 메모를 입력하세요"
            style={{ width: '100%', minHeight: 80, background: 'var(--bg-surface)', border: '1px solid var(--border-default)', borderRadius: 8, padding: '10px 14px', fontSize: 14, color: 'var(--text-base)', resize: 'none', outline: 'none', fontFamily: 'inherit', lineHeight: 1.5 }}/>
        </SchSection>

        {/* 저장/삭제 버튼 */}
        <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
          {editItem && (
            <button className="btn btn-ghost" style={{ flex: 1, height: 52, color: '#ef4444', borderColor: '#ef4444' }} onClick={handleDelete}>
              삭제
            </button>
          )}
          <button className="btn btn-primary" style={{ flex: 2, height: 52 }} onClick={handleSave}>
            {editItem ? '수정 완료' : '일정 저장'}
          </button>
        </div>
      </div>
    </div>
  );
};

const inputStyle = {
  width: '100%', height: 48,
  background: 'var(--bg-surface)',
  border: '1px solid var(--border-default)',
  borderRadius: 8, padding: '0 12px',
  fontSize: 14, color: 'var(--text-base)',
  outline: 'none', fontFamily: 'inherit',
};

function HourSelect({ value, onChange }) {
  return (
    <div style={{ position: 'relative' }}>
      <select value={value} onChange={e => onChange(Number(e.target.value))}
        style={{ ...inputStyle, appearance: 'none', WebkitAppearance: 'none', paddingRight: 32, cursor: 'pointer' }}>
        {Array.from({ length: 24 }, (_, i) => (
          <option key={i} value={i}>{String(i).padStart(2, '0')}:00</option>
        ))}
      </select>
      <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-subdued)', pointerEvents: 'none', fontSize: 12 }}>▼</span>
    </div>
  );
}

function SchSection({ label, children }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <div className="t-section" style={{ fontSize: 15, marginBottom: 10 }}>{label}</div>
      {children}
    </div>
  );
}

Object.assign(window, { SchedulePage });
