import { useState } from 'react';
import OverviewPage from './pages/OverviewPage';
import GoalsPage from './pages/GoalsPage';
import CoursesPage from './pages/CoursesPage';
import FatiguePage from './pages/FatiguePage';
import UsersPage from './pages/UsersPage';

type Page = 'overview' | 'goals' | 'courses' | 'fatigue' | 'users';

const NAV: { id: Page; label: string; emoji: string }[] = [
  { id: 'overview', label: '개요',    emoji: '📊' },
  { id: 'goals',    label: '목표',    emoji: '🎯' },
  { id: 'courses',  label: '강의',    emoji: '📚' },
  { id: 'fatigue',  label: '피로도',  emoji: '⚡' },
  { id: 'users',    label: '유저',    emoji: '👥' },
];

function LoginScreen({ onLogin }: { onLogin: (email: string, pw: string) => void }) {
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
      <div style={{ width: 360, padding: 40, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16 }}>
        <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--accent)', marginBottom: 8 }}>Millog</div>
        <div style={{ fontSize: 14, color: 'var(--text-sub)', marginBottom: 28 }}>관리자 대시보드</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input value={email} onChange={e => setEmail(e.target.value)} placeholder="관리자 이메일"
            style={{ height: 44, borderRadius: 8, border: '1px solid var(--border)', background: 'var(--surface-hi)', color: 'var(--text)', padding: '0 14px', fontSize: 14 }}/>
          <input type="password" value={pw} onChange={e => setPw(e.target.value)} placeholder="비밀번호"
            onKeyDown={e => e.key === 'Enter' && onLogin(email, pw)}
            style={{ height: 44, borderRadius: 8, border: '1px solid var(--border)', background: 'var(--surface-hi)', color: 'var(--text)', padding: '0 14px', fontSize: 14 }}/>
          <button onClick={() => onLogin(email, pw)}
            style={{ height: 44, borderRadius: 8, background: 'var(--accent)', color: '#001f12', fontWeight: 800, fontSize: 15 }}>
            로그인
          </button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState<Page>('overview');
  const [loggedIn, setLoggedIn] = useState(() => !!(sessionStorage.getItem('adminEmail')));

  const handleLogin = (email: string, pw: string) => {
    sessionStorage.setItem('adminEmail', email);
    sessionStorage.setItem('adminPassword', pw);
    setLoggedIn(true);
  };

  if (!loggedIn) return <LoginScreen onLogin={handleLogin}/>;

  const PageComp = { overview: OverviewPage, goals: GoalsPage, courses: CoursesPage, fatigue: FatiguePage, users: UsersPage }[page];

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* 사이드바 */}
      <aside style={{ width: 220, background: 'var(--surface)', borderRight: '1px solid var(--border)', padding: '24px 12px', flexShrink: 0, display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '0 8px 24px', borderBottom: '1px solid var(--border)', marginBottom: 16 }}>
          <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--accent)' }}>Millog</div>
          <div style={{ fontSize: 11, color: 'var(--text-sub)', marginTop: 2 }}>Admin Dashboard</div>
        </div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {NAV.map(n => (
            <a key={n.id} href="#" className={page === n.id ? 'active' : ''} onClick={e => { e.preventDefault(); setPage(n.id); }}>
              {n.emoji} {n.label}
            </a>
          ))}
        </nav>
        <div style={{ marginTop: 'auto', padding: '16px 8px 0', borderTop: '1px solid var(--border)' }}>
          <button onClick={() => { sessionStorage.clear(); setLoggedIn(false); }}
            style={{ fontSize: 12, color: 'var(--text-sub)', width: '100%', textAlign: 'left', padding: '8px 8px' }}>
            로그아웃
          </button>
        </div>
      </aside>

      {/* 메인 */}
      <main style={{ flex: 1, padding: 32, overflow: 'auto' }}>
        <PageComp/>
      </main>
    </div>
  );
}
