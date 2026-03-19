import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import apiClient from '../../shared/lib/apiClient';
import BottomNavBar from '../../shared/ui/BottomNavBar';

type ScheduleDetail = {
  id: number;
  title: string;
  scheduleDate: string;
  startTime: string;  // "HH:MM" 형식
  endTime: string;    // "HH:MM" 형식
  category: string;
  memo: string | null;
  repeatType: string;
};

const CATEGORY_LABEL: Record<string, string> = {
  DUTY: '근무',
  TRAINING: '훈련',
  ROLLCALL: '점호',
  PERSONAL: '개인',
  STUDY: '자기개발',
  REST: '휴식',
  OTHER: '기타',
};

const CATEGORY_COLOR: Record<string, string> = {
  DUTY: '#4A7BAF',
  TRAINING: '#D98E2F',
  ROLLCALL: '#8E8E93',
  PERSONAL: '#9B59B6',
  STUDY: '#3D7A57',
  REST: '#5BA4CF',
  OTHER: '#95A5A6',
};

function formatDate(dateStr: string) {
  // dateStr: "YYYY-MM-DD"
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  return `${y}년 ${m}월 ${d}일 ${days[date.getDay()]}요일`;
}

export default function ScheduleDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [schedule, setSchedule] = useState<ScheduleDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!id) return;
    apiClient
      .get<{ data: ScheduleDetail }>(`/api/schedules/${id}`)
      .then((res) => setSchedule(res.data.data))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [id]);

  function handleDelete() {
    if (!id || !confirm('일정을 삭제할까요?')) return;
    apiClient
      .delete(`/api/schedules/${id}`)
      .then(() => navigate(-1))
      .catch(() => alert('삭제에 실패했습니다.'));
  }

  const color = schedule ? (CATEGORY_COLOR[schedule.category] ?? '#8E8E93') : '#8E8E93';

  return (
    <div className="min-h-screen bg-[#F8F8F6] flex flex-col">
      {/* 헤더 */}
      <div className="flex items-center justify-between px-5 pt-12 pb-2">
        <button onClick={() => navigate(-1)} className="w-9 h-9 flex items-center justify-center" aria-label="뒤로가기">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#111111" strokeWidth="2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <h1 className="text-[17px] font-semibold text-[#111111]">일정 상세</h1>
        {schedule && (
          <button
            onClick={() => navigate(`/schedules/${id}/edit`)}
            className="text-[14px] font-medium text-[#4A7BAF]"
          >
            수정
          </button>
        )}
        {!schedule && <div className="w-9" />}
      </div>

      <div className="flex-1 overflow-y-auto pb-28">
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="w-6 h-6 border-2 border-[#111111] border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center justify-center py-20 gap-2">
            <p className="text-[14px] text-[#8E8E93]">일정을 불러오지 못했습니다.</p>
            <button onClick={() => navigate(-1)} className="text-[13px] text-[#4A7BAF]">돌아가기</button>
          </div>
        )}

        {schedule && (
          <div className="px-5 py-4 flex flex-col gap-4">
            {/* 카테고리 배지 + 제목 */}
            <div className="bg-white rounded-[20px] px-5 py-5">
              <span
                className="text-[11px] font-semibold px-2.5 py-1 rounded-full text-white"
                style={{ backgroundColor: color }}
              >
                {CATEGORY_LABEL[schedule.category] ?? schedule.category}
              </span>
              <h2 className="text-[20px] font-bold text-[#111111] mt-3 leading-snug">{schedule.title}</h2>
            </div>

            {/* 날짜 / 시간 */}
            <div className="bg-white rounded-[20px] px-5 py-5 flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[#F0F0F0] flex items-center justify-center shrink-0">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#8E8E93" strokeWidth="1.8">
                    <rect x="3" y="4" width="18" height="18" rx="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                </div>
                <div>
                  <p className="text-[12px] text-[#8E8E93]">날짜</p>
                  <p className="text-[15px] font-medium text-[#111111] mt-0.5">{formatDate(schedule.scheduleDate)}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[#F0F0F0] flex items-center justify-center shrink-0">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#8E8E93" strokeWidth="1.8">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                </div>
                <div>
                  <p className="text-[12px] text-[#8E8E93]">시간</p>
                  <p className="text-[15px] font-medium text-[#111111] mt-0.5">
                    {schedule.startTime} ~ {schedule.endTime}
                  </p>
                </div>
              </div>

              {schedule.repeatType && schedule.repeatType !== 'NONE' && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#F0F0F0] flex items-center justify-center shrink-0">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#8E8E93" strokeWidth="1.8">
                      <polyline points="17 1 21 5 17 9" />
                      <path d="M3 11V9a4 4 0 0 1 4-4h14" />
                      <polyline points="7 23 3 19 7 15" />
                      <path d="M21 13v2a4 4 0 0 1-4 4H3" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[12px] text-[#8E8E93]">반복</p>
                    <p className="text-[15px] font-medium text-[#111111] mt-0.5">
                      {{ DAILY: '매일', WEEKLY: '매주', MONTHLY: '매월', NONE: '반복 없음' }[schedule.repeatType] ?? schedule.repeatType}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* 메모 */}
            {schedule.memo && (
              <div className="bg-white rounded-[20px] px-5 py-5">
                <p className="text-[12px] text-[#8E8E93] mb-2">메모</p>
                <p className="text-[15px] text-[#111111] leading-relaxed whitespace-pre-wrap">{schedule.memo}</p>
              </div>
            )}

            {/* 삭제 버튼 */}
            <button
              onClick={handleDelete}
              className="w-full bg-white rounded-[20px] px-5 py-4 text-[15px] font-medium text-[#E05C5C] text-center"
            >
              일정 삭제
            </button>
          </div>
        )}
      </div>

      <BottomNavBar />
    </div>
  );
}
