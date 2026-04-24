import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MillogLogo, Icon } from '../../shared/components/Icon';
import { apiLogin, apiSignup } from '../../shared/api/index';

const INTERESTS = [
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
  background: 'var(--bg-surface)', border: '1px solid var(--border-default)', borderRadius: 8,
};

export default function LoginPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    email: '', password: '', confirmPw: '', nickname: '',
    rank: '상병', branch: '육군', unit: '', enlistedAt: '',
  });
  const [interests, setInterests] = useState<string[]>(['cert', 'lang', 'it']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const up = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));
  const toggleInterest = (id: string) =>
    setInterests(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);

  const handleLogin = async () => {
    if (!form.email || !form.password) { setError('이메일과 비밀번호를 입력하세요.'); return; }
    setLoading(true); setError('');
    try {
      const data = await apiLogin(form.email, form.password);
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('nickname', data.user?.nickname ?? '');
      localStorage.setItem('userInfo', JSON.stringify(data.user ?? {}));
      navigate('/');
    } catch {
      setError('이메일 또는 비밀번호가 올바르지 않습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async () => {
    setLoading(true); setError('');
    try {
      await apiSignup({
        email: form.email, password: form.password, nickname: form.nickname,
        rankName: form.rank, branch: form.branch, unitName: form.unit,
        enlistedAt: form.enlistedAt || undefined,
      });
      const data = await apiLogin(form.email, form.password);
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('nickname', data.user?.nickname ?? '');
      localStorage.setItem('userInfo', JSON.stringify(data.user ?? {}));
      navigate('/');
    } catch {
      setError('회원가입에 실패했습니다. 이미 사용 중인 이메일일 수 있습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)', color: 'var(--text-base)', position: 'relative', overflowX: 'hidden' }}>
      <div style={{ position: 'fixed', top: -120, left: '50%', transform: 'translateX(-50%)', width: 520, height: 520, borderRadius: '50%', background: 'radial-gradient(circle, var(--accent-soft) 0%, transparent 60%)', pointerEvents: 'none' }}/>
      <div style={{ padding: '24px 24px 60px', position: 'relative', maxWidth: 480, margin: '0 auto' }}>
        <div style={{ marginTop: 48, marginBottom: 36 }}>
          <MillogLogo size={40}/>
          <div className="t-display" style={{ marginTop: 28, fontSize: 30 }}>
            복무의 시간을<br/><span style={{ color: 'var(--accent)' }}>성장의 시간</span>으로.
          </div>
          <div className="t-subdued" style={{ marginTop: 10, fontSize: 14 }}>
            가용시간을 계산하고, 목표를 세우고, 로드맵을 따라가세요.
          </div>
        </div>

        <div className="segmented" style={{ marginBottom: 24 }}>
          <button className={mode === 'login' ? 'active' : ''} onClick={() => { setMode('login'); setStep(0); setError(''); }}>로그인</button>
          <button className={mode === 'signup' ? 'active' : ''} onClick={() => { setMode('signup'); setStep(0); setError(''); }}>회원가입</button>
        </div>

        {error && <div style={{ marginBottom: 12, padding: '10px 14px', background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.4)', borderRadius: 8, color: '#ff8888', fontSize: 13 }}>{error}</div>}

        {mode === 'login' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div><div className="t-caption" style={{ marginBottom: 8 }}>이메일</div>
              <input className="input" type="email" placeholder="이메일 주소" value={form.email} onChange={e => up('email', e.target.value)} style={inputSt}/></div>
            <div><div className="t-caption" style={{ marginBottom: 8 }}>비밀번호</div>
              <input className="input" type="password" placeholder="비밀번호" value={form.password} onChange={e => up('password', e.target.value)} onKeyDown={e => e.key === 'Enter' && handleLogin()} style={inputSt}/></div>
            <button className="btn btn-primary btn-full" style={{ marginTop: 20, height: 52 }} onClick={handleLogin} disabled={loading}>
              {loading ? '로그인 중...' : '로그인'}
            </button>
          </div>
        )}

        {mode === 'signup' && (
          <div>
            <div style={{ display: 'flex', gap: 6, marginBottom: 20 }}>
              {[0,1,2].map(i => <div key={i} style={{ flex: 1, height: 3, borderRadius: 999, background: i <= step ? 'var(--accent)' : 'var(--border-default)' }}/>)}
            </div>

            {step === 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div className="t-section">계정 만들기</div>
                <div><div className="t-caption" style={{ marginBottom: 8 }}>이메일</div>
                  <input className="input" type="email" placeholder="이메일 주소" value={form.email} onChange={e => up('email', e.target.value)} style={inputSt}/></div>
                <div><div className="t-caption" style={{ marginBottom: 8 }}>비밀번호 (8자 이상)</div>
                  <input className="input" type="password" placeholder="비밀번호" value={form.password} onChange={e => up('password', e.target.value)} style={inputSt}/></div>
                <div><div className="t-caption" style={{ marginBottom: 8 }}>비밀번호 확인</div>
                  <input className="input" type="password" placeholder="비밀번호 다시 입력" value={form.confirmPw} onChange={e => up('confirmPw', e.target.value)} style={inputSt}/></div>
                <button className="btn btn-primary btn-full" style={{ marginTop: 8, height: 52 }} onClick={() => {
                  if (!form.email || form.password.length < 8) { setError('이메일과 8자 이상의 비밀번호를 입력하세요.'); return; }
                  if (form.password !== form.confirmPw) { setError('비밀번호가 일치하지 않습니다.'); return; }
                  setError(''); setStep(1);
                }}>다음</button>
              </div>
            )}

            {step === 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div className="t-section">복무 정보</div>
                <div><div className="t-caption" style={{ marginBottom: 8 }}>닉네임</div>
                  <input className="input" placeholder="닉네임" value={form.nickname} onChange={e => up('nickname', e.target.value)} style={inputSt}/></div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div><div className="t-caption" style={{ marginBottom: 8 }}>군종</div>
                    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                      {['육군','해군','공군','해병'].map(b => <button key={b} className={`chip ${form.branch === b ? 'active' : ''}`} onClick={() => up('branch', b)}>{b}</button>)}
                    </div>
                  </div>
                  <div><div className="t-caption" style={{ marginBottom: 8 }}>계급</div>
                    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                      {['이병','일병','상병','병장'].map(r => <button key={r} className={`chip ${form.rank === r ? 'active' : ''}`} onClick={() => up('rank', r)}>{r}</button>)}
                    </div>
                  </div>
                </div>
                <div><div className="t-caption" style={{ marginBottom: 8 }}>소속 부대 (선택)</div>
                  <input className="input" placeholder="예: 제00보병사단" value={form.unit} onChange={e => up('unit', e.target.value)} style={inputSt}/></div>
                <div><div className="t-caption" style={{ marginBottom: 8 }}>입대일 (선택)</div>
                  <input className="input" type="date" value={form.enlistedAt} onChange={e => up('enlistedAt', e.target.value)} style={inputSt}/></div>
                <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                  <button className="btn btn-ghost" style={{ flex: 1, height: 52 }} onClick={() => setStep(0)}>이전</button>
                  <button className="btn btn-primary" style={{ flex: 2, height: 52 }} onClick={() => { if (!form.nickname) { setError('닉네임을 입력하세요.'); return; } setError(''); setStep(2); }}>다음</button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                <div className="t-section">관심 분야 선택</div>
                <div className="t-subdued" style={{ marginTop: -8 }}>첫 로드맵을 만드는 데 활용됩니다.</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  {INTERESTS.map(it => {
                    const on = interests.includes(it.id);
                    return (
                      <button key={it.id} onClick={() => toggleInterest(it.id)} style={{
                        padding: '16px 14px', borderRadius: 10,
                        background: on ? 'var(--accent-soft)' : 'var(--bg-surface)',
                        border: on ? '1px solid var(--accent)' : '1px solid transparent',
                        color: 'var(--text-base)', textAlign: 'left', fontWeight: 600, fontSize: 14,
                        display: 'flex', alignItems: 'center', gap: 10,
                      }}>
                        <span style={{ width: 10, height: 10, borderRadius: '50%', background: it.accent }}/>
                        {it.label}
                        {on && <span style={{ marginLeft: 'auto', color: 'var(--accent)' }}><Icon name="check" size={18}/></span>}
                      </button>
                    );
                  })}
                </div>
                <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                  <button className="btn btn-ghost" style={{ flex: 1, height: 52 }} onClick={() => setStep(1)}>이전</button>
                  <button className="btn btn-primary" style={{ flex: 2, height: 52 }} onClick={handleSignup} disabled={loading}>
                    {loading ? '가입 중...' : '시작하기'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
