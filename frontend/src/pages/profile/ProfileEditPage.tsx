import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PageHeader from '../../shared/components/PageHeader';
import { Icon, IconSparkle } from '../../shared/components/Icon';
import { apiGetMe, apiGetProfile, apiUpdateMe, apiUpsertProfile } from '../../shared/api/index';

const INTEREST_LIST = [
  { id: 'cert',    label: '자격증',     accent: '#8b5cf6' },
  { id: 'lang',    label: '어학',       accent: '#f59e0b' },
  { id: 'job',     label: '취업/진로',  accent: '#10b981' },
  { id: 'hobby',   label: '취미',       accent: '#ef4444' },
  { id: 'read',    label: '독서',       accent: '#3b82f6' },
  { id: 'health',  label: '체력',       accent: '#06b6d4' },
  { id: 'finance', label: '금융/재테크', accent: '#22FFB2' },
  { id: 'it',      label: '개발/IT',    accent: '#a855f7' },
];

const inputSt: React.CSSProperties = {
  width: '100%', height: 48, background: 'var(--bg-surface)',
  border: '1px solid var(--border-default)', borderRadius: 8,
  padding: '0 14px', fontSize: 15, color: 'var(--text-base)',
  outline: 'none', fontFamily: 'inherit',
};

function EditField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="t-caption" style={{ marginBottom: 8 }}>{label}</div>
      {children}
    </div>
  );
}

export default function ProfileEditPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const initTab = (location.state as any)?.tab ?? 'profile';
  const [tab, setTab] = useState<'profile' | 'interests'>(initTab);
  const [form, setForm] = useState({ nickname: '', rank: '상병', branch: '육군', unit: '', enlistedAt: '', dischargeDate: '' });
  const [interests, setInterests] = useState<string[]>([]);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    Promise.all([apiGetMe().catch(() => null), apiGetProfile().catch(() => null)])
      .then(([u, p]) => {
        setForm({
          nickname: u?.nickname ?? '',
          rank: p?.rankName ?? u?.rankName ?? '상병',
          branch: p?.branch ?? u?.branch ?? '육군',
          unit: p?.unitName ?? u?.unitName ?? '',
          enlistedAt: p?.enlistedAt ?? '',
          dischargeDate: p?.dischargeDate ?? '',
        });
        try { setInterests(JSON.parse(p?.interests ?? '[]')); } catch { setInterests([]); }
      });
  }, []);

  const update = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));
  const toggleInterest = (id: string) =>
    setInterests(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);

  const handleSave = async () => {
    setLoading(true);
    try {
      await apiUpdateMe({ nickname: form.nickname });
      await apiUpsertProfile({
        rankName: form.rank,
        branch: form.branch,
        unitName: form.unit || undefined,
        enlistedAt: form.enlistedAt || undefined,
        dischargeDate: form.dischargeDate || undefined,
        interests: JSON.stringify(interests),
      });
      localStorage.setItem('nickname', form.nickname);
      setSaved(true);
      setTimeout(() => navigate(-1), 900);
    } catch {} finally { setLoading(false); }
  };

  const initial = form.nickname[0] ?? '?';

  return (
    <div className="page page-enter" style={{ display: 'flex', flexDirection: 'column', position: 'fixed', inset: 0 }}>
      <div className="page-gradient"/>
      <div style={{ height: 8, flexShrink: 0 }}/>
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
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, padding: '8px 0 4px' }}>
              <div style={{
                width: 80, height: 80, borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--accent), #0ec98a)',
                color: '#001f12', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--font-title)', fontWeight: 800, fontSize: 30,
                boxShadow: '0 10px 30px -10px var(--accent-glow)',
              }}>{initial}</div>
            </div>

            <EditField label="닉네임">
              <input className="input" value={form.nickname} onChange={e => update('nickname', e.target.value)} style={inputSt}/>
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
              <input className="input" value={form.unit} onChange={e => update('unit', e.target.value)} placeholder="예: 제00보병사단" style={inputSt}/>
            </EditField>

            <EditField label="입대일">
              <input type="date" value={form.enlistedAt} onChange={e => update('enlistedAt', e.target.value)} style={inputSt}/>
            </EditField>

            <EditField label="전역 예정일">
              <input type="date" value={form.dischargeDate} onChange={e => update('dischargeDate', e.target.value)} style={inputSt}/>
            </EditField>

            <button className="btn btn-primary btn-full" style={{ height: 52, marginTop: 4, opacity: saved ? 0.7 : 1 }}
              onClick={handleSave} disabled={loading}>
              {saved ? '✓ 저장됨' : loading ? '저장 중...' : '저장'}
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
              {INTEREST_LIST.map(it => {
                const on = interests.includes(it.id);
                return (
                  <button key={it.id} onClick={() => toggleInterest(it.id)} style={{
                    padding: '16px 14px', borderRadius: 10,
                    background: on ? 'var(--accent-soft)' : 'var(--bg-surface)',
                    border: on ? '1px solid var(--accent)' : '1px solid transparent',
                    color: 'var(--text-base)', textAlign: 'left', fontWeight: 600, fontSize: 14,
                    display: 'flex', alignItems: 'center', gap: 10,
                  }}>
                    <span style={{ width: 10, height: 10, borderRadius: '50%', background: it.accent, flexShrink: 0 }}/>
                    <span style={{ flex: 1 }}>{it.label}</span>
                    {on && <Icon name="check" size={16} style={{ color: 'var(--accent)' }}/>}
                  </button>
                );
              })}
            </div>
            <button className="btn btn-primary btn-full" style={{ height: 52, opacity: saved ? 0.7 : 1 }}
              onClick={handleSave} disabled={loading}>
              {saved ? '✓ 저장됨' : loading ? '저장 중...' : '저장 & 로드맵 재생성'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
