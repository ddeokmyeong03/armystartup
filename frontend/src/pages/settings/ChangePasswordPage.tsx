import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../shared/lib/apiClient';

export default function ChangePasswordPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (form.newPassword.length < 8) {
      setError('새 비밀번호는 8자 이상이어야 합니다.');
      return;
    }
    if (form.newPassword !== form.confirmPassword) {
      setError('새 비밀번호와 확인 비밀번호가 일치하지 않습니다.');
      return;
    }

    setLoading(true);
    try {
      await apiClient.patch('/api/users/password', {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });
      setSuccess(true);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg ?? '비밀번호 변경 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-[#F8F8F6] flex flex-col items-center justify-center px-5 gap-5">
        <div className="w-16 h-16 rounded-full bg-[#E8F4E8] flex items-center justify-center">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#3A7D44" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <div className="text-center">
          <p className="text-[18px] font-bold text-[#111111]">비밀번호 변경 완료</p>
          <p className="text-[13px] text-[#8E8E93] mt-1">새 비밀번호로 변경되었습니다.</p>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="h-[52px] w-full bg-[#111111] text-white rounded-[16px] text-[15px] font-semibold"
        >
          확인
        </button>
      </div>
    );
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
        <h1 className="text-[17px] font-semibold text-[#111111]">비밀번호 변경</h1>
      </div>

      <div className="flex-1 overflow-y-auto pb-12 px-5">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 pt-2">
          {/* 현재 비밀번호 */}
          <div className="flex flex-col gap-1">
            <label className="text-[12px] font-semibold text-[#8E8E93] pl-1">현재 비밀번호</label>
            <input
              type="password"
              name="currentPassword"
              value={form.currentPassword}
              onChange={handleChange}
              placeholder="현재 비밀번호를 입력하세요"
              required
              className="h-[50px] bg-white rounded-[14px] px-4 text-[15px] text-[#111111] placeholder:text-[#C7C7CC] outline-none"
            />
          </div>

          {/* 새 비밀번호 */}
          <div className="flex flex-col gap-1">
            <label className="text-[12px] font-semibold text-[#8E8E93] pl-1">새 비밀번호</label>
            <input
              type="password"
              name="newPassword"
              value={form.newPassword}
              onChange={handleChange}
              placeholder="8자 이상 입력하세요"
              required
              className="h-[50px] bg-white rounded-[14px] px-4 text-[15px] text-[#111111] placeholder:text-[#C7C7CC] outline-none"
            />
          </div>

          {/* 새 비밀번호 확인 */}
          <div className="flex flex-col gap-1">
            <label className="text-[12px] font-semibold text-[#8E8E93] pl-1">새 비밀번호 확인</label>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="새 비밀번호를 다시 입력하세요"
              required
              className="h-[50px] bg-white rounded-[14px] px-4 text-[15px] text-[#111111] placeholder:text-[#C7C7CC] outline-none"
            />
          </div>

          {/* 비밀번호 조건 안내 */}
          <div className="bg-[#F0F0EE] rounded-[12px] px-4 py-3">
            <p className="text-[12px] text-[#8E8E93] font-medium mb-1">비밀번호 조건</p>
            <ul className="text-[12px] text-[#8E8E93] space-y-0.5">
              <li className={`flex items-center gap-1.5 ${form.newPassword.length >= 8 ? 'text-[#3A7D44]' : ''}`}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                  stroke={form.newPassword.length >= 8 ? '#3A7D44' : '#C7C7CC'} strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                8자 이상
              </li>
            </ul>
          </div>

          {error && (
            <p className="text-[13px] text-[#E05C5C] pl-1">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="h-[52px] bg-[#111111] text-white rounded-[16px] text-[15px] font-semibold disabled:opacity-50 mt-2"
          >
            {loading ? '변경 중...' : '비밀번호 변경'}
          </button>
        </form>
      </div>
    </div>
  );
}
