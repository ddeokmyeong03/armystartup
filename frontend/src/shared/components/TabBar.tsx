import { useNavigate, useLocation } from 'react-router-dom';
import { IconHome, IconRecord, IconChallenge, IconUser } from './Icon';

export default function TabBar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const items = [
    { path: '/home',       label: '홈',     icon: <IconHome size={24}/> },
    { path: '/records',    label: '기록',   icon: <IconRecord size={24}/> },
    { path: '/challenges', label: '챌린지', icon: <IconChallenge size={24}/> },
    { path: '/my',         label: '마이',   icon: <IconUser size={24}/> },
  ];

  const active = (path: string) => {
    if (path === '/home') return pathname === '/home';
    return pathname.startsWith(path);
  };

  return (
    <div className="tab-bar">
      {items.map(it => (
        <button
          key={it.path}
          className={`tab-item ${active(it.path) ? 'active' : ''}`}
          onClick={() => navigate(it.path)}
          aria-label={it.label}
        >
          {it.icon}
          <div className="tab-label">{it.label}</div>
        </button>
      ))}
    </div>
  );
}
