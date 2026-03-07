import { useNavigate, useLocation } from 'react-router-dom';

type NavItem = {
  path: string;
  label: string;
  icon: (active: boolean) => React.ReactNode;
};

const navItems: NavItem[] = [
  {
    path: '/',
    label: '홈',
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
        stroke={active ? '#111111' : '#8E8E93'} strokeWidth={active ? 2.2 : 1.8}>
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    path: '/today',
    label: '오늘',
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
        stroke={active ? '#111111' : '#8E8E93'} strokeWidth={active ? 2.2 : 1.8}>
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
        <circle cx="12" cy="16" r="1.5" fill={active ? '#111111' : '#8E8E93'} stroke="none" />
      </svg>
    ),
  },
  {
    path: '/goals',
    label: '목표',
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
        stroke={active ? '#111111' : '#8E8E93'} strokeWidth={active ? 2.2 : 1.8}>
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="6" />
        <circle cx="12" cy="12" r="2" fill={active ? '#111111' : '#8E8E93'} stroke="none" />
      </svg>
    ),
  },
  {
    path: '/ai',
    label: 'AI',
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
        stroke={active ? '#111111' : '#8E8E93'} strokeWidth={active ? 2.2 : 1.8}>
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
        <line x1="12" y1="17" x2="12.01" y2="17" strokeWidth="3" strokeLinecap="round" />
        <circle cx="12" cy="12" r="10" />
      </svg>
    ),
  },
  {
    path: '/profile',
    label: '내 정보',
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
        stroke={active ? '#111111' : '#8E8E93'} strokeWidth={active ? 2.2 : 1.8}>
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
];

export default function BottomNavBar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#EFEFEF] flex items-center justify-around px-2 pb-safe h-[60px] z-50">
      {navItems.map((item) => {
        const active = pathname === item.path;
        return (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className="flex flex-col items-center gap-0.5 flex-1 h-full justify-center"
          >
            {item.icon(active)}
            <span
              className={`text-[10px] font-medium ${active ? 'text-[#111111]' : 'text-[#8E8E93]'}`}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
