import type { WeeklyDayModel } from '../../shared/model/types';

const DAY_LABELS = ['일', '월', '화', '수', '목', '금', '토'];

type WeeklyCalendarSectionProps = {
  days: WeeklyDayModel[];
  weekLabel: string; // e.g. '2026.03.01 ~ 03.07'
  selectedDate: string;
  onSelectDate: (date: string) => void;
  onPrevWeek: () => void;
  onNextWeek: () => void;
  onAddSchedule?: () => void;
};

export default function WeeklyCalendarSection({
  days,
  weekLabel,
  selectedDate,
  onSelectDate,
  onPrevWeek,
  onNextWeek,
  onAddSchedule,
}: WeeklyCalendarSectionProps) {
  return (
    <div className="px-5 pb-2">
      {/* 주간 헤더 */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={onPrevWeek}
            className="w-7 h-7 flex items-center justify-center rounded-full text-[#8E8E93] hover:bg-[#F0F0F0] transition-colors"
            aria-label="이전 주"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <span className="text-sm font-semibold text-[#111111]">{weekLabel}</span>
          <button
            onClick={onNextWeek}
            className="w-7 h-7 flex items-center justify-center rounded-full text-[#8E8E93] hover:bg-[#F0F0F0] transition-colors"
            aria-label="다음 주"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>

        {/* 일정 추가 버튼 */}
        <button
          onClick={onAddSchedule}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-[#111111] text-white"
          aria-label="일정 추가"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
      </div>

      {/* 7일 셀 */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, i) => {
          const isSelected = day.date === selectedDate;
          const isSunday = i === 0;
          const isSaturday = i === 6;

          return (
            <button
              key={day.date}
              onClick={() => onSelectDate(day.date)}
              className="flex flex-col items-center py-2 gap-1"
            >
              {/* 요일 레이블 */}
              <span
                className={`text-[11px] font-medium ${
                  isSunday ? 'text-[#E05C5C]' : isSaturday ? 'text-[#4A7BAF]' : 'text-[#8E8E93]'
                }`}
              >
                {DAY_LABELS[i]}
              </span>

              {/* 날짜 숫자 */}
              <div
                className={`w-9 h-9 flex items-center justify-center rounded-full text-[15px] font-medium transition-colors ${
                  isSelected
                    ? 'bg-[#111111] text-white font-semibold'
                    : day.isToday
                    ? 'bg-[#F0F0F0] text-[#111111] font-semibold'
                    : isSunday
                    ? 'text-[#E05C5C]'
                    : isSaturday
                    ? 'text-[#4A7BAF]'
                    : 'text-[#111111]'
                }`}
              >
                {day.dayNumber}
              </div>

              {/* 마커 */}
              <div className="flex gap-0.5 items-center h-2">
                {day.hasSchedule && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#8E8E93]" />
                )}
                {day.hasAiPlan && (
                  <span className="w-1.5 h-1.5 rounded-full border border-[#4A7BAF] bg-transparent" />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
