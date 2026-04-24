import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../shared/components/PageHeader';
import { apiChangePassword } from '../../shared/api/index';

function strengthScore(pw: string) {
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Za-z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s;
}
function strengthColor(pw: string) {
  const s = strengthScore(pw);
  return s <= 1 ? '#ef4444' : s === 2 ? '#f59e0b' : s === 3 ? '#3b82f6' : 'var(--accent)';
}
function strengthLabel(pw: string) {
  const s = strengthScore(pw);
  return s <= 1 ? '취약' : s === 2 ? '보통' : s === 3 ? '강함' : '매우 강함';
}

function PwField({ label, value, onChange, placeholder, hint, hintOk }: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder: string; hint?: string | null; hintOk?: boolean;
}) {
  const [show, setShow] = useState(false);
  return (
    <div>
      <div className="t-caption" style={{ marginBottom: 8 }}>{label}</div>
      <div style={{ position: 'relative' }}>
        <input
          type={show ? 'text' : 'password'} value={value}
          onChange={e => onChange(e.target.value)} placeholder={placeholder}
          style={{
            width: '100%', height: 48, background: 'var(--bg-surface)',
            border: `1px solid ${hint && !hintOk ? '#ef4444' : hint && hintOk ? 'var(--accent)' : 'var(--border-default)'}`,
            borderRadius: 8, padding: '0 52px 0 14px',
            fontSize: 15, color: 'var(--text-base)', outline: 'none', fontFamily: 'inherit',
            transition: 'border-color 200ms',
          }}
        />
        <button onClick={() => setShow(s => !s)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-subdued)', fontSize: 12, fontWeight: 700 }}>
          {show ? '숨김' : '표시'}
        </button>
      </div>
      {hint && <div style={{ marginTop: 6, fontSize: 12, fontWeight: 600, color: hintOk ? 'var(--accent)' : '#ef4444' }}>{hint}</div>}
    </div>
  );
}

export default function ChangePasswordPage() {
  const navigate = useNavigate();
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const lenOk = next.length >= 8;
  const matchOk = next === confirm && confirm.length > 0;
  const valid = current.length > 0 && lenOk && matchOk;

  const handleChange = async () => {
    if (!valid) return;
    setLoading(true); setError('');
    try {
      await apiChangePassword(current, next);
      setDone(true);
    } catch {
      setError('현재 비밀번호가 올바르지 않거나 변경에 실패했습니다.');
    } finally { setLoading(false); }
  };

  if (done) {
    return (
      <div className="page page-enter" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'fixed', inset: 0 }}>
        <div style={{ textAlign: 'center', padding: '0 40px' }}>
          <div style={{ fontSize: 64, marginBottom: 20 }}>🔐</div>
          <div className="t-title">비밀번호 변경 완료</div>
          <div className="t-subdued" style={{ marginTop: 10, lineHeight: 1.6 }}>다음 로그인 시 새 비밀번호를 사용하세요.</div>
          <button className="btn btn-primary btn-full" style={{ marginTop: 36, height: 52 }} onClick={() => navigate(-1)}>확인</button>
        </div>
      </div>
    );
  }

  return (
    <div className="page page-enter" style={{ display: 'flex', flexDirection: 'column', position: 'fixed', inset: 0 }}>
      <div className="page-gradient"/>
      <div style={{ height: 8, flexShrink: 0 }}/>
      <PageHeader title="비밀번호 변경" showBack/>

      <div className="scroll-area" style={{ padding: '16px 20px 48px', position: 'relative', zIndex: 1 }}>
        <div style={{ marginBottom: 24, padding: '12px 14px', background: 'var(--bg-surface)', borderRadius: 12, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
          <span style={{ color: 'var(--accent)', flexShrink: 0, marginTop: 1, fontSize: 16 }}>🔒</span>
          <div style={{ fontSize: 13, color: 'var(--text-subdued)', lineHeight: 1.55 }}>
            8자 이상, 영문·숫자·특수문자를 조합하면 더 안전합니다.
          </div>
        </div>

        {error && (
          <div style={{ marginBottom: 16, padding: '10px 14px', background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.4)', borderRadius: 8, color: '#ff8888', fontSize: 13 }}>
            {error}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <PwField label="현재 비밀번호" value={current} onChange={setCurrent} placeholder="현재 비밀번호 입력"/>
          <div style={{ height: 1, background: 'var(--border-default)' }}/>
          <PwField
            label="새 비밀번호 (8자 이상)" value={next} onChange={setNext} placeholder="새 비밀번호"
            hint={next.length > 0 ? (lenOk ? '✓ 길이 충족' : `${8 - next.length}자 더 필요`) : null}
            hintOk={lenOk}
          />
          <PwField
            label="새 비밀번호 확인" value={confirm} onChange={setConfirm} placeholder="비밀번호 다시 입력"
            hint={confirm.length > 0 ? (matchOk ? '✓ 일치' : '비밀번호가 일치하지 않습니다') : null}
            hintOk={matchOk}
          />
        </div>

        {next.length > 0 && (
          <div style={{ marginTop: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <div className="t-caption">보안 강도</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: strengthColor(next) }}>{strengthLabel(next)}</div>
            </div>
            <div style={{ display: 'flex', gap: 4 }}>
              {[0,1,2,3].map(i => (
                <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: i < strengthScore(next) ? strengthColor(next) : 'var(--bg-surface-hi)', transition: 'background 300ms' }}/>
              ))}
            </div>
          </div>
        )}

        <button className="btn btn-primary btn-full" style={{ marginTop: 32, height: 52, opacity: valid ? 1 : 0.38, transition: 'opacity 200ms' }}
          onClick={handleChange} disabled={!valid || loading}>
          {loading ? '변경 중...' : '변경 완료'}
        </button>
      </div>
    </div>
  );
}
