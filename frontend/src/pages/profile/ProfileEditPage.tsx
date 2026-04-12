import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../shared/lib/apiClient';

type UserInfo = {
  email: string;
  nickname: string;
  phoneNumber?: string;
};

export default function ProfileEditPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ nickname: '', phoneNumber: '' });
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    apiClient
      .get<{ data: UserInfo }>('/api/users/me')
      .then((res) => {
        setEmail(res.data.data.email);
        setForm({
          nickname: res.data.data.nickname ?? '',
          phoneNumber: res.data.data.phoneNumber ?? '',
        });
      })
      .catch(() => setError('정보를 불러오지 못했습니다.'))
      .finally(() => setLoading(false));
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.nickname.trim()) {
      setError('닉네임을 입력해주세요.');
      return;
    }
    setSaving(true);
    try {
      await apiClient.patch('/api/users/me', {
        nickname: form.nickname.trim(),
        phoneNumber: form.phoneNumber.trim() || undefined,
      });
      // Update localStorage nickname
      localStorage.setItem('nickname', form.nickname.trim());
      navigate(-1);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg ?? '저장 중 오류가 발생했습니다.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F8F6] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[#111111] border-t-transparent rounded-full animate-spin" />
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
        <h1 className="text-[17px] font-semibold text-[#111111]">프로필 수정</h1>
      </div>

      <div className="flex-1 overflow-y-auto pb-12 px-5">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 pt-2">
          {/* 이메일 (읽기 전용) */}
          <div className="flex flex-col gap-1">
            <label className="text-[12px] font-semibold text-[#8E8E93] pl-1">이메일</label>
            <div className="h-[50px] bg-[#EFEFEF] rounded-[14px] px-4 flex items-center">
              <span className="text-[15px] text-[#8E8E93]">{email}</span>
            </div>
            <p className="text-[11px] text-[#C7C7CC] pl-1">이메일은 변경할 수 없습니다.</p>
          </div>

          {/* 닉네임 */}
          <div className="flex flex-col gap-1">
            <label className="text-[12px] font-semibold text-[#8E8E93] pl-1">닉네임 *</label>
            <input
              type="text"
              name="nickname"
              value={form.nickname}
              onChange={handleChange}
              placeholder="닉네임을 입력하세요"
              required
              maxLength={20}
              className="h-[50px] bg-white rounded-[14px] px-4 text-[15px] text-[#111111] placeholder:text-[#C7C7CC] outline-none"
            />
          </div>

          {/* 전화번호 */}
          <div className="flex flex-col gap-1">
            <label className="text-[12px] font-semibold text-[#8E8E93] pl-1">전화번호 (선택)</label>
            <input
              type="tel"
              name="phoneNumber"
              value={form.phoneNumber}
              onChange={handleChange}
              placeholder="010-0000-0000"
              maxLength={13}
              className="h-[50px] bg-white rounded-[14px] px-4 text-[15px] text-[#111111] placeholder:text-[#C7C7CC] outline-none"
            />
          </div>

          {error && (
            <p className="text-[13px] text-[#E05C5C] pl-1">{error}</p>
          )}

          <button
            type="submit"
            disabled={saving}
            className="h-[52px] bg-[#111111] text-white rounded-[16px] text-[15px] font-semibold disabled:opacity-50 mt-2"
          >
            {saving ? '저장 중...' : '저장'}
          </button>
        </form>
      </div>
    </div>
  );
}
