import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function SocialCallbackPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    const nickname = searchParams.get('nickname') ?? '';
    const error = searchParams.get('error');

    if (error) {
      navigate(`/login?error=${encodeURIComponent(error)}`);
      return;
    }

    if (token) {
      localStorage.setItem('accessToken', token);
      if (nickname) localStorage.setItem('nickname', nickname);
      navigate('/');
    } else {
      navigate('/login');
    }
  }, []);

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg-base)', color: 'var(--text-subdued)', fontSize: 14,
    }}>
      로그인 처리 중...
    </div>
  );
}
