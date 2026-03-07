import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../../shared/api/authApi';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await login({ email, password });
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('nickname', data.nickname);
      navigate('/', { replace: true });
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg ?? '이메일 또는 비밀번호를 확인해주세요.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F8F8F6] flex flex-col">
      {/* 헤더 */}
      <div className="flex items-center px-5 pt-14 pb-8">
        <button onClick={() => navigate(-1)} className="w-9 h-9 flex items-center justify-center -ml-1" aria-label="뒤로가기">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#111111" strokeWidth="2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
      </div>

      <div className="px-6 flex-1">
        {/* 타이틀 */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-[10px] bg-[#111111] flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7l10 5 10-5-10-5z" fill="white" />
                <path d="M2 17l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round" />
                <path d="M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <span className="text-[#111111] text-lg font-bold">Millog</span>
          </div>
          <h1 className="text-[24px] font-bold text-[#111111] leading-snug">
            다시 만나서 반가워요
          </h1>
          <p className="text-[#8E8E93] text-[14px] mt-1.5">계속하려면 로그인하세요.</p>
        </div>

        {/* 폼 */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-[#8E8E93] pl-1">이메일</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="soldier@army.kr"
              required
              className="h-[50px] bg-white rounded-[14px] px-4 text-[15px] text-[#111111] placeholder:text-[#C7C7CC] outline-none"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-[#8E8E93] pl-1">비밀번호</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="8자 이상"
              required
              className="h-[50px] bg-white rounded-[14px] px-4 text-[15px] text-[#111111] placeholder:text-[#C7C7CC] outline-none"
            />
          </div>

          {error && (
            <p className="text-[13px] text-[#E05C5C] pl-1">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="h-[52px] bg-[#111111] text-white rounded-[16px] text-[15px] font-semibold mt-2 disabled:opacity-50"
          >
            {loading ? '로그인 중...' : '로그인'}
          </button>
        </form>

        {/* 회원가입 링크 */}
        <p className="text-center text-[13px] text-[#8E8E93] mt-6">
          아직 계정이 없으신가요?{' '}
          <Link to="/signup" className="text-[#111111] font-semibold underline underline-offset-2">
            회원가입
          </Link>
        </p>
      </div>
    </div>
  );
}
