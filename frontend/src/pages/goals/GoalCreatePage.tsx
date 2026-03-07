import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../shared/lib/apiClient';

const GOAL_TYPES = [
  { value: 'STUDY', label: '공부', emoji: '📖' },
  { value: 'CERTIFICATE', label: '자격증', emoji: '🏆' },
  { value: 'EXERCISE', label: '운동', emoji: '💪' },
  { value: 'READING', label: '독서', emoji: '📚' },
  { value: 'CODING', label: '코딩', emoji: '💻' },
  { value: 'OTHER', label: '기타', emoji: '⭐' },
];

export default function GoalCreatePage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    type: 'STUDY',
    targetDescription: '',
    preferredMinutesPerSession: 30,
    preferredSessionsPerWeek: 3,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === 'preferredMinutesPerSession' || name === 'preferredSessionsPerWeek'
        ? Number(value)
        : value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (form.preferredMinutesPerSession < 10) {
      setError('회당 학습 시간은 최소 10분 이상이어야 합니다.');
      return;
    }

    setLoading(true);
    try {
      await apiClient.post('/api/goals', {
        title: form.title,
        type: form.type,
        targetDescription: form.targetDescription || undefined,
        preferredMinutesPerSession: form.preferredMinutesPerSession,
        preferredSessionsPerWeek: form.preferredSessionsPerWeek,
      });
      navigate('/goals', { replace: true });
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg ?? '목표 저장 중 오류가 발생했습니다.');
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
        <h1 className="text-[17px] font-semibold text-[#111111]">목표 추가</h1>
      </div>

      {/* 폼 */}
      <div className="flex-1 overflow-y-auto pb-12">
        <form onSubmit={handleSubmit} className="px-5 flex flex-col gap-4">
          {/* 목표 유형 */}
          <div className="flex flex-col gap-2">
            <label className="text-[12px] font-semibold text-[#8E8E93] pl-1">목표 유형</label>
            <div className="grid grid-cols-3 gap-2">
              {GOAL_TYPES.map((gt) => (
                <button
                  key={gt.value}
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, type: gt.value }))}
                  className={`h-[56px] flex flex-col items-center justify-center rounded-[14px] gap-0.5 text-[12px] font-medium transition-colors ${
                    form.type === gt.value
                      ? 'bg-[#111111] text-white'
                      : 'bg-white text-[#8E8E93]'
                  }`}
                >
                  <span className="text-[18px]">{gt.emoji}</span>
                  <span>{gt.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 목표 제목 */}
          <div className="flex flex-col gap-1">
            <label className="text-[12px] font-semibold text-[#8E8E93] pl-1">목표 이름 *</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="예: 토익 900점 달성, 컴활 자격증"
              required
              maxLength={50}
              className="h-[50px] bg-white rounded-[14px] px-4 text-[15px] text-[#111111] placeholder:text-[#C7C7CC] outline-none"
            />
          </div>

          {/* 목표 설명 */}
          <div className="flex flex-col gap-1">
            <label className="text-[12px] font-semibold text-[#8E8E93] pl-1">목표 설명 (선택)</label>
            <textarea
              name="targetDescription"
              value={form.targetDescription}
              onChange={handleChange}
              placeholder="목표에 대한 구체적인 내용을 적어주세요"
              rows={3}
              maxLength={200}
              className="bg-white rounded-[14px] px-4 py-3 text-[15px] text-[#111111] placeholder:text-[#C7C7CC] outline-none resize-none"
            />
          </div>

          {/* 회당 학습 시간 */}
          <div className="flex flex-col gap-2">
            <label className="text-[12px] font-semibold text-[#8E8E93] pl-1">
              회당 학습 시간: <span className="text-[#111111]">{form.preferredMinutesPerSession}분</span>
            </label>
            <div className="bg-white rounded-[14px] px-4 py-3">
              <input
                type="range"
                name="preferredMinutesPerSession"
                min={10}
                max={120}
                step={10}
                value={form.preferredMinutesPerSession}
                onChange={handleChange}
                className="w-full accent-[#111111]"
              />
              <div className="flex justify-between text-[11px] text-[#C7C7CC] mt-1">
                <span>10분</span>
                <span>120분</span>
              </div>
            </div>
          </div>

          {/* 주당 횟수 */}
          <div className="flex flex-col gap-2">
            <label className="text-[12px] font-semibold text-[#8E8E93] pl-1">
              주당 목표 횟수
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5, 6, 7].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, preferredSessionsPerWeek: n }))}
                  className={`flex-1 h-10 rounded-[10px] text-[13px] font-semibold transition-colors ${
                    form.preferredSessionsPerWeek === n
                      ? 'bg-[#111111] text-white'
                      : 'bg-white text-[#8E8E93]'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
            <p className="text-[12px] text-[#8E8E93] pl-1">
              주 {form.preferredSessionsPerWeek}회 × {form.preferredMinutesPerSession}분 = 주{' '}
              {form.preferredSessionsPerWeek * form.preferredMinutesPerSession}분
            </p>
          </div>

          {error && (
            <p className="text-[13px] text-[#E05C5C] pl-1">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="h-[52px] bg-[#111111] text-white rounded-[16px] text-[15px] font-semibold disabled:opacity-50 mt-2"
          >
            {loading ? '저장 중...' : '목표 추가'}
          </button>
        </form>
      </div>
    </div>
  );
}
