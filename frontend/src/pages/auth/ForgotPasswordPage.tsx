import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '../../shared/components/Icon';
import { apiForgotPassword } from '../../shared/api/index';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('올바른 이메일 주소를 입력하세요.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await apiForgotPassword(email);
      setSent(true);
    } catch {
      setError('이메일 발송에 실패했습니다. 가입된 이메일인지 확인해주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg-base)',
      color: 'var(--text-base)', overflowX: 'hidden',
    }}>
      <div style={{
        position: 'fixed', top: -80, left: '50%', transform: 'translateX(-50%)',
        width: 400, height: 400, borderRadius: '50%',
        background: 'radial-gradient(circle, var(--accent-soft) 0%, transparent 60%)',
        pointerEvents: 'none',
      }} />

      <button
        onClick={() => navigate('/login')}
        style={{
          position: 'fixed', top: 16, left: 16, zIndex: 10,
          width: 40, height: 40, borderRadius: '50%',
          background: 'var(--bg-surface)', border: '1px solid var(--border-default)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--text-base)', cursor: 'pointer',
        }}
        aria-label="뒤로"
      >
        <Icon name="chevron-left" size={20} />
      </button>

      <div style={{ padding: '80px 24px 60px', maxWidth: 480, margin: '0 auto', position: 'relative' }}>
        {!sent ? (
          <>
            <div className="signup-step-tag">비밀번호 찾기</div>
            <div className="signup-step-title">가입한 이메일을<br />입력해주세요</div>
            <div className="signup-step-sub">비밀번호 재설정 링크를 보내드립니다</div>

            <input
              className="input signup-input"
              type="email"
              placeholder="이메일 주소"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              autoFocus
              autoComplete="email"
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
              disabled={loading || !email}
            >{loading ? '발송 중...' : '재설정 링크 보내기'}</button>
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
            <div className="t-title" style={{ marginBottom: 12 }}>이메일을 확인해주세요</div>
            <div className="t-subdued" style={{ lineHeight: 1.6, marginBottom: 32 }}>
              <strong style={{ color: 'var(--text-base)' }}>{email}</strong>으로<br />
              비밀번호 재설정 링크를 보냈습니다.<br />
              메일함을 확인해주세요. (스팸 폴더도 확인)
            </div>
            <button
              className="btn btn-ghost btn-full"
              style={{ height: 52 }}
              onClick={() => navigate('/login')}
            >로그인으로 돌아가기</button>
          </div>
        )}
      </div>
    </div>
  );
}
