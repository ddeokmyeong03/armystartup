import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../shared/components/PageHeader';
import { Icon } from '../../shared/components/Icon';
import { logout } from '../../shared/lib/auth';

function SetGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div className="t-eyebrow" style={{ marginBottom: 10 }}>{label}</div>
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>{children}</div>
    </div>
  );
}

function SetToggle({ label, sub, value, onChange, disabled = false, last = false }: {
  label: string; sub?: string; value: boolean; onChange: () => void; disabled?: boolean; last?: boolean;
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', borderBottom: last ? 'none' : '1px solid var(--border-default)', opacity: disabled ? 0.42 : 1 }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-base)' }}>{label}</div>
        {sub && <div className="t-caption" style={{ marginTop: 2 }}>{sub}</div>}
      </div>
      <button onClick={disabled ? undefined : onChange} style={{
        width: 50, height: 28, borderRadius: 14, flexShrink: 0,
        background: (value && !disabled) ? 'var(--accent)' : 'var(--bg-surface-hi)',
        position: 'relative', transition: 'background 200ms ease-out',
        cursor: disabled ? 'default' : 'pointer',
      }}>
        <div style={{
          position: 'absolute', top: 3, left: (value && !disabled) ? 25 : 3,
          width: 22, height: 22, borderRadius: '50%',
          background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.28)',
          transition: 'left 200ms cubic-bezier(.2,.8,.2,1)',
        }}/>
      </button>
    </div>
  );
}

function SetLink({ label, onPress, last = false }: { label: string; onPress?: () => void; last?: boolean }) {
  return (
    <button onClick={onPress} style={{
      width: '100%', display: 'flex', alignItems: 'center', padding: '14px 16px',
      borderBottom: last ? 'none' : '1px solid var(--border-default)',
      textAlign: 'left', color: 'var(--text-base)',
    }}>
      <span style={{ flex: 1, fontSize: 14, fontWeight: 500 }}>{label}</span>
      <Icon name="chevron-right" size={16} style={{ color: 'var(--text-subdued)' }}/>
    </button>
  );
}

function SetInfo({ label, value, last = false }: { label: string; value: string; last?: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', padding: '14px 16px', borderBottom: last ? 'none' : '1px solid var(--border-default)' }}>
      <span style={{ flex: 1, fontSize: 14, fontWeight: 500, color: 'var(--text-base)' }}>{label}</span>
      <span style={{ fontSize: 13, color: 'var(--text-subdued)' }}>{value}</span>
    </div>
  );
}

export default function SettingsPage() {
  const navigate = useNavigate();
  const [notif, setNotif] = useState({ push: true, schedule: true, course: false, goalReminder: true });
  const [app, setApp] = useState({ autoLogin: true, dataShare: true });

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div className="page page-enter" style={{ display: 'flex', flexDirection: 'column', position: 'fixed', inset: 0 }}>
      <div className="page-gradient"/>
      <div style={{ height: 8, flexShrink: 0 }}/>
      <PageHeader title="설정" showBack/>

      <div className="scroll-area" style={{ padding: '8px 20px 48px', position: 'relative', zIndex: 1 }}>

        <SetGroup label="알림 설정">
          <SetToggle label="푸시 알림" sub="모든 앱 알림 허용" value={notif.push} onChange={() => setNotif(s => ({ ...s, push: !s.push }))}/>
          <SetToggle label="일정 알림" sub="근무 1시간 전 알림" value={notif.push && notif.schedule} onChange={() => setNotif(s => ({ ...s, schedule: !s.schedule }))} disabled={!notif.push}/>
          <SetToggle label="강의 추천 알림" sub="새 추천 강의 도착 시" value={notif.push && notif.course} onChange={() => setNotif(s => ({ ...s, course: !s.course }))} disabled={!notif.push}/>
          <SetToggle label="목표 리마인더" sub="주 1회 목표 진행 알림" value={notif.push && notif.goalReminder} onChange={() => setNotif(s => ({ ...s, goalReminder: !s.goalReminder }))} disabled={!notif.push} last/>
        </SetGroup>

        <SetGroup label="계정">
          <SetLink label="프로필 수정" onPress={() => navigate('/profile/edit', { state: { tab: 'profile' } })}/>
          <SetLink label="자기개발 설정 수정" onPress={() => navigate('/profile/edit', { state: { tab: 'interests' } })}/>
          <SetLink label="비밀번호 변경" onPress={() => navigate('/settings/password')}/>
          <SetToggle label="자동 로그인" value={app.autoLogin} onChange={() => setApp(s => ({ ...s, autoLogin: !s.autoLogin }))} last/>
        </SetGroup>

        <SetGroup label="개인정보 & 약관">
          <SetToggle label="데이터 및 피드백 공유" sub="서비스 개선에 사용됩니다" value={app.dataShare} onChange={() => setApp(s => ({ ...s, dataShare: !s.dataShare }))}/>
          <SetLink label="개인정보 처리방침"/>
          <SetLink label="서비스 이용약관" last/>
        </SetGroup>

        <SetGroup label="앱 정보">
          <SetInfo label="버전" value="2.0.0"/>
          <SetInfo label="빌드" value="2026.04.24" last/>
        </SetGroup>

        <div className="card" style={{ padding: 0, overflow: 'hidden', marginBottom: 8 }}>
          <button onClick={handleLogout} style={{ width: '100%', padding: '16px', textAlign: 'center', fontSize: 14, fontWeight: 700, color: '#ef4444' }}>
            로그아웃
          </button>
        </div>
      </div>
    </div>
  );
}
