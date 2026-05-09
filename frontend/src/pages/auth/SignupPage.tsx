import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '../../shared/components/Icon';
import { apiLogin, apiSignup, apiUpsertProfile } from '../../shared/api/index';

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

const TOTAL_STEPS = 4;

interface FormState {
  email: string;
  password: string;
  confirmPw: string;
  nickname: string;
  rank: string;
  branch: string;
  unit: string;
  enlistedAt: string;
}

interface StepProps {
  form: FormState;
  up: (k: keyof FormState, v: string) => void;
  error: string;
  onNext: () => void;
}

function StepShell({
  step, total, onBack, children,
}: {
  step: number; total: number; onBack: () => void; children: React.ReactNode;
}) {
  return (
    <div className="signup-shell">
      <button className="signup-back-btn" onClick={onBack} aria-label="뒤로">
        <Icon name="chevron-left" size={24} />
      </button>
      <div className="signup-progress-bar">
        <div className="signup-progress-fill" style={{ width: `${(step / total) * 100}%` }} />
      </div>
      <div className="signup-body">{children}</div>
    </div>
  );
}

function ErrorMsg({ msg }: { msg: string }) {
  if (!msg) return null;
  return (
    <div style={{
      padding: '10px 14px', borderRadius: 8, fontSize: 13,
      background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.35)',
      color: '#ff8888', marginTop: 8,
    }}>{msg}</div>
  );
}

function Step1({ form, up, error, onNext }: StepProps) {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => { ref.current?.focus(); }, []);
  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
  return (
    <>
      <div className="signup-step-tag">1 / {TOTAL_STEPS}</div>
      <div className="signup-step-title">이메일을 입력해주세요</div>
      <div className="signup-step-sub">로그인과 알림에 사용됩니다</div>
      <input
        ref={ref}
        className="input signup-input"
        type="email"
        placeholder="example@email.com"
        value={form.email}
        onChange={e => up('email', e.target.value)}
        onKeyDown={e => e.key === 'Enter' && valid && onNext()}
        autoComplete="email"
      />
      <ErrorMsg msg={error} />
      <button
        className="btn btn-primary btn-full signup-next-btn"
        onClick={onNext}
        disabled={!valid}
      >다음</button>
    </>
  );
}

function Step2({ form, up, error, onNext }: StepProps) {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => { ref.current?.focus(); }, []);
  const valid = form.password.length >= 8 && form.password === form.confirmPw;
  return (
    <>
      <div className="signup-step-tag">2 / {TOTAL_STEPS}</div>
      <div className="signup-step-title">비밀번호를 설정해주세요</div>
      <div className="signup-step-sub">8자 이상으로 입력해주세요</div>
      <input
        ref={ref}
        className="input signup-input"
        type="password"
        placeholder="비밀번호 (8자 이상)"
        value={form.password}
        onChange={e => up('password', e.target.value)}
        autoComplete="new-password"
      />
      <input
        className="input signup-input"
        type="password"
        placeholder="비밀번호 확인"
        value={form.confirmPw}
        onChange={e => up('confirmPw', e.target.value)}
        onKeyDown={e => e.key === 'Enter' && valid && onNext()}
        autoComplete="new-password"
        style={{ marginTop: 10 }}
      />
      <ErrorMsg msg={error} />
      <button
        className="btn btn-primary btn-full signup-next-btn"
        onClick={onNext}
        disabled={!valid}
      >다음</button>
    </>
  );
}

