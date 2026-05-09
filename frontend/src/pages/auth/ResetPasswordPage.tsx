import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Icon } from '../../shared/components/Icon';
import { apiResetPassword } from '../../shared/api/index';

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') ?? '';

  const [form, setForm] = useState({ password: '', confirmPw: '' });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (form.password.length < 8) { setError('비밀번호는 8자 이상이어야 합니다.'); return; }
    if (form.password !== form.confirmPw) { setError('비밀번호가 일치하지 않습니다.'); return; }
    if (!token) { setError('유효하지 않은 링크입니다. 다시 요청해주세요.'); return; }

    setLoading(true);
    setError('');
    try {
      await apiResetPassword(token, form.password);
      setDone(true);
    } catch {
      setError('링크가 만료되었거나 유효하지 않습니다. 다시 요청해주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div style={{
        position: 'fixed', top: -80, left: '50%', transform: 'translateX(-50%)',
        width: 400, height: 400, borderRadius: '50%',
        background: 'radial-gradient(circle, var(--accent-soft) 0%, transparent 60%)',
        pointerEvents: 'none',
      }} />

      <div style={{ padding: '80px 24px 60px', maxWidth: 480, margin: '0 auto', position: 'relative' }}>
        {!done ? (
          <>
            <div className="signup-step-tag">비밀번호 재설정</div>
            <div className="signup-step-title">새 비밀번호를<br />설정해주세요</div>
            <div className="signup-step-sub">8자 이상으로 입력해주세요</div>

            <input
              className="input signup-input"
              type="password"
              placeholder="새 비밀번호 (8자 이상)"
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              autoFocus
              autoComplete="new-password"
            />
            <input
              className="input signup-input"
              type="password"
              placeholder="비밀번호 확인"
              value={form.confirmPw}
              onChange={e => setForm(f => ({ ...f, confirmPw: e.target.value }))}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              autoComplete="new-password"
              style={{ marginTop: 10 }}
            />

            {error && (
              <div style={{
                padding: '10px 14px', borderRadius: 8, fontSize: 13, marginTop: 8,
                background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.35)',
                color: '#ff8888',
              }}>{error}</div>
            )}

            <button
              className="btn btn-primary btn-full signup-next-btn"
              onClick={handleSubmit}
              disabled={loading || !form.password || !form.confirmPw}
            >{loading ? '변경 중...' : '비밀번호 변경'}</button>
          </>
        ) : (
          <div style={{ textAlign: 'center', paddingTop: 40 }}>
            <div style={{
              width: 72, height: 72, borderRadius: '50%',
              background: 'var(--accent-soft)', border: '2px solid var(--accent)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 24px',
            }}>
              <Icon name="check" size={32} />
            </div>
            <div className="t-title" style={{ marginBottom: 12 }}>비밀번호 변경 완료</div>
            <div className="t-subdued" style={{ marginBottom: 32 }}>
              새 비밀번호로 로그인해주세요.
            </div>
            <button
              className="btn btn-primary btn-full"
              style={{ height: 52 }}
              onClick={() => navigate('/login')}
            >로그인하러 가기</button>
          </div>
        )}
      </div>
    </div>
  );
}
