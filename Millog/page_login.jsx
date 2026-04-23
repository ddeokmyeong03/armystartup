// page_login.jsx — Login / Signup page
const LoginPage = () => {
  const { goto } = useNav();
  const [mode, setMode] = useState('login');
  const [step, setStep] = useState(0); // signup flow has 3 steps
  const [form, setForm] = useState({
    milId: '23-76000123',
    password: '••••••••',
    name: '진덕명',
    rank: '상병',
    branch: '육군',
    unit: '제00보병사단',
    enlist: '2024-10-03',
  });
  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const isSignup = mode === 'signup';

  return (
    <div className="page page-enter" style={{ background: 'var(--bg-base)' }}>
      {/* radial accent top */}
      <div style={{
        position: 'absolute', top: -120, left: '50%', transform: 'translateX(-50%)',
        width: 520, height: 520, borderRadius: '50%',
        background: 'radial-gradient(circle, var(--accent-soft) 0%, transparent 60%)',
        pointerEvents: 'none',
      }}/>

      <div className="scroll-area" style={{ padding: '24px 24px 40px', position: 'relative' }}>
        {/* Logo + tagline */}
        <div style={{ marginTop: 12, marginBottom: 36 }}>
          <MillogLogo size={40}/>
          <div className="t-display" style={{ marginTop: 28, fontSize: 30 }}>
            복무의 시간을<br/>
            <span style={{ color: 'var(--accent)' }}>성장의 시간</span>으로.
          </div>
          <div className="t-subdued" style={{ marginTop: 10, fontSize: 14 }}>
            가용시간을 계산하고, 목표를 세우고, 로드맵을 따라가세요.
          </div>
        </div>

        {/* Mode toggle */}
        <div className="segmented" style={{ marginBottom: 24 }}>
          <button className={mode === 'login' ? 'active' : ''} onClick={() => { setMode('login'); setStep(0); }}>로그인</button>
          <button className={mode === 'signup' ? 'active' : ''} onClick={() => { setMode('signup'); setStep(0); }}>회원가입</button>
        </div>

        {/* Login form */}
        {!isSignup && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <div className="t-caption" style={{ marginBottom: 8 }}>군 장병 통합 ID</div>
              <input className="input" value={form.milId} onChange={e => update('milId', e.target.value)} />
            </div>
            <div>
              <div className="t-caption" style={{ marginBottom: 8 }}>비밀번호</div>
              <input className="input" type="password" value={form.password} onChange={e => update('password', e.target.value)} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
              <label style={{ display: 'flex', gap: 8, alignItems: 'center', color: 'var(--text-subdued)', fontSize: 13 }}>
                <input type="checkbox" defaultChecked style={{ accentColor: 'var(--accent)' }}/>
                자동 로그인
              </label>
              <button style={{ color: 'var(--text-subdued)', fontSize: 13 }}>비밀번호 찾기</button>
            </div>
            <button className="btn btn-primary btn-full" style={{ marginTop: 20, height: 52 }} onClick={() => goto('home')}>
              로그인
            </button>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '24px 0 16px' }}>
              <div style={{ flex: 1, height: 1, background: 'var(--border-default)', opacity: 0.5 }}/>
              <div className="t-caption">또는 빠른 인증</div>
              <div style={{ flex: 1, height: 1, background: 'var(--border-default)', opacity: 0.5 }}/>
            </div>

            {/* SSO chips */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <button className="btn btn-dark" style={{ height: 48 }}>
                <span style={{ width: 20, height: 20, borderRadius: 4, background: '#fee500', color: '#000', fontWeight: 900, fontSize: 12, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>K</span>
                나라사랑
              </button>
              <button className="btn btn-dark" style={{ height: 48 }}>
                <span style={{ width: 20, height: 20, borderRadius: '50%', background: 'var(--accent)', color: '#001f12', fontWeight: 900, fontSize: 12, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>M</span>
                밀리패스
              </button>
            </div>
          </div>
        )}

        {/* Signup: 3 steps */}
        {isSignup && (
          <div>
            {/* Progress */}
            <div style={{ display: 'flex', gap: 6, marginBottom: 20 }}>
              {[0,1,2].map(i => (
                <div key={i} style={{ flex: 1, height: 3, borderRadius: 999, background: i <= step ? 'var(--accent)' : 'var(--border-default)' }}/>
              ))}
            </div>

            {step === 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div className="t-section">계정 만들기</div>
                <div className="t-subdued" style={{ marginTop: -6, marginBottom: 4 }}>나라사랑포털과 연동되는 계정을 만듭니다.</div>
                <div>
                  <div className="t-caption" style={{ marginBottom: 8 }}>군번</div>
                  <input className="input" value={form.milId} onChange={e => update('milId', e.target.value)} />
                </div>
                <div>
                  <div className="t-caption" style={{ marginBottom: 8 }}>비밀번호 (8자 이상)</div>
                  <input className="input" type="password" value={form.password} onChange={e => update('password', e.target.value)} />
                </div>
                <div>
                  <div className="t-caption" style={{ marginBottom: 8 }}>비밀번호 확인</div>
                  <input className="input" type="password" defaultValue="••••••••" />
                </div>
                <label style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginTop: 8, color: 'var(--text-subdued)', fontSize: 12, lineHeight: 1.5 }}>
                  <input type="checkbox" defaultChecked style={{ accentColor: 'var(--accent)', marginTop: 2 }}/>
                  <span>[필수] 서비스 이용약관 및 개인정보 수집·이용에 동의합니다.<br/>
                    <span style={{ color: 'var(--text-base)', opacity: 0.5 }}>[선택] 자기개발 지원사업 개선 목적의 데이터 수집 및 피드백 제공에 동의합니다.</span>
                  </span>
                </label>
                <button className="btn btn-primary btn-full" style={{ marginTop: 8, height: 52 }} onClick={() => setStep(1)}>
                  다음
                </button>
              </div>
            )}

            {step === 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div className="t-section">복무 정보</div>
                <div className="t-subdued" style={{ marginTop: -6, marginBottom: 4 }}>전역일 계산과 가용시간 분석에 사용됩니다.</div>
                <div>
                  <div className="t-caption" style={{ marginBottom: 8 }}>이름</div>
                  <input className="input" value={form.name} onChange={e => update('name', e.target.value)}/>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div>
                    <div className="t-caption" style={{ marginBottom: 8 }}>군종</div>
                    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                      {['육군','해군','공군','해병'].map(b => (
                        <button key={b} className={`chip ${form.branch === b ? 'active' : ''}`} onClick={() => update('branch', b)}>{b}</button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="t-caption" style={{ marginBottom: 8 }}>계급</div>
                    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                      {['이병','일병','상병','병장'].map(r => (
                        <button key={r} className={`chip ${form.rank === r ? 'active' : ''}`} onClick={() => update('rank', r)}>{r}</button>
                      ))}
                    </div>
                  </div>
                </div>
                <div>
                  <div className="t-caption" style={{ marginBottom: 8 }}>소속 부대</div>
                  <input className="input" value={form.unit} onChange={e => update('unit', e.target.value)}/>
                </div>
                <div>
                  <div className="t-caption" style={{ marginBottom: 8 }}>입대일</div>
                  <input className="input" type="date" value={form.enlist} onChange={e => update('enlist', e.target.value)}/>
                </div>
                <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                  <button className="btn btn-ghost" style={{ flex: 1, height: 52 }} onClick={() => setStep(0)}>이전</button>
                  <button className="btn btn-primary" style={{ flex: 2, height: 52 }} onClick={() => setStep(2)}>다음</button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                <div className="t-section">관심 분야 선택</div>
                <div className="t-subdued" style={{ marginTop: -8 }}>첫 로드맵을 만드는 데 활용됩니다.</div>
                <InterestPicker/>
                <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                  <button className="btn btn-ghost" style={{ flex: 1, height: 52 }} onClick={() => setStep(1)}>이전</button>
                  <button className="btn btn-primary" style={{ flex: 2, height: 52 }} onClick={() => goto('home')}>시작하기</button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

function InterestPicker() {
  const interests = [
    { id: 'cert', label: '자격증', accent: '#8b5cf6' },
    { id: 'lang', label: '어학', accent: '#f59e0b' },
    { id: 'job', label: '취업/진로', accent: '#10b981' },
    { id: 'hobby', label: '취미', accent: '#ef4444' },
    { id: 'read', label: '독서', accent: '#3b82f6' },
    { id: 'health', label: '체력', accent: '#06b6d4' },
    { id: 'finance', label: '금융/재테크', accent: '#22FFB2' },
    { id: 'it', label: '개발/IT', accent: '#a855f7' },
  ];
  const [picked, setPicked] = useState(['cert','lang','it']);
  const toggle = (id) => setPicked(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
      {interests.map(it => {
        const on = picked.includes(it.id);
        return (
          <button key={it.id} onClick={() => toggle(it.id)}
            style={{
              padding: '16px 14px',
              borderRadius: 10,
              background: on ? 'var(--accent-soft)' : 'var(--bg-surface)',
              border: on ? '1px solid var(--accent)' : '1px solid transparent',
              color: 'var(--text-base)',
              textAlign: 'left',
              fontWeight: 600,
              fontSize: 14,
              display: 'flex', alignItems: 'center', gap: 10,
            }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: it.accent }}/>
            {it.label}
            {on && <span style={{ marginLeft: 'auto', color: 'var(--accent)' }}><Icon name="check" size={18}/></span>}
          </button>
        );
      })}
    </div>
  );
}

Object.assign(window, { LoginPage });