function Step3({ form, up, error, onNext }: StepProps) {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => { ref.current?.focus(); }, []);
  return (
    <>
      <div className="signup-step-tag">3 / {TOTAL_STEPS}</div>
      <div className="signup-step-title">복무 정보를 알려주세요</div>
      <div className="signup-step-sub">닉네임은 서비스에서 표시될 이름입니다</div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 4 }}>
        <div>
          <div className="t-caption" style={{ marginBottom: 8 }}>닉네임 *</div>
          <input
            ref={ref}
            className="input signup-input"
            placeholder="닉네임"
            value={form.nickname}
            onChange={e => up('nickname', e.target.value)}
            autoComplete="nickname"
          />
        </div>

        <div>
          <div className="t-caption" style={{ marginBottom: 8 }}>군종</div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {['육군', '해군', '공군', '해병'].map(b => (
              <button
                key={b}
                className={`chip${form.branch === b ? ' active' : ''}`}
                onClick={() => up('branch', b)}
              >{b}</button>
            ))}
          </div>
        </div>

        <div>
          <div className="t-caption" style={{ marginBottom: 8 }}>계급</div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {['이병', '일병', '상병', '병장'].map(r => (
              <button
                key={r}
                className={`chip${form.rank === r ? ' active' : ''}`}
                onClick={() => up('rank', r)}
              >{r}</button>
            ))}
          </div>
        </div>

        <div>
          <div className="t-caption" style={{ marginBottom: 8 }}>소속 부대 (선택)</div>
          <input
            className="input signup-input"
            placeholder="예: 제00보병사단"
            value={form.unit}
            onChange={e => up('unit', e.target.value)}
          />
        </div>

        <div>
          <div className="t-caption" style={{ marginBottom: 8 }}>입대일 (선택)</div>
          <input
            className="input signup-input"
            type="date"
            value={form.enlistedAt}
            onChange={e => up('enlistedAt', e.target.value)}
          />
        </div>
      </div>

      <ErrorMsg msg={error} />
      <button
        className="btn btn-primary btn-full signup-next-btn"
        onClick={onNext}
        disabled={!form.nickname.trim()}
      >다음</button>
    </>
  );
}

function Step4({
  interests, toggle, loading, error, onSubmit,
}: {
  interests: string[];
  toggle: (id: string) => void;
  loading: boolean;
  error: string;
  onSubmit: () => void;
}) {
  return (
    <>
      <div className="signup-step-tag">4 / {TOTAL_STEPS}</div>
      <div className="signup-step-title">관심 분야를 골라주세요</div>
      <div className="signup-step-sub">AI 로드맵 생성에 활용됩니다 · 복수 선택 가능</div>

      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr',
        gap: 10, marginTop: 8,
      }}>
        {INTERESTS.map(it => {
          const on = interests.includes(it.id);
          return (
            <button
              key={it.id}
              onClick={() => toggle(it.id)}
              style={{
                padding: '16px 14px', borderRadius: 12,
                background: on ? 'var(--accent-soft)' : 'var(--bg-surface)',
                border: `1px solid ${on ? 'var(--accent)' : 'transparent'}`,
                color: 'var(--text-base)', textAlign: 'left',
                fontWeight: 600, fontSize: 14,
                display: 'flex', alignItems: 'center', gap: 10,
                transition: 'all 150ms ease-out',
              }}
            >
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: it.accent, flexShrink: 0 }} />
              {it.label}
              {on && <span style={{ marginLeft: 'auto', color: 'var(--accent)' }}><Icon name="check" size={16} /></span>}
            </button>
          );
        })}
      </div>

      <ErrorMsg msg={error} />
      <button
        className="btn btn-primary btn-full signup-next-btn"
        onClick={onSubmit}
        disabled={loading || interests.length === 0}
      >
        {loading ? '가입 중...' : '밀로그 시작하기'}
      </button>
    </>
  );
}

