import type { CalendarDayModel } from '../../shared/model/types';

type CalendarDayCellProps = CalendarDayModel & {
  onClick?: (date: string) => void;
  dayIndex: number; // 0=일, 6=토
};

export default function CalendarDayCell({
  date,
  dayNumber,
  isCurrentMonth,
  isToday,
  isSelected,
  hasSchedule,
  hasAiPlan,
  onClick,
  dayIndex,
}: CalendarDayCellProps) {
  const isWeekend = dayIndex === 0 || dayIndex === 6;
  const isSunday = dayIndex === 0;

  return (
    <button
      onClick={() => onClick?.(date)}
      className="flex flex-col items-center py-1.5 gap-1 min-h-[52px] w-full"
    >
      {/* 날짜 숫자 */}
      <div
        className={`
          w-8 h-8 flex items-center justify-center rounded-full text-[15px] font-medium transition-colors
          ${!isCurrentMonth ? 'text-[#D0D0D0]' : ''}
          ${isCurrentMonth && !isSelected && !isToday
            ? isSunday ? 'text-[#E05C5C]' : isWeekend ? 'text-[#4A7BAF]' : 'text-[#111111]'
            : ''}
          ${isToday && !isSelected ? 'bg-[#F0F0F0] text-[#111111] font-semibold' : ''}
          ${isSelected ? 'bg-[#111111] text-white font-semibold' : ''}
        `}
      >
        {dayNumber}
      </div>

      {/* 마커 영역 */}
      <div className="flex gap-0.5 items-center h-2">
        {hasSchedule && (
          <span className="w-1.5 h-1.5 rounded-full bg-[#8E8E93]" />
        )}
        {hasAiPlan && (
          <span className="w-1.5 h-1.5 rounded-full border border-[#4A7BAF] bg-transparent" />
        )}
      </div>
    </button>
  );
}
