import { useNavigate } from 'react-router-dom';

const FEATURES = [
  {
    emoji: '⏱️',
    title: '가용시간 자동 계산',
    desc: '당직·훈련·점호 일정을 입력하면 실제 공부 가능 시간을 자동으로 계산해줍니다.',
  },
  {
    emoji: '🗺️',
    title: 'AI 로드맵 생성',
    desc: '목표를 입력하면 Claude AI가 복무 기간에 맞는 맞춤 학습 로드맵을 만들어드립니다.',
  },
  {
    emoji: '🎯',
    title: '목표 관리',
    desc: '자격증·어학·취업 등 다양한 목표를 세우고 진행률을 한눈에 확인하세요.',
  },
  {
    emoji: '📚',
    title: '강의 추천',
    desc: '관심 분야와 가용시간에 맞는 강의를 추천받아 효율적으로 학습하세요.',
  },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="auth-page">
      {/* 배경 그라디언트 */}
      <div style={{
        position: 'fixed', top: -120, left: '50%', transform: 'translateX(-50%)',
        width: 600, height: 600, borderRadius: '50%',
        background: 'radial-gradient(circle, var(--accent-soft) 0%, transparent 65%)',
        pointerEvents: 'none', zIndex: 0,
      }} />

      <div style={{ maxWidth: 480, margin: '0 auto', padding: '0 24px 80px', position: 'relative', zIndex: 1 }}>

        {/* Hero */}
        <div style={{ paddingTop: 72, textAlign: 'center' }}>
          <img src="/millog-icon.png" alt="Millog" style={{ width: 72, height: 72, borderRadius: 18, marginBottom: 20 }} />
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent)', letterSpacing: 2, marginBottom: 16 }}>
            MILLOG
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 800, lineHeight: 1.25, margin: '0 0 16px', color: 'var(--text-bright)' }}>
            복무의 시간을<br />
            <span style={{ color: 'var(--accent)' }}>성장의 시간</span>으로.
          </h1>
          <p style={{ fontSize: 15, color: 'var(--text-subdued)', lineHeight: 1.65, margin: '0 0 36px' }}>
            군 복무 중에도 목표를 세우고,<br />AI 로드맵으로 체계적으로 성장하세요.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <button
              className="btn btn-primary btn-full"
              style={{ height: 54, fontSize: 16, fontWeight: 700 }}
              onClick={() => navigate('/signup', { state: { from: 'landing' } })}
            >
              무료로 시작하기
            </button>
            <button
              className="btn btn-ghost btn-full"
              style={{ height: 54, fontSize: 15 }}
              onClick={() => navigate('/login')}
            >
              이미 계정이 있어요
            </button>
          </div>
        </div>

        {/* 구분선 */}
        <div style={{ margin: '56px 0 40px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ flex: 1, height: 1, background: 'var(--border-default)' }} />
          <span style={{ fontSize: 12, color: 'var(--text-subdued)', fontWeight: 600 }}>밀로그가 하는 일</span>
          <div style={{ flex: 1, height: 1, background: 'var(--border-default)' }} />
        </div>

        {/* 기능 카드 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {FEATURES.map(f => (
            <div
              key={f.title}
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-default)',
                borderRadius: 16,
                padding: '20px 20px',
                display: 'flex',
                gap: 16,
                alignItems: 'flex-start',
              }}
            >
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: 'var(--accent-soft)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 22, flexShrink: 0,
              }}>
                {f.emoji}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4, color: 'var(--text-bright)' }}>
                  {f.title}
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-subdued)', lineHeight: 1.6 }}>
                  {f.desc}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 하단 CTA */}
        <div style={{
          marginTop: 48, padding: '28px 24px', borderRadius: 20,
          background: 'var(--accent-soft)', border: '1px solid var(--accent-border)',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 8, color: 'var(--text-bright)' }}>
            지금 바로 시작하세요
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-subdued)', marginBottom: 20 }}>
            가입 무료 · 광고 없음 · 언제든 탈퇴 가능
          </div>
          <button
            className="btn btn-primary btn-full"
            style={{ height: 50, fontWeight: 700 }}
            onClick={() => navigate('/signup', { state: { from: 'landing' } })}
          >
            Millog 시작하기
          </button>
        </div>
      </div>
    </div>
  );
}