export default function SignupPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [dir, setDir] = useState<'forward' | 'back'>('forward');
  const [form, setForm] = useState<FormState>({
    email: '', password: '', confirmPw: '', nickname: '',
    rank: '상병', branch: '육군', unit: '', enlistedAt: '',
  });
  const [interests, setInterests] = useState<string[]>(['cert', 'lang', 'it']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const up = (k: keyof FormState, v: string) => setForm(f => ({ ...f, [k]: v }));
  const toggle = (id: string) =>
    setInterests(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);

  const goNext = (n: number) => { setDir('forward'); setError(''); setStep(n); };
  const goBack = (n: number) => { setDir('back'); setError(''); setStep(n); };

  const handleStep1 = () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError('올바른 이메일 주소를 입력하세요.');
      return;
    }
    goNext(2);
  };

  const handleStep2 = () => {
    if (form.password.length < 8) { setError('비밀번호는 8자 이상이어야 합니다.'); return; }
    if (form.password !== form.confirmPw) { setError('비밀번호가 일치하지 않습니다.'); return; }
    goNext(3);
  };

  const handleStep3 = () => {
    if (!form.nickname.trim()) { setError('닉네임을 입력하세요.'); return; }
    goNext(4);
  };

  const handleSignup = async () => {
    setLoading(true);
    setError('');
    try {
      await apiSignup({
        email: form.email,
        password: form.password,
        nickname: form.nickname,
        rankName: form.rank,
        branch: form.branch,
        unitName: form.unit || undefined,
        enlistedAt: form.enlistedAt || undefined,
      });
      const data = await apiLogin(form.email, form.password);
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('nickname', data.user?.nickname ?? '');
      localStorage.setItem('userInfo', JSON.stringify(data.user ?? {}));
      // 관심사 저장
      try {
        await apiUpsertProfile({ interests: JSON.stringify(interests) });
      } catch { /* 실패해도 가입은 완료 */ }
      navigate('/');
    } catch {
      setError('회원가입에 실패했습니다. 이미 사용 중인 이메일일 수 있습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (step === 1) navigate('/login');
    else goBack(step - 1);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-base)',
      color: 'var(--text-base)',
      position: 'relative',
      overflowX: 'hidden',
    }}>
      {/* 배경 그라디언트 */}
      <div style={{
        position: 'fixed', top: -80, left: '50%', transform: 'translateX(-50%)',
        width: 400, height: 400, borderRadius: '50%',
        background: 'radial-gradient(circle, var(--accent-soft) 0%, transparent 60%)',
        pointerEvents: 'none',
      }} />

      {/* 뒤로 버튼 */}
      <button
        onClick={handleBack}
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

      {/* 진행 바 */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, height: 3,
        background: 'var(--bg-surface-hi)', zIndex: 10,
      }}>
        <div style={{
          height: '100%',
          width: `${(step / TOTAL_STEPS) * 100}%`,
          background: 'var(--accent)',
          borderRadius: '0 9999px 9999px 0',
          transition: 'width 400ms cubic-bezier(.2,.8,.2,1)',
        }} />
      </div>

      {/* 스텝 콘텐츠 */}
      <div
        key={step}
        style={{
          padding: '80px 24px 100px',
          maxWidth: 480,
          margin: '0 auto',
          position: 'relative',
          animation: `${dir === 'forward' ? 'stepSlideRight' : 'stepSlideLeft'} 280ms cubic-bezier(.2,.8,.2,1)`,
        }}
      >
        {step === 1 && (
          <Step1 form={form} up={up} error={error} onNext={handleStep1} />
        )}
        {step === 2 && (
          <Step2 form={form} up={up} error={error} onNext={handleStep2} />
        )}
        {step === 3 && (
          <Step3 form={form} up={up} error={error} onNext={handleStep3} />
        )}
        {step === 4 && (
          <Step4
            interests={interests}
            toggle={toggle}
            loading={loading}
            error={error}
            onSubmit={handleSignup}
          />
        )}
      </div>

      {/* 로그인으로 */}
      <div style={{
        position: 'fixed', bottom: 24, left: 0, right: 0,
        textAlign: 'center', fontSize: 13, color: 'var(--text-subdued)',
      }}>
        이미 계정이 있으신가요?{' '}
        <button
          onClick={() => navigate('/login')}
          style={{ color: 'var(--accent)', fontWeight: 700, background: 'none', cursor: 'pointer', fontSize: 13 }}
        >로그인</button>
      </div>
    </div>
  );
}
