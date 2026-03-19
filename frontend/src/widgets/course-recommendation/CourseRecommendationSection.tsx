import { useState } from 'react';
import type { CourseRecommendationModel, CourseSource } from '../../shared/model/types';

type Props = {
  recommendations: CourseRecommendationModel[];
  isLoading: boolean;
  onRefresh: () => void;
};

const SOURCE_LABEL: Record<CourseSource, string> = {
  JANGBYEONGEEUM: '장병e음',
  DEFENSE_TRANSITION: '국방전직교육원',
  K_MOOC: 'K-MOOC',
};

const SOURCE_COLOR: Record<CourseSource, { bg: string; text: string }> = {
  JANGBYEONGEEUM: { bg: '#E8F5E9', text: '#2E7D32' },
  DEFENSE_TRANSITION: { bg: '#E3F2FD', text: '#1565C0' },
  K_MOOC: { bg: '#FFF3E0', text: '#E65100' },
};

function SourceBadge({ source }: { source: CourseSource }) {
  const color = SOURCE_COLOR[source];
  return (
    <span
      className="text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0"
      style={{ backgroundColor: color.bg, color: color.text }}
    >
      {SOURCE_LABEL[source]}
    </span>
  );
}

function ClockIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function SparkleIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#4A7BAF" strokeWidth="2">
      <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
    </svg>
  );
}

function CourseCard({ rec }: { rec: CourseRecommendationModel }) {
  const durationLabel =
    rec.course.durationMinutes >= 60
      ? `${Math.floor(rec.course.durationMinutes / 60)}시간${rec.course.durationMinutes % 60 > 0 ? ` ${rec.course.durationMinutes % 60}분` : ''}`
      : `${rec.course.durationMinutes}분`;

  function handleClick() {
    window.open(rec.course.url, '_blank', 'noopener,noreferrer');
  }

  return (
    <button
      onClick={handleClick}
      className="flex flex-col gap-2.5 bg-white rounded-[18px] p-4 text-left shrink-0 w-[220px] shadow-sm border border-[#F0F0F0] active:scale-[0.97] transition-transform"
    >
      {/* 출처 배지 */}
      <SourceBadge source={rec.course.source} />

      {/* 제목 */}
      <p className="text-[13px] font-semibold text-[#111111] leading-snug line-clamp-2">
        {rec.course.title}
      </p>

      {/* AI 추천 이유 */}
      <p className="text-[11px] text-[#888888] leading-relaxed line-clamp-2">
        {rec.reason}
      </p>

      {/* 하단 정보 */}
      <div className="flex items-center justify-between mt-auto pt-1">
        <div className="flex items-center gap-1 text-[11px] text-[#AAAAAA]">
          <ClockIcon />
          <span>{durationLabel}</span>
        </div>
        <span className="text-[11px] font-semibold text-[#4A7BAF]">바로가기 →</span>
      </div>
    </button>
  );
}

function SkeletonCard() {
  return (
    <div className="flex flex-col gap-3 bg-white rounded-[18px] p-4 shrink-0 w-[220px] border border-[#F0F0F0]">
      <div className="h-4 w-16 bg-[#F0F0F0] rounded-full animate-pulse" />
      <div className="h-4 w-full bg-[#F0F0F0] rounded animate-pulse" />
      <div className="h-3 w-4/5 bg-[#F0F0F0] rounded animate-pulse" />
      <div className="h-3 w-3/5 bg-[#F0F0F0] rounded animate-pulse" />
    </div>
  );
}

const FILTER_TABS: Array<{ label: string; value: CourseSource | 'ALL' }> = [
  { label: '전체', value: 'ALL' },
  { label: '장병e음', value: 'JANGBYEONGEEUM' },
  { label: '국방전직교육원', value: 'DEFENSE_TRANSITION' },
  { label: 'K-MOOC', value: 'K_MOOC' },
];

export default function CourseRecommendationSection({ recommendations, isLoading, onRefresh }: Props) {
  const [activeFilter, setActiveFilter] = useState<CourseSource | 'ALL'>('ALL');

  const filtered =
    activeFilter === 'ALL'
      ? recommendations
      : recommendations.filter((r) => r.course.source === activeFilter);

  return (
    <div className="mb-4">
      {/* 섹션 헤더 */}
      <div className="flex items-center justify-between px-5 mb-3">
        <div className="flex items-center gap-1.5">
          <div className="w-6 h-6 rounded-full bg-[#DCE8F8] flex items-center justify-center">
            <SparkleIcon />
          </div>
          <p className="text-[15px] font-bold text-[#111111]">AI 추천 강의</p>
        </div>
        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="flex items-center gap-1 text-[12px] text-[#4A7BAF] font-medium disabled:opacity-40"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <polyline points="23 4 23 10 17 10" />
            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
          </svg>
          새로고침
        </button>
      </div>

      {/* 필터 탭 */}
      <div className="flex gap-2 px-5 mb-3 overflow-x-auto scrollbar-hide">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveFilter(tab.value)}
            className={`shrink-0 text-[12px] font-medium px-3 py-1.5 rounded-full transition-colors ${
              activeFilter === tab.value
                ? 'bg-[#111111] text-white'
                : 'bg-white text-[#888888] border border-[#E8E8E8]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 카드 목록 (가로 스크롤) */}
      <div className="flex gap-3 px-5 overflow-x-auto scrollbar-hide pb-2">
        {isLoading ? (
          [1, 2, 3].map((i) => <SkeletonCard key={i} />)
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center w-full py-8 text-center">
            <p className="text-[13px] text-[#AAAAAA]">이 분류에 해당하는 추천 강의가 없어요.</p>
          </div>
        ) : (
          filtered
            .sort((a, b) => a.priority - b.priority)
            .map((rec) => <CourseCard key={rec.id} rec={rec} />)
        )}
      </div>

      {/* 안내 문구 */}
      {!isLoading && recommendations.length > 0 && (
        <p className="text-[10px] text-[#BBBBBB] text-center mt-2">
          카드를 탭하면 수강신청 페이지로 이동합니다
        </p>
      )}
    </div>
  );
}
