import { useNavigate, useLocation } from 'react-router-dom';
import { IconHome, IconRecord, IconChallenge, IconUser } from './Icon';
import { MillogLogo } from './Icon';

const NAV_ITEMS = [
  { path: '/home',       label: '홈',     icon: <IconHome size={20}/> },
  { path: '/records',    label: '기록',   icon: <IconRecord size={20}/> },
  { path: '/challenges', label: '챌린지', icon: <IconChallenge size={20}/> },
  { path: '/my',         label: '마이',   icon: <IconUser size={20}/> },
] as const;

export default function DesktopSidebar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const isActive = (path: string) =>
    path === '/home' ? pathname === '/home' : pathname.startsWith(path);

  return (
    <nav className="desktop-sidebar">
      <div style={{ padding: '4px 14px 16px' }}>
        <MillogLogo size={22}/>
      </div>
      {NAV_ITEMS.map(item => (
        <button
          key={item.path}
          className={`desktop-nav-item${isActive(item.path) ? ' active' : ''}`}
          onClick={() => navigate(item.path)}
        >
          {item.icon}
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  );
}
