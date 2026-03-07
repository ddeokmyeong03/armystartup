import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import EmptyState from '../../shared/ui/EmptyState';
import Tag from '../../shared/ui/Tag';
import type { SchedulePreviewModel, AiPlanPreviewModel } from '../../shared/model/types';

dayjs.locale('ko');

const CATEGORY_LABELS: Record<string, string> = {
  DUTY: '근무',
  TRAINING: '훈련',
  ROLL_CALL: '점호',
  MEDICAL: '의무',
  PERSONAL: '개인',
  OTHER: '기타',
};

type SelectedDatePanelProps = {
  selectedDate: string;
  schedules: SchedulePreviewModel[];
  aiPlans: AiPlanPreviewModel[];
};

export default function SelectedDatePanel({ selectedDate, schedules, aiPlans }: SelectedDatePanelProps) {
  const dateLabel = dayjs(selectedDate).format('M월 D일 dddd');
  const hasContent = schedules.length > 0 || aiPlans.length > 0;

  return (
    <div className="mt-2 px-5 pb-8">
      {/* 날짜 헤더 */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-semibold text-[#111111]">{dateLabel}</p>
        {hasContent && (
          <span className="text-xs text-[#8E8E93]">{schedules.length + aiPlans.length}개</span>
        )}
      </div>

      {!hasContent ? (
        <EmptyState
          message="아직 등록된 일정이 없어요."
          subMessage="+ 버튼으로 첫 일정을 추가해보세요."
        />
      ) : (
        <div className="flex flex-col gap-2">
          {/* 일반 일정 */}
          {schedules.map((s) => (
            <div
              key={s.id}
              className="flex items-center gap-3 bg-white rounded-[14px] px-4 py-3"
            >
              <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                <p className="text-sm font-medium text-[#111111] truncate">{s.title}</p>
                <p className="text-xs text-[#8E8E93]">{s.startTime} – {s.endTime}</p>
              </div>
              <Tag label={CATEGORY_LABELS[s.category] ?? s.category} />
            </div>
          ))}

          {/* AI 계획 */}
          {aiPlans.map((p) => (
            <div
              key={p.id}
              className="flex items-center gap-3 bg-[#DCE8F8] rounded-[14px] px-4 py-3"
            >
              <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                <p className="text-sm font-medium text-[#111111] truncate">{p.title}</p>
                <p className="text-xs text-[#4A7BAF]">{p.startTime} – {p.endTime}</p>
              </div>
              <Tag label="AI 추천" variant="ai" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
