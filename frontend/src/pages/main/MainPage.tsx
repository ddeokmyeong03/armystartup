import { useNavigate } from 'react-router-dom';
import { useMainPageViewModel } from './useMainPageViewModel';
import TopChipBar from '../../widgets/main-calendar/TopChipBar';
import WeeklyCalendarSection from '../../widgets/weekly-calendar/WeeklyCalendarSection';
import SelectedDatePanel from '../../widgets/daily-plan-panel/SelectedDatePanel';
import AiGuideSection from '../../widgets/ai-guide/AiGuideSection';
import FriendActionSection from '../../widgets/friend/FriendActionSection';
import BottomNavBar from '../../shared/ui/BottomNavBar';
import Avatar from '../../shared/ui/Avatar';

export default function MainPage() {
  const navigate = useNavigate();
  const {
    user,
    chips,
    weeklyDays,
    weekLabel,
    selectedDate,
    selectedDateSchedules,
    selectedDateAiPlans,
    aiMessages,
    aiLoading,
    onPrevWeek,
    onNextWeek,
    onSelectDate,
    onSendAiMessage,
  } = useMainPageViewModel();

  return (
    <div className="min-h-screen bg-[#F8F8F6] flex flex-col">
      {/* 상단 고정 영역 */}
      <div className="bg-[#F8F8F6] pt-10">
        {/* 앱 로고 + 사용자 프로필 */}
        <div className="flex items-center justify-between px-5 py-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-[8px] bg-[#111111] flex items-center justify-center">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7l10 5 10-5-10-5z" fill="white" />
                <path d="M2 17l10 5 10-5" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M2 12l10 5 10-5" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </div>
            <span className="text-[17px] font-bold text-[#111111]">Millog</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[14px] font-medium text-[#111111]">{user.nickname}</span>
            <button onClick={() => navigate('/profile')} className="rounded-full overflow-hidden">
              <Avatar size={34} alt={user.nickname} src={user.avatarUrl} />
            </button>
          </div>
        </div>

        {/* 칩 바 */}
        <div className="pb-1">
          <TopChipBar chips={chips} />
        </div>

        {/* 주간 캘린더 */}
        <WeeklyCalendarSection
          days={weeklyDays}
          weekLabel={weekLabel}
          selectedDate={selectedDate}
          onSelectDate={onSelectDate}
          onPrevWeek={onPrevWeek}
          onNextWeek={onNextWeek}
          onAddSchedule={() => navigate('/schedules/new')}
        />

        <div className="h-px bg-[#EFEFEF] mx-5 mb-2" />
      </div>

      {/* 스크롤 영역 */}
      <div className="flex-1 overflow-y-auto pb-24">
        {/* 선택 날짜 일정 */}
        <SelectedDatePanel
          selectedDate={selectedDate}
          schedules={selectedDateSchedules}
          aiPlans={selectedDateAiPlans}
        />

        <div className="h-px bg-[#EFEFEF] mx-5 my-4" />

        {/* AI 가이드 섹션 */}
        <AiGuideSection
          messages={aiMessages}
          isLoading={aiLoading}
          onSend={onSendAiMessage}
        />

        {/* 친구 섹션 */}
        <FriendActionSection onGoFriends={() => navigate('/friends')} />
      </div>

      {/* 하단 내비게이션 */}
      <BottomNavBar />
    </div>
  );
}
