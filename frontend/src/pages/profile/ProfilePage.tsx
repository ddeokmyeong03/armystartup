import { useNavigate } from 'react-router-dom';
import { logout, getNickname } from '../../shared/lib/auth';
import Avatar from '../../shared/ui/Avatar';
import BottomNavBar from '../../shared/ui/BottomNavBar';

type MenuItem = {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  danger?: boolean;
};

export default function ProfilePage() {
  const navigate = useNavigate();
  const nickname = getNickname();

  function handleLogout() {
    if (confirm('로그아웃 하시겠어요?')) {
      logout();
      navigate('/onboarding', { replace: true });
    }
  }

  const menuItems: MenuItem[] = [
    {
      label: '알림 설정',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
      ),
      onClick: () => navigate('/notifications'),
    },
    {
      label: '일정 관리',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      ),
      onClick: () => navigate('/schedules/new'),
    },
    {
      label: '목표 관리',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="6" />
          <circle cx="12" cy="12" r="2" fill="currentColor" stroke="none" />
        </svg>
      ),
      onClick: () => navigate('/goals'),
    },
    {
      label: '친구',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
      onClick: () => navigate('/friends'),
    },
    {
      label: '설정',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      ),
      onClick: () => navigate('/settings'),
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8F8F6] flex flex-col">
      {/* 헤더 */}
      <div className="px-5 pt-12 pb-4">
        <h1 className="text-[20px] font-bold text-[#111111]">내 정보</h1>
      </div>

      {/* 프로필 카드 */}
      <div className="mx-5 mb-4 bg-white rounded-[20px] px-5 py-5 flex items-center gap-4">
        <Avatar size={56} alt={nickname} />
        <div className="flex-1 min-w-0">
          <p className="text-[17px] font-bold text-[#111111] truncate">{nickname}</p>
          <p className="text-[13px] text-[#8E8E93] mt-0.5">Millog 사용자</p>
        </div>
      </div>

      {/* 메뉴 목록 */}
      <div className="mx-5 bg-white rounded-[20px] overflow-hidden mb-4">
        {menuItems.map((item, idx) => (
          <button
            key={item.label}
            onClick={item.onClick}
            className={`w-full flex items-center gap-4 px-5 py-4 text-left ${
              idx < menuItems.length - 1 ? 'border-b border-[#F0F0F0]' : ''
            }`}
          >
            <div className={`${item.danger ? 'text-[#E05C5C]' : 'text-[#8E8E93]'}`}>
              {item.icon}
            </div>
            <span className={`text-[15px] font-medium ${item.danger ? 'text-[#E05C5C]' : 'text-[#111111]'}`}>
              {item.label}
            </span>
            <svg className="ml-auto" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C7C7CC" strokeWidth="2">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        ))}
      </div>

      {/* 로그아웃 */}
      <div className="mx-5">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-4 bg-white rounded-[20px] px-5 py-4 text-left"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#E05C5C" strokeWidth="1.8">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          <span className="text-[15px] font-medium text-[#E05C5C]">로그아웃</span>
        </button>
      </div>

      {/* 버전 정보 */}
      <p className="text-center text-[12px] text-[#C7C7CC] mt-6">Millog v1.0.0</p>

      <BottomNavBar />
    </div>
  );
}
