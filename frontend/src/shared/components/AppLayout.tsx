import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '../hooks/useIsMobile';
import DesktopSidebar from './DesktopSidebar';
import { MillogLogo, Icon } from './Icon';
import { getNickname } from '../lib/auth';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const nickname = getNickname();

  if (isMobile) return <>{children}</>;

  return (
    <div className="desktop-layout">
      <header className="desktop-topbar">
        <button
          style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'none', cursor: 'pointer' }}
          onClick={() => navigate('/')}
        >
          <MillogLogo size={28} />
          <span className="desktop-topbar-title">Millog</span>
        </button>
        <div style={{ flex: 1 }} />
        <button
          className="desktop-user-chip"
          onClick={() => navigate('/notifications')}
          style={{ marginRight: 8 }}
          title="알림"
        >
          <Icon name="bell" size={16} />
        </button>
        <button className="desktop-user-chip" onClick={() => navigate('/profile')}>
          {nickname}
        </button>
      </header>
      <div className="desktop-body">
        <DesktopSidebar />
        <main className="desktop-content">
          {children}
        </main>
      </div>
    </div>
  );
}
