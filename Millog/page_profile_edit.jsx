// page_profile_edit.jsx — 프로필 수정 & 자기개발 설정
const ProfileEditPage = () => {
  const { back } = useNav();
  const initTab = window.__profileEditTab || 'profile';
  const [tab, setTab] = useState(initTab);
  const [form, setForm] = useState({
    name: USER.name,
    rank: USER.rank,
    branch: USER.branch,
    unit: USER.unit,
    enlistedAt: USER.enlistedAt,
    dischargeAt: USER.dischargeAt,
  });
  const [interests, setInterests] = useState(['cert', 'lang', 'it']);
  const [saved, setSaved] = useState(false);

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const toggleInterest = (id) => setInterests(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);

  const interestList = [
    { id: 'cert',    label: '자격증',     accent: '#8b5cf6' },
    { id: 'lang',    label: '어학',       accent: '#f59e0b' },
    { id: 'job',     label: '취업/진로',  accent: '#10b981' },
    { id: 'hobby',   label: '취미',       accent: '#ef4444' },
    { id: 'read',    label: '독서',       accent: '#3b82f6' },
    { id: 'health',  label: '체력',       accent: '#06b6d4' },
    { id: 'finance', label: '금융/재테크', accent: '#22FFB2' },
    { id: 'it',      label: '개발/IT',   accent: '#a855f7' },
  ];

  const handleSave = () => {
    USER.name = form.name;
    USER.rank = form.rank;
    window.__profileEditTab = null;
    setSaved(true);
    setTimeout(back, 900);
  };

  return (
    <div className="page page-enter">
      <div className="page-gradient"/>
      <StatusSpacer/>
      <PageHeader title="내 정보 수정" showBack/>

      <div style={{ padding: '0 20px 12px', position: 'relative', zIndex: 1 }}>
        <div className="segmented">
          <button className={tab === 'profile' ? 'active' : ''} onClick={() => setTab('profile')}>프로필 정보</button>
          <button className={tab === 'interests' ? 'active' : ''} onClick={() => setTab('interests')}>자기개발 설정</button>
        </div>
      </div>

      <div className="scroll-area" style={{ padding: '4px 20px 48px', position: 'relative', zIndex: 1 }}>

        {tab === 'profile' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {/* 아바타 */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, padding: '8px 0 4px' }}>
              <div style={{
                width: 80, height: 80, borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--accent), #0ec98a)',
                color: '#001f12', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--font-title)', fontWeight: 800, fontSize: 30,
                boxShadow: '0 10px 30px -10px var(--accent-glow)',
              }}>
                {form.name[0] || '?'}
              </div>
              <button style={{ color: 'var(--accent)', fontSize: 13, fontWeight: 700 }}>프로필 사진 변경</button>
            </div>

            <EditField label="이름">
              <input className="input" value={form.name} onChange={e => update('name', e.target.value)} style={fieldInputStyle}/>
            </EditField>

            <EditField label="계급">
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {['이병','일병','상병','병장'].map(r => (
                  <button key={r} className={`chip ${form.rank === r ? 'active' : ''}`} onClick={() => update('rank', r)}>{r}</button>
                ))}
              </div>
            </EditField>

            <EditField label="군종">
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {['육군','해군','공군','해병'].map(b => (
                  <button key={b} className={`chip ${form.branch === b ? 'active' : ''}`} onClick={() => update('branch', b)}>{b}</button>
                ))}
              </div>
            </EditField>

            <EditField label="소속 부대">
              <input className="input" value={form.unit} onChange={e => update('unit', e.target.value)} style={fieldInputStyle}/>
            </EditField>

            <EditField label="입대일">
              <input type="date" value={form.enlistedAt} onChange={e => update('enlistedAt', e.target.value)} style={fieldInputStyle}/>
            </EditField>

            <EditField label="전역 예정일">
              <input type="date" value={form.dischargeAt} onChange={e => update('dischargeAt', e.target.value)} style={fieldInputStyle}/>
            </EditField>

            <button className="btn btn-primary btn-full" style={{ height: 52, marginTop: 4, opacity: saved ? 0.7 : 1 }} onClick={handleSave}>
              {saved ? '✓ 저장됨' : '저장'}
            </button>
          </div>
        )}

        {tab === 'interests' && (
          <div>
            <div style={{ marginBottom: 16, padding: '10px 14px', background: 'var(--accent-soft)', border: '1px solid var(--accent)', borderRadius: 10, display: 'flex', gap: 10 }}>
              <IconSparkle size={18} style={{ color: 'var(--accent)', flexShrink: 0, marginTop: 1 }}/>
              <div style={{ fontSize: 13, color: 'var(--text-base)', lineHeight: 1.5 }}>
                관심 분야를 업데이트하면 AI가 맞춤 로드맵을 재생성합니다.
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 24 }}>
              {interestList.map(it => {
                const on = interests.includes(it.id);
                return (
                  <button key={it.id} onClick={() => toggleInterest(it.id)} style={{
                    padding: '16px 14px', borderRadius: 10,
                    background: on ? 'var(--accent-soft)' : 'var(--bg-surface)',
                    border: on ? '1px solid var(--accent)' : '1px solid transparent',
                    color: 'var(--text-base)', textAlign: 'left',
                    fontWeight: 600, fontSize: 14,
                    display: 'flex', alignItems: 'center', gap: 10,
                  }}>
                    <span style={{ width: 10, height: 10, borderRadius: '50%', background: it.accent, flexShrink: 0 }}/>
                    <span style={{ flex: 1 }}>{it.label}</span>
                    {on && <Icon name="check" size={16} style={{ color: 'var(--accent)' }}/>}
                  </button>
                );
              })}
            </div>
            <button className="btn btn-primary btn-full" style={{ height: 52 }} onClick={() => { setSaved(true); setTimeout(back, 900); }}>
              {saved ? '✓ 저장됨' : '저장 & 로드맵 재생성'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const fieldInputStyle = {
  width: '100%', height: 48,
  background: 'var(--bg-surface)',
  border: '1px solid var(--border-default)',
  borderRadius: 8, padding: '0 14px',
  fontSize: 15, color: 'var(--text-base)',
  outline: 'none', fontFamily: 'inherit',
};

function EditField({ label, children }) {
  return (
    <div>
      <div className="t-caption" style={{ marginBottom: 8 }}>{label}</div>
      {children}
    </div>
  );
}

Object.assign(window, { ProfileEditPage });
