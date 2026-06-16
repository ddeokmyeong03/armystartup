import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TabBar from '../../shared/components/TabBar';
import { IconChevronRight } from '../../shared/components/Icon';
import { apiGetHome, apiLogout } from '../../shared/api/index';

function dDay(dischargeDate?: string): number | null {
  if (!dischargeDate) return null;
  return Math.ceil((new Date(dischargeDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
}

function MenuItem({ label, onClick, danger }: { label: string; onClick: () => void; danger?: boolean }) {
  return (
    <button
      className="row"
      style={{ width: '100%', textAlign: 'left', background: 'transparent', borderRadius: 12, paddingLeft: 0, paddingRight: 0 }}
      onClick={onClick}
    >
      <div style={{ flex: 1, fontSize: 15, color: danger ? 'var(--danger)' : 'var(--text-primary)' }}>{label}</div>
      {!danger && <IconChevronRight size={18} style={{ color: 'var(--text-tertiary)' }}/>}
    </button>
  );
}

export default function MyPage() {
  const navigate = useNavigate();
  const [homeData, setHomeData] = useState<any>(null);

  useEffect(() => {
    apiGetHome().then(setHomeData).catch(() => {});
  }, []);

  const nickname = homeData?.nickname ?? localStorage.getItem('nickname') ?? '장병';
  const profile = homeData?.profile;
  const dDayNum = dDay(profile?.dischargeDate);

  const handleLogout = async () => {
    try { await apiLogout(); } catch { /* ignore */ }
    localStorage.clear();
    navigate('/', { replace: true });
  };

  return (
    <div className="page page-enter">
      <div style={{ padding: '16px 20px 0', flexShrink: 0 }}>
        <div className="t-h1">마이</div>
      </div>

      <div className="scroll-area" style={{ padding: '16px 20px 24px' }}>

        {/* 프로필 카드 */}
        <div className="card" style={{ marginBottom: 20, display: 'flex', gap: 16, alignItems: 'center' }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--brand-50)', color: 'var(--brand-700)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 20, border: '2px solid var(--brand-200)', flexShrink: 0 }}>
            {nickname[0]}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>{nickname}</div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>
              {[profile?.branch, profile?.rankName, profile?.unitName].filter(Boolean).join(' · ')}
            </div>
            {dDayNum != null && (
              <div style={{ marginTop: 4, fontSize: 13 }}>
                전역 <strong style={{ color: 'var(--brand-600)' }}>D-{dDayNum}</strong>
              </div>
            )}
          </div>
          <button
            style={{ fontSize: 13, fontWeight: 600, color: 'var(--brand-600)', flexShrink: 0 }}
            onClick={() => navigate('/my/profile')}
          >편집</button>
        </div>

        {/* 목표 */}
        {profile?.goal && (
          <div style={{ padding: '12px 16px', background: 'var(--brand-50)', borderRadius: 12, marginBottom: 20, borderLeft: '3px solid var(--brand-400)' }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--brand-600)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.08em' }}>나의 목표</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--brand-800)', wordBreak: 'keep-all' }}>{profile.goal}</div>
          </div>
        )}

        {/* 메뉴 리스트 */}
        <div className="card" style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-tertiary)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.08em' }}>계정</div>
          <MenuItem label="프로필 편집" onClick={() => navigate('/my/profile')}/>
          <MenuItem label="결제 내역" onClick={() => navigate('/my/payments')}/>
        </div>

        <div className="card" style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-tertiary)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.08em' }}>설정</div>
          <MenuItem label="알림 설정" onClick={() => navigate('/my/settings')}/>
          <MenuItem label="비밀번호 변경" onClick={() => navigate('/my/settings/password')}/>
        </div>

        <div className="card">
          <MenuItem label="로그아웃" onClick={handleLogout} danger/>
        </div>
      </div>

      <TabBar/>
    </div>
  );
}
