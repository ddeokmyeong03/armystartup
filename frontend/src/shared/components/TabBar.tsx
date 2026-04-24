import { useNavigate, useLocation } from 'react-router-dom';
import { Icon, IconGoal, IconMap, IconBook, IconUser } from './Icon';

export default function TabBar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const items = [
    { path: '/',         label: '홈',    icon: <Icon name="home-filled" size={22}/> },
    { path: '/goals',    label: '목표',  icon: <IconGoal size={22}/> },
    { path: '/roadmap',  label: '로드맵', icon: <IconMap size={22}/> },
    { path: '/courses',  label: '강의',  icon: <IconBook size={22}/> },
    { path: '/profile',  label: '프로필', icon: <IconUser size={22}/> },
  ];

  const active = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  return (
    <div className="tab-bar">
      {items.map(it => (
        <button
          key={it.path}
          className={`tab-item ${active(it.path) ? 'active' : ''}`}
          onClick={() => navigate(it.path)}
        >
          {it.icon}
          <div className="tab-label">{it.label}</div>
          <div className="tab-dot"/>
        </button>
      ))}
    </div>
  );
}
