// shared.jsx — shared primitives: Icon, Avatar, AppShell, TabBar, nav
const { useState, useEffect, useRef, useMemo, createContext, useContext } = React;

const SPRITE = 'design_system/icons.svg';
function Icon({ name, size = 20, style = {}, className = '' }) {
  return (
    <svg width={size} height={size} style={style} className={className} aria-hidden="true">
      <use href={`${SPRITE}#${name}`} />
    </svg>
  );
}

// Custom icons not in sprite
function IconGoal({ size = 20, style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={style}>
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.6"/>
      <circle cx="12" cy="12" r="5.5" fill="none" stroke="currentColor" strokeWidth="1.6"/>
      <circle cx="12" cy="12" r="2" fill="currentColor"/>
    </svg>
  );
}
function IconMap({ size = 20, style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={style}>
      <path fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
        d="M4 6l5-2 6 2 5-2v14l-5 2-6-2-5 2V6z M9 4v16 M15 6v16"/>
    </svg>
  );
}
function IconBook({ size = 20, style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={style}>
      <path fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"
        d="M4 5a1 1 0 011-1h5a3 3 0 013 3v13a2 2 0 00-2-2H4V5z M20 5a1 1 0 00-1-1h-5a3 3 0 00-3 3v13a2 2 0 012-2h7V5z"/>
    </svg>
  );
}
function IconUser({ size = 20, style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={style}>
      <circle cx="12" cy="8" r="4" fill="currentColor"/>
      <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" fill="currentColor"/>
    </svg>
  );
}
function IconClock({ size = 20, style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={style}>
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.6"/>
      <path d="M12 7v5l3 2" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  );
}
function IconSparkle({ size = 20, style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={style}>
      <path fill="currentColor" d="M12 2l1.7 6.3L20 10l-6.3 1.7L12 18l-1.7-6.3L4 10l6.3-1.7z"/>
      <path fill="currentColor" d="M19 15l.7 2.3L22 18l-2.3.7L19 21l-.7-2.3L16 18l2.3-.7z"/>
    </svg>
  );
}

// Wordmark / Logo
function MillogLogo({ size = 24, dark }) {
  const color = dark === false ? '#000' : '#22FFB2';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <svg width={size} height={size} viewBox="0 0 40 40">
        <circle cx="20" cy="20" r="20" fill={color}/>
        <path d="M10 26V14l6 6 6-6v12M22 26V14l6 6" fill="none" stroke="#001f12" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      <span style={{ fontFamily: 'var(--font-title)', fontWeight: 800, fontSize: size * 0.75, letterSpacing: '-0.02em', color: 'var(--text-bright)' }}>
        Millog
      </span>
    </div>
  );
}

// Nav context — page routing inside the iPhone frame
const NavCtx = createContext(null);
function useNav() { return useContext(NavCtx); }

function NavProvider({ children }) {
  const [page, setPage] = useState(() => localStorage.getItem('millog.page') || 'login');
  const [history, setHistory] = useState([]);
  const goto = (name, opts = {}) => {
    setHistory(h => [...h, page]);
    setPage(name);
    localStorage.setItem('millog.page', name);
  };
  const back = () => {
    setHistory(h => {
      const prev = h[h.length - 1] || 'home';
      setPage(prev);
      localStorage.setItem('millog.page', prev);
      return h.slice(0, -1);
    });
  };
  return <NavCtx.Provider value={{ page, goto, back }}>{children}</NavCtx.Provider>;
}

// Tab bar
function TabBar() {
  const { page, goto } = useNav();
  const items = [
    { id: 'home', label: '홈', icon: <Icon name="home-filled" size={22}/> },
    { id: 'goals', label: '목표', icon: <IconGoal size={22}/> },
    { id: 'roadmap', label: '로드맵', icon: <IconMap size={22}/> },
    { id: 'courses', label: '강의', icon: <IconBook size={22}/> },
    { id: 'profile', label: '프로필', icon: <IconUser size={22}/> },
  ];
  return (
    <div className="tab-bar">
      {items.map(it => (
        <button key={it.id} className={`tab-item ${page === it.id ? 'active' : ''}`} onClick={() => goto(it.id)}>
          {it.icon}
          <div className="tab-label">{it.label}</div>
          <div className="tab-dot"/>
        </button>
      ))}
    </div>
  );
}

// Page header (non-scrolling bar)
function PageHeader({ title, subtitle, right, showBack }) {
  const { back } = useNav();
  return (
    <div style={{ padding: '8px 20px 10px', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0, position: 'relative', zIndex: 1 }}>
      {showBack && (
        <button onClick={back} style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--bg-surface-hi)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-base)' }}>
          <Icon name="chevron-left" size={18}/>
        </button>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        {subtitle && <div className="t-caption" style={{ marginBottom: 2 }}>{subtitle}</div>}
        <div className="t-title" style={{ fontSize: 20 }}>{title}</div>
      </div>
      {right}
    </div>
  );
}

// Simple safe-area spacer for status bar area
function StatusSpacer() { return <div style={{ height: 8 }}/>; }

Object.assign(window, {
  Icon, IconGoal, IconMap, IconBook, IconUser, IconClock, IconSparkle,
  MillogLogo, NavProvider, useNav, NavCtx, TabBar, PageHeader, StatusSpacer,
});
