import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiUpdateProfile } from '../../shared/api/index';
import { MillogLogo } from '../../shared/components/Icon';

export default function OnboardingGoalPage() {
  const navigate = useNavigate();
  const [goal, setGoal] = useState('');
  const [loading, setLoading] = useState(false);

  const handleNext = async () => {
    if (!goal.trim()) return;
    setLoading(true);
    try {
      await apiUpdateProfile({ goal: goal.trim() });
      navigate('/onboarding/profile');
    } catch {
      // 프로필이 없을 수 있어 오류 무시하고 진행
      navigate('/onboarding/profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page" style={{ display: 'flex', flexDirection: 'column', minHeight: '100%', padding: '48px 24px 32px' }}>
      <div style={{ marginBottom: 40 }}>
        <MillogLogo size={32}/>
      </div>

      <div style={{ flex: 1 }}>
        <div className="signup-step-tag">01 / 02 · 목표</div>
        <div className="signup-step-title">군 생활 중<br/>이루고 싶은 목표가<br/>무엇인가요?</div>
        <div className="signup-step-sub">측정 가능하게 구체적으로 적어주세요.<br/>예: "TOEIC 900점 달성", "정보처리기사 취득"</div>

        <textarea
          className="input signup-input"
          style={{ height: 'auto', minHeight: 120, resize: 'none', paddingTop: 14, paddingBottom: 14, borderRadius: 12 }}
          placeholder="예: 자격증 2개 취득하고 전역하기"
          value={goal}
          onChange={e => setGoal(e.target.value)}
          maxLength={100}
          rows={4}
        />
        <div style={{ textAlign: 'right', fontSize: 12, color: 'var(--text-tertiary)', marginTop: 6 }}>{goal.length}/100</div>
      </div>

      <button
        className="btn btn-primary btn-full signup-next-btn"
        style={{ borderRadius: 12 }}
        onClick={handleNext}
        disabled={!goal.trim() || loading}
      >
        다음
      </button>
    </div>
  );
}
