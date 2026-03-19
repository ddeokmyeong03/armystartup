import { useNavigate } from 'react-router-dom';
import BottomNavBar from '../../shared/ui/BottomNavBar';

type Notification = {
  id: number;
  type: 'schedule' | 'goal' | 'course' | 'system';
  title: string;
  body: string;
  time: string;
  read: boolean;
};

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 1,
    type: 'course',
    title: 'AI 추천 강의 도착',
    body: '장병e음 토익 집중과정이 추천되었어요. 오늘 60분 여유가 있어요!',
    time: '방금 전',
    read: false,
  },
  {
    id: 2,
    type: 'goal',
    title: '목표 달성 현황',
    body: '이번 주 학습 목표의 80%를 달성했어요. 조금만 더 힘내세요!',
    time: '1시간 전',
    read: false,
  },
  {
    id: 3,
    type: 'schedule',
    title: '일정 알림',
    body: '오늘 오후 2시 훈련 일정이 있습니다.',
    time: '오전 9:00',
    read: true,
  },
  {
    id: 4,
    type: 'system',
    title: 'Millog 업데이트',
    body: 'K-MOOC 강의 10건이 새로 추가되었어요.',
    time: '어제',
    read: true,
  },
];

const TYPE_ICON: Record<Notification['type'], React.ReactNode> = {
  course: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4A7BAF" strokeWidth="1.8">
      <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
    </svg>
  ),
  goal: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3D7A57" strokeWidth="1.8">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" fill="#3D7A57" stroke="none" />
    </svg>
  ),
  schedule: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D98E2F" strokeWidth="1.8">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  system: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8E8E93" strokeWidth="1.8">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  ),
};

const TYPE_BG: Record<Notification['type'], string> = {
  course: '#DCE8F8',
  goal: '#DDEEDF',
  schedule: '#FFF3E0',
  system: '#F0F0F0',
};

export default function NotificationsPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F8F8F6] flex flex-col">
      {/* 헤더 */}
      <div className="flex items-center gap-3 px-5 pt-12 pb-2">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 flex items-center justify-center"
          aria-label="뒤로가기"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#111111" strokeWidth="2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <h1 className="text-[17px] font-semibold text-[#111111]">알림</h1>
      </div>

      {/* 알림 목록 */}
      <div className="flex-1 overflow-y-auto px-5 py-3 pb-28 flex flex-col gap-2">
        {MOCK_NOTIFICATIONS.map((noti) => (
          <div
            key={noti.id}
            className={`flex items-start gap-3 bg-white rounded-[16px] px-4 py-4 ${
              !noti.read ? 'border-l-4 border-[#4A7BAF]' : ''
            }`}
          >
            {/* 아이콘 */}
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 mt-0.5"
              style={{ backgroundColor: TYPE_BG[noti.type] }}
            >
              {TYPE_ICON[noti.type]}
            </div>

            {/* 내용 */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <p className={`text-[13px] font-semibold ${noti.read ? 'text-[#8E8E93]' : 'text-[#111111]'}`}>
                  {noti.title}
                </p>
                <span className="text-[11px] text-[#C7C7CC] shrink-0">{noti.time}</span>
              </div>
              <p className="text-[12px] text-[#8E8E93] mt-1 leading-relaxed">{noti.body}</p>
            </div>
          </div>
        ))}

        {MOCK_NOTIFICATIONS.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center gap-2 py-20">
            <div className="w-12 h-12 rounded-full bg-[#EFEFEF] flex items-center justify-center mb-2">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#8E8E93" strokeWidth="1.8">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
            </div>
            <p className="text-[14px] text-[#8E8E93]">새로운 알림이 없습니다</p>
          </div>
        )}
      </div>

      <BottomNavBar />
    </div>
  );
}
