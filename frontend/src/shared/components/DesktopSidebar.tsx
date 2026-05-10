import { useNavigate, useLocation } from 'react-router-dom';
import { Icon, IconGoal, IconMap, IconBook, IconUser } from './Icon';

const NAV_ITEMS = [
  { path: '/home',    label: '홈',     icon: <Icon name="home-filled" size={20}/> },
  { path: '/goals',   label: '목표',   icon: <IconGoal size={20}/> },
  { path: '/roadmap', label: '로드맵', icon: <IconMap size={20}/> },
  { path: '/courses', label: '강의',   icon: <IconBook size={20}/> },
  { path: '/profile', label: '프로필', icon: <IconUser size={20}/> },
] as const;

export default function DesktopSidebar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const isActive = (path: string) =>
    path === '/home' ? pathname === '/home' : pathname.startsWith(path);

  return (
    <nav className="desktop-sidebar">
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
