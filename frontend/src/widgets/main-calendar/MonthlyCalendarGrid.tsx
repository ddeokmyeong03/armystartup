import type { CalendarDayModel } from '../../shared/model/types';
import CalendarDayCell from './CalendarDayCell';

type MonthlyCalendarGridProps = {
  days: CalendarDayModel[];
  onSelectDate?: (date: string) => void;
};

export default function MonthlyCalendarGrid({ days, onSelectDate }: MonthlyCalendarGridProps) {
  return (
    <div className="grid grid-cols-7 px-2">
      {days.map((day, index) => (
        <CalendarDayCell
          key={day.date}
          {...day}
          dayIndex={index % 7}
          onClick={onSelectDate}
        />
      ))}
    </div>
  );
}
