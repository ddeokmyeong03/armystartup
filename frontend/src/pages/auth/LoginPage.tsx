import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiLogin } from '../../shared/api/index';

const inputSt: React.CSSProperties = {
  background: 'var(--bg-surface)', border: '1px solid var(--border-default)',
  borderRadius: 10, height: 52, fontSize: 16,
};

// 소셜 로그인 버튼 색상/텍스트
const SOCIAL = [
  { id: 'google', label: 'Google로 계속하기', bg: '#fff', color: '#1f1f1f', border: '#dadce0', logo: (
    <svg width="18" height="18" viewBox="0 0 18 18"><path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z"/><path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.859-3.048.859-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z"/><path fill="#FBBC05" d="M3.964 10.706A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.038l3.007-2.332Z"/><path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.962L3.964 6.294C4.672 4.169 6.656 3.58 9 3.58Z"/></svg>
  )},
  { id: 'kakao', label: '카카오로 계속하기', bg: '#FEE500', color: '#191919', border: '#FEE500', logo: (
    <svg width="18" height="18" viewBox="0 0 18 18"><path fill="#191919" d="M9 1.5C4.858 1.5 1.5 4.134 1.5 7.385c0 2.076 1.348 3.899 3.387 4.951L4.08 15.3a.188.188 0 0 0 .285.208l3.6-2.39A9.62 9.62 0 0 0 9 13.27c4.142 0 7.5-2.634 7.5-5.885C16.5 4.134 13.142 1.5 9 1.5Z"/></svg>
  )},
  { id: 'naver', label: '네이버로 계속하기', bg: '#03C75A', color: '#fff', border: '#03C75A', logo: (
    <svg width="18" height="18" viewBox="0 0 18 18"><path fill="#fff" d="M10.215 9.27 7.5 5.25H5.25v7.5H7.785V8.73L10.5 12.75H12.75V5.25H10.215z"/></svg>
  )},
  { id: 'apple', label: 'Apple로 계속하기', bg: '#000', color: '#fff', border: '#000', logo: (
    <svg width="18" height="18" viewBox="0 0 18 18"><path fill="currentColor" d="M12.438 0c.07.93-.27 1.87-.78 2.57-.53.72-1.37 1.28-2.21 1.21-.09-.92.31-1.87.81-2.51C10.8.55 11.7.02 12.438 0ZM15.5 13.07c-.35.78-.52 1.12-.97 1.79-.63.96-1.52 2.14-2.62 2.15-.98.01-1.23-.63-2.56-.62-1.32.01-1.61.64-2.59.63-1.1-.01-1.93-1.08-2.56-2.04C2.21 12.37 1.8 9.34 2.9 7.43c.78-1.35 2.12-2.14 3.39-2.14 1.26 0 2.05.63 3.09.63.99 0 1.6-.63 3.03-.63 1.14 0 2.33.62 3.11 1.7-2.73 1.47-2.29 5.31.48 6.08Z"/></svg>
  )},
] as const;

export default function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const up = (k: 'email' | 'password', v: string) => setForm(f => ({ ...f, [k]: v }));

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

  const handleSocial = (provider: string) => {
    const apiBase = import.meta.env.VITE_API_BASE_URL ?? '';
    window.location.href = `${apiBase}/api/auth/${provider}`;
  };

  return (
    <div className="auth-page">
      <div style={{
        position: 'fixed', top: -120, left: '50%', transform: 'translateX(-50%)',
        width: 520, height: 520, borderRadius: '50%',
        background: 'radial-gradient(circle, var(--accent-soft) 0%, transparent 60%)',
        pointerEvents: 'none',
      }} />

      <div style={{ padding: '24px 24px 60px', position: 'relative', maxWidth: 480, margin: '0 auto' }}>
        {/* 로고 + 헤드라인 */}
        <div style={{ marginTop: 56, marginBottom: 40 }}>
          <img src="/millog-icon.png" alt="Millog" style={{ width: 48, height: 48, borderRadius: 12 }} />
          <div className="t-display" style={{ marginTop: 28, fontSize: 30 }}>
            복무의 시간을<br /><span style={{ color: 'var(--accent)' }}>성장의 시간</span>으로.
          </div>
          <div className="t-subdued" style={{ marginTop: 10, fontSize: 14 }}>
            가용시간을 계산하고, 목표를 세우고, 로드맵을 따라가세요.
          </div>
        </div>

        {/* 오류 */}
        {error && (
          <div style={{
            marginBottom: 12, padding: '10px 14px',
            background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.4)',
            borderRadius: 8, color: '#ff8888', fontSize: 13,
          }}>{error}</div>
        )}

        {/* 이메일 / 비밀번호 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input
            className="input"
            type="email"
            placeholder="이메일 주소"
            value={form.email}
            onChange={e => up('email', e.target.value)}
            style={inputSt}
            autoComplete="email"
          />
          <input
            className="input"
            type="password"
            placeholder="비밀번호"
            value={form.password}
            onChange={e => up('password', e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            style={inputSt}
            autoComplete="current-password"
          />
        </div>

        {/* 비밀번호 찾기 */}
        <div style={{ textAlign: 'right', marginTop: 8, marginBottom: 20 }}>
          <button
            onClick={() => navigate('/forgot-password')}
            style={{ fontSize: 13, color: 'var(--text-subdued)', cursor: 'pointer', background: 'none' }}
          >비밀번호 찾기</button>
        </div>

        <button
          className="btn btn-primary btn-full"
          style={{ height: 52, fontSize: 15 }}
          onClick={handleLogin}
          disabled={loading}
        >{loading ? '로그인 중...' : '로그인'}</button>

        {/* 소셜 로그인 구분선 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '28px 0 20px' }}>
          <div style={{ flex: 1, height: 1, background: 'var(--border-default)' }} />
          <span className="t-caption">또는</span>
          <div style={{ flex: 1, height: 1, background: 'var(--border-default)' }} />
        </div>

        {/* 소셜 버튼 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {SOCIAL.map(s => (
            <button
              key={s.id}
              onClick={() => handleSocial(s.id)}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: 10, height: 48, borderRadius: 10,
                background: s.bg, color: s.color,
                border: `1px solid ${s.border}`,
                fontWeight: 600, fontSize: 14, cursor: 'pointer',
                transition: 'opacity 150ms',
              }}
            >
              {s.logo}
              {s.label}
            </button>
          ))}
        </div>

        {/* 회원가입 */}
        <div style={{ marginTop: 32, textAlign: 'center', fontSize: 14, color: 'var(--text-subdued)' }}>
          아직 계정이 없으신가요?{' '}
          <button
            onClick={() => navigate('/signup')}
            style={{ color: 'var(--accent)', fontWeight: 700, background: 'none', cursor: 'pointer', fontSize: 14 }}
          >회원가입</button>
        </div>
      </div>
    </div>
  );
}
