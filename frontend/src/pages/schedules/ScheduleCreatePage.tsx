import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import apiClient from '../../shared/lib/apiClient';

const CATEGORIES = [
  { value: 'DUTY', label: '근무' },
  { value: 'TRAINING', label: '훈련' },
  { value: 'ROLLCALL', label: '점호' },
  { value: 'PERSONAL', label: '개인' },
  { value: 'STUDY', label: '자기개발' },
  { value: 'REST', label: '휴식' },
  { value: 'OTHER', label: '기타' },
];

const REPEAT_TYPES = [
  { value: 'NONE', label: '반복 없음' },
  { value: 'DAILY', label: '매일' },
  { value: 'WEEKLY', label: '매주' },
  { value: 'MONTHLY', label: '매월' },
];

export default function ScheduleCreatePage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    scheduleDate: dayjs().format('YYYY-MM-DD'),
    startTime: '09:00',
    endTime: '10:00',
    category: 'PERSONAL',
    repeatType: 'NONE',
    memo: '',
  });
  const [nextDay, setNextDay] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!nextDay && form.startTime >= form.endTime) {
      setError('종료 시간은 시작 시간보다 늦어야 합니다. 자정을 넘기는 경우 "다음날" 체크박스를 선택하세요.');
      return;
    }

    setLoading(true);
    try {
      await apiClient.post('/api/schedules', {
        title: form.title,
        scheduleDate: form.scheduleDate,
        startTime: form.startTime,
        endTime: form.endTime,
        category: form.category,
        repeatType: form.repeatType,
        memo: form.memo || undefined,
      });
      navigate(-1);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg ?? '일정 저장 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  }

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
        <h1 className="text-[17px] font-semibold text-[#111111]">일정 추가</h1>
      </div>

      {/* 폼 */}
      <div className="flex-1 overflow-y-auto pb-12">
        <form onSubmit={handleSubmit} className="px-5 flex flex-col gap-4">
          {/* 제목 */}
          <div className="flex flex-col gap-1">
            <label className="text-[12px] font-semibold text-[#8E8E93] pl-1">일정 제목 *</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="예: 점호, 개인 운동"
              required
              maxLength={50}
              className="h-[50px] bg-white rounded-[14px] px-4 text-[15px] text-[#111111] placeholder:text-[#C7C7CC] outline-none"
            />
          </div>

          {/* 날짜 */}
          <div className="flex flex-col gap-1">
            <label className="text-[12px] font-semibold text-[#8E8E93] pl-1">날짜 *</label>
            <input
              type="date"
              name="scheduleDate"
              value={form.scheduleDate}
              onChange={handleChange}
              required
              className="h-[50px] bg-white rounded-[14px] px-4 text-[15px] text-[#111111] outline-none"
            />
          </div>

          {/* 시간 */}
          <div className="flex gap-3">
            <div className="flex flex-col gap-1 flex-1">
              <label className="text-[12px] font-semibold text-[#8E8E93] pl-1">시작 시간 *</label>
              <input
                type="time"
                name="startTime"
                value={form.startTime}
                onChange={handleChange}
                required
                className="h-[50px] bg-white rounded-[14px] px-4 text-[15px] text-[#111111] outline-none"
              />
            </div>
            <div className="flex flex-col gap-1 flex-1">
              <label className="text-[12px] font-semibold text-[#8E8E93] pl-1">종료 시간 *</label>
              <input
                type="time"
                name="endTime"
                value={form.endTime}
                onChange={handleChange}
                required
                className="h-[50px] bg-white rounded-[14px] px-4 text-[15px] text-[#111111] outline-none"
              />
            </div>
          </div>

          {/* 다음날 종료 체크박스 */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={nextDay}
              onChange={(e) => setNextDay(e.target.checked)}
              className="w-4 h-4 accent-[#111111]"
            />
            <span className="text-[13px] font-medium text-[#8E8E93]">
              종료 시간이 다음날 (자정을 넘기는 근무)
            </span>
          </label>

          {/* 카테고리 */}
          <div className="flex flex-col gap-2">
            <label className="text-[12px] font-semibold text-[#8E8E93] pl-1">카테고리</label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, category: cat.value }))}
                  className={`px-4 py-2 rounded-full text-[13px] font-medium transition-colors ${
                    form.category === cat.value
                      ? 'bg-[#111111] text-white'
                      : 'bg-white text-[#8E8E93]'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* 반복 */}
          <div className="flex flex-col gap-1">
            <label className="text-[12px] font-semibold text-[#8E8E93] pl-1">반복</label>
            <select
              name="repeatType"
              value={form.repeatType}
              onChange={handleChange}
              className="h-[50px] bg-white rounded-[14px] px-4 text-[15px] text-[#111111] outline-none appearance-none"
            >
              {REPEAT_TYPES.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>

          {/* 메모 */}
          <div className="flex flex-col gap-1">
            <label className="text-[12px] font-semibold text-[#8E8E93] pl-1">메모 (선택)</label>
            <textarea
              name="memo"
              value={form.memo}
              onChange={handleChange}
              placeholder="추가 메모를 입력하세요"
              rows={3}
              maxLength={200}
              className="bg-white rounded-[14px] px-4 py-3 text-[15px] text-[#111111] placeholder:text-[#C7C7CC] outline-none resize-none"
            />
          </div>

          {error && (
            <p className="text-[13px] text-[#E05C5C] pl-1">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="h-[52px] bg-[#111111] text-white rounded-[16px] text-[15px] font-semibold disabled:opacity-50 mt-2"
          >
            {loading ? '저장 중...' : '일정 추가'}
          </button>
        </form>
      </div>
    </div>
  );
}
