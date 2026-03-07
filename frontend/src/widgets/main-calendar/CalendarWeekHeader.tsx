const DAYS = ['일', '월', '화', '수', '목', '금', '토'];

export default function CalendarWeekHeader() {
  return (
    <div className="grid grid-cols-7 px-4 pb-1">
      {DAYS.map((day, i) => (
        <div
          key={day}
          className={`text-center text-xs font-medium py-1 ${
            i === 0 ? 'text-[#E05C5C]' : i === 6 ? 'text-[#4A7BAF]' : 'text-[#8E8E93]'
          }`}
        >
          {day}
        </div>
      ))}
    </div>
  );
}
