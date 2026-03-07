type CalendarMonthHeaderProps = {
  yearMonthLabel: string;
  onPrevMonth?: () => void;
  onNextMonth?: () => void;
  onAddSchedule?: () => void;
};

export default function CalendarMonthHeader({
  yearMonthLabel,
  onPrevMonth,
  onNextMonth,
  onAddSchedule,
}: CalendarMonthHeaderProps) {
  return (
    <div className="flex items-center justify-between px-5 pt-4 pb-2">
      <div className="flex items-center gap-2">
        {/* 이전 달 */}
        <button
          onClick={onPrevMonth}
          aria-label="이전 달"
          className="w-8 h-8 flex items-center justify-center rounded-full text-[#8E8E93] hover:bg-[#EFEFEF] transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        <button
          onClick={onNextMonth}
          className="flex items-center gap-1 group"
          aria-label="월 선택"
        >
          <span className="text-[20px] font-semibold text-[#111111]">{yearMonthLabel}</span>
          <svg
            width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="#8E8E93" strokeWidth="2"
            className="transition-transform group-hover:translate-y-0.5"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>

        {/* 다음 달 */}
        <button
          onClick={onNextMonth}
          aria-label="다음 달"
          className="w-8 h-8 flex items-center justify-center rounded-full text-[#8E8E93] hover:bg-[#EFEFEF] transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>

      {/* 일정 추가 버튼 */}
      <button
        onClick={onAddSchedule}
        aria-label="일정 추가"
        className="w-9 h-9 flex items-center justify-center rounded-full bg-[#111111] text-white hover:bg-[#333333] transition-colors"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M12 5v14M5 12h14" />
        </svg>
      </button>
    </div>
  );
}
