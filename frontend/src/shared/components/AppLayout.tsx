import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '../hooks/useIsMobile';
import DesktopSidebar from './DesktopSidebar';


export default function AppLayout({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  if (isMobile) return <>{children}</>;

  return (
    <div className="desktop-layout">
      <header className="desktop-topbar">
        <button
          style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'none', cursor: 'pointer' }}
          onClick={() => navigate('/home')}
        >
          <img src="/millog-icon.png" alt="Millog" style={{ width: 28, height: 28, borderRadius: 7 }} />
        </button>
        <div style={{ flex: 1 }} />
        <button
          className="desktop-user-chip"
          onClick={() => navigate('/notifications')}
          title="알림"
        >
          <span style={{ fontSize: 13 }}>알림</span>
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
