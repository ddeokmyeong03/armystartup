import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconArrowLeft, IconChevronRight } from '../../shared/components/Icon';

function Toggle({ label, sub, value, onChange, disabled }: {
  label: string; sub?: string; value: boolean; onChange: () => void; disabled?: boolean;
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 0', borderBottom: '1px solid var(--border)', opacity: disabled ? 0.45 : 1 }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 15, fontWeight: 500, color: 'var(--text-primary)' }}>{label}</div>
        {sub && <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>{sub}</div>}
      </div>
      <button
        onClick={disabled ? undefined : onChange}
        aria-label={label}
        style={{
          width: 48, height: 28, borderRadius: 14, flexShrink: 0, padding: 0, overflow: 'hidden', cursor: disabled ? 'default' : 'pointer',
          background: (value && !disabled) ? 'var(--brand-500)' : 'var(--gray-200)',
          position: 'relative', transition: 'background 200ms ease-out',
        }}
      >
        <div style={{
          position: 'absolute', top: 3, left: (value && !disabled) ? 23 : 3,
          width: 22, height: 22, borderRadius: '50%', background: '#fff',
          boxShadow: '0 1px 3px rgba(0,0,0,0.2)', transition: 'left 200ms cubic-bezier(.2,.8,.2,1)',
        }}/>
      </button>
    </div>
  );
}

function NavItem({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} style={{ width: '100%', display: 'flex', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid var(--border)', textAlign: 'left' }}>
      <span style={{ flex: 1, fontSize: 15, fontWeight: 500, color: 'var(--text-primary)' }}>{label}</span>
      <IconChevronRight size={18} style={{ color: 'var(--text-tertiary)' }}/>
    </button>
  );
}

export default function SettingsPage() {
  const navigate = useNavigate();
  const [notif, setNotif] = useState({ push: true, challenge: true, record: true });

  return (
    <div className="page page-enter">
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '16px 20px', flexShrink: 0, borderBottom: '1px solid var(--border)' }}>
        <button onClick={() => navigate(-1)} style={{ padding: 4 }} aria-label="뒤로">
          <IconArrowLeft size={22} style={{ color: 'var(--text-primary)' }}/>
        </button>
        <div className="t-h2" style={{ flex: 1 }}>설정</div>
      </div>

      <div className="scroll-area" style={{ padding: '16px 20px 24px' }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-tertiary)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.08em' }}>알림</div>
        <Toggle label="푸시 알림" sub="모든 앱 알림 허용" value={notif.push} onChange={() => setNotif(s => ({ ...s, push: !s.push }))}/>
        <Toggle label="챌린지 알림" sub="판정 결과·마감 알림" value={notif.push && notif.challenge} onChange={() => setNotif(s => ({ ...s, challenge: !s.challenge }))} disabled={!notif.push}/>
        <Toggle label="기록 리마인더" sub="매일 기록 알림" value={notif.push && notif.record} onChange={() => setNotif(s => ({ ...s, record: !s.record }))} disabled={!notif.push}/>

        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-tertiary)', margin: '24px 0 4px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>보안</div>
        <NavItem label="비밀번호 변경" onClick={() => navigate('/my/settings/password')}/>

        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-tertiary)', margin: '24px 0 4px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>정보</div>
        <NavItem label="개인정보 처리방침" onClick={() => {}}/>
        <NavItem label="서비스 이용약관" onClick={() => {}}/>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid var(--border)' }}>
          <span style={{ fontSize: 15, color: 'var(--text-primary)' }}>버전</span>
          <span style={{ fontSize: 14, color: 'var(--text-tertiary)' }}>2.0.0</span>
        </div>
      </div>
    </div>
  );
}
