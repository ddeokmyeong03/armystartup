import { useNavigate } from 'react-router-dom';

export default function OnboardingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#111111] flex flex-col">
      {/* 상단 영역 - 로고 & 일러스트 */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 pt-16 pb-8">
        {/* 로고 */}
        <div className="flex items-center gap-2 mb-12">
          <div className="w-10 h-10 rounded-[12px] bg-white flex items-center justify-center">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7l10 5 10-5-10-5z" fill="#111111" />
              <path d="M2 17l10 5 10-5" stroke="#111111" strokeWidth="2" strokeLinecap="round" />
              <path d="M2 12l10 5 10-5" stroke="#111111" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <span className="text-white text-2xl font-bold tracking-tight">Millog</span>
        </div>

        {/* 타이틀 */}
        <div className="text-center mb-6">
          <h1 className="text-white text-[28px] font-bold leading-snug mb-3">
            군 생활, 더 스마트하게
          </h1>
          <p className="text-[#8E8E93] text-[15px] leading-relaxed">
            병사 자기개발을 위한<br />AI 일정 관리 가이드
          </p>
        </div>

        {/* 기능 카드 */}
        <div className="w-full max-w-sm flex flex-col gap-3 mt-8">
          <FeatureCard
            icon={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            }
            title="일정 확인"
            desc="일과 시간, 근무, 취침 등 군 생활 일정을 한눈에"
          />
          <FeatureCard
            icon={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8v4l3 3" />
              </svg>
            }
            title="자기개발 시간 관리"
            desc="여가 시간을 분석해 최적의 자기개발 계획 추천"
          />
          <FeatureCard
            icon={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
                <circle cx="12" cy="12" r="10" />
              </svg>
            }
            title="AI 가이드"
            desc="피로도와 목표 기반으로 맞춤 조언을 제공하는 AI"
          />
        </div>
      </div>

      {/* 하단 버튼 영역 */}
      <div className="px-6 pb-12 flex flex-col gap-3">
        <button
          onClick={() => navigate('/signup')}
          className="w-full h-[52px] bg-white text-[#111111] rounded-[16px] text-[15px] font-semibold"
        >
          시작하기
        </button>
        <button
          onClick={() => navigate('/login')}
          className="w-full h-[52px] text-[#8E8E93] text-[14px] font-medium"
        >
          이미 계정이 있어요
        </button>
      </div>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex items-center gap-4 bg-white/5 rounded-[16px] px-4 py-3.5">
      <div className="w-9 h-9 rounded-[10px] bg-white/10 flex items-center justify-center text-white shrink-0">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-white text-[13px] font-semibold">{title}</p>
        <p className="text-[#8E8E93] text-[12px] mt-0.5 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}
