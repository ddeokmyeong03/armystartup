import { useMainPageViewModel } from './useMainPageViewModel';
import ProfileSummarySection from '../../widgets/profile-summary/ProfileSummarySection';
import TopChipBar from '../../widgets/main-calendar/TopChipBar';
import CalendarMonthHeader from '../../widgets/main-calendar/CalendarMonthHeader';
import CalendarWeekHeader from '../../widgets/main-calendar/CalendarWeekHeader';
import MonthlyCalendarGrid from '../../widgets/main-calendar/MonthlyCalendarGrid';
import SelectedDatePanel from '../../widgets/daily-plan-panel/SelectedDatePanel';

export default function MainPage() {
  const {
    user,
    chips,
    yearMonthLabel,
    calendarDays,
    selectedDate,
    selectedDateSchedules,
    selectedDateAiPlans,
    onPrevMonth,
    onNextMonth,
    onSelectDate,
  } = useMainPageViewModel();

  return (
    <div className="min-h-screen bg-[#F8F8F6] flex flex-col">
      {/* 상단 고정 영역 */}
      <div className="bg-[#F8F8F6]">
        {/* 프로필 요약 */}
        <div className="pt-6 pb-2">
          <ProfileSummarySection
            nickname={user.nickname}
            message={user.message}
            avatarUrl={user.avatarUrl}
          />
        </div>

        {/* 칩 바 */}
        <div className="pb-2">
          <TopChipBar chips={chips} />
        </div>

        {/* 캘린더 */}
        <div className="pb-2">
          <CalendarMonthHeader
            yearMonthLabel={yearMonthLabel}
            onPrevMonth={onPrevMonth}
            onNextMonth={onNextMonth}
          />
          <CalendarWeekHeader />
          <MonthlyCalendarGrid days={calendarDays} onSelectDate={onSelectDate} />
        </div>

        {/* 구분선 */}
        <div className="h-px bg-[#EFEFEF]" />
      </div>

      {/* 스크롤 영역: 선택된 날짜 일정 */}
      <div className="flex-1 overflow-y-auto">
        <SelectedDatePanel
          selectedDate={selectedDate}
          schedules={selectedDateSchedules}
          aiPlans={selectedDateAiPlans}
        />
      </div>
    </div>
  );
}
