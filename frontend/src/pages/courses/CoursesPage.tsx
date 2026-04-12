import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../shared/lib/apiClient';

type Course = {
  id: number;
  title: string;
  source: string;
  category: string;
  targetGoalType?: string;
  description: string;
  durationMinutes: number;
  url: string;
  tags: string;
};

const SOURCE_LABELS: Record<string, string> = {
  JANGBYEONGEEUM: '장병e음',
  DEFENSE_TRANSITION: '국방전직교육원',
  K_MOOC: 'K-MOOC',
};

const CATEGORY_LABELS: Record<string, string> = {
  LANGUAGE: '어학',
  IT: 'IT',
  CERTIFICATE: '자격증',
  EXERCISE: '운동',
  LEADERSHIP: '리더십',
  OTHER: '기타',
};

const CATEGORY_COLORS: Record<string, string> = {
  LANGUAGE: 'bg-[#DCE8F8] text-[#4A7BAF]',
  IT: 'bg-[#EDE8F8] text-[#6040A0]',
  CERTIFICATE: 'bg-[#FDE8F0] text-[#C05080]',
  EXERCISE: 'bg-[#E8F4E8] text-[#3A7D44]',
  LEADERSHIP: 'bg-[#FFF3DC] text-[#B07830]',
  OTHER: 'bg-[#EFEFEF] text-[#8E8E93]',
};

const SOURCE_FILTERS = [
  { value: '', label: '전체' },
  { value: 'JANGBYEONGEEUM', label: '장병e음' },
  { value: 'DEFENSE_TRANSITION', label: '국방전직' },
  { value: 'K_MOOC', label: 'K-MOOC' },
];

export default function CoursesPage() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [sourceFilter, setSourceFilter] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    setLoading(true);
    const params = sourceFilter ? `?source=${sourceFilter}` : '';
    apiClient
      .get<{ data: { courses: Course[] } }>(`/api/courses${params}`)
      .then((res) => setCourses(res.data.data.courses))
      .catch(() => setCourses([]))
      .finally(() => setLoading(false));
  }, [sourceFilter]);

  const filtered = search.trim()
    ? courses.filter(
        (c) =>
          c.title.toLowerCase().includes(search.toLowerCase()) ||
          c.description.toLowerCase().includes(search.toLowerCase()),
      )
    : courses;

  return (
    <div className="min-h-screen bg-[#F8F8F6] flex flex-col">
      {/* 헤더 */}
      <div className="flex items-center gap-3 px-5 pt-12 pb-4 bg-[#F8F8F6]">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 flex items-center justify-center"
          aria-label="뒤로가기"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#111111" strokeWidth="2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <div className="flex-1">
          <h1 className="text-[17px] font-semibold text-[#111111]">강의 목록</h1>
          <p className="text-[12px] text-[#8E8E93]">총 {filtered.length}개 강의</p>
        </div>
      </div>

      {/* 검색 */}
      <div className="px-5 pb-3">
        <div className="relative">
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2"
            width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8E8E93" strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="강의 검색..."
            className="w-full h-[44px] bg-white rounded-[12px] pl-10 pr-4 text-[14px] text-[#111111] placeholder:text-[#C7C7CC] outline-none"
          />
        </div>
      </div>

      {/* 출처 필터 탭 */}
      <div className="px-5 pb-3 flex gap-2 overflow-x-auto scrollbar-none">
        {SOURCE_FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setSourceFilter(f.value)}
            className={`px-4 py-2 rounded-full text-[13px] font-medium whitespace-nowrap transition-colors ${
              sourceFilter === f.value
                ? 'bg-[#111111] text-white'
                : 'bg-white text-[#8E8E93]'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* 강의 목록 */}
      <div className="flex-1 overflow-y-auto pb-8 px-5">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-6 h-6 border-2 border-[#111111] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-2">
            <div className="w-12 h-12 rounded-full bg-[#EFEFEF] flex items-center justify-center">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#8E8E93" strokeWidth="1.8">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
              </svg>
            </div>
            <p className="text-[14px] font-semibold text-[#111111]">강의가 없습니다</p>
            <p className="text-[12px] text-[#8E8E93]">검색어나 필터를 바꿔보세요.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function CourseCard({ course }: { course: Course }) {
  const categoryColor = CATEGORY_COLORS[course.category] ?? CATEGORY_COLORS.OTHER;
  const categoryLabel = CATEGORY_LABELS[course.category] ?? course.category;
  const sourceLabel = SOURCE_LABELS[course.source] ?? course.source;
  let tags: string[] = [];
  try { tags = JSON.parse(course.tags); } catch { tags = []; }

  return (
    <a
      href={course.url}
      target="_blank"
      rel="noopener noreferrer"
      className="bg-white rounded-[16px] px-4 py-4 block active:scale-[0.99] transition-transform"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1">
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${categoryColor}`}>
              {categoryLabel}
            </span>
            <span className="text-[10px] text-[#8E8E93] font-medium">{sourceLabel}</span>
          </div>
          <p className="text-[15px] font-semibold text-[#111111] leading-snug">{course.title}</p>
        </div>
        <div className="shrink-0 flex items-center gap-1 text-[#8E8E93]">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <span className="text-[12px] font-medium">{course.durationMinutes}분</span>
        </div>
      </div>

      <p className="text-[12px] text-[#8E8E93] leading-relaxed line-clamp-2 mb-2">
        {course.description}
      </p>

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {tags.slice(0, 4).map((tag) => (
            <span key={tag} className="text-[10px] text-[#8E8E93] bg-[#F0F0EE] px-2 py-0.5 rounded-full">
              #{tag}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center gap-1 mt-2">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#8E8E93" strokeWidth="2">
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
          <polyline points="15 3 21 3 21 9" />
          <line x1="10" y1="14" x2="21" y2="3" />
        </svg>
        <span className="text-[11px] text-[#8E8E93]">바로가기</span>
      </div>
    </a>
  );
}
