import React from 'react';

interface IconProps {
  name: string;
  size?: number;
  style?: React.CSSProperties;
  className?: string;
}

export function Icon({ name, size = 20, style = {}, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} style={style} className={className} aria-hidden="true">
      <use href={`/icons.svg#${name}`} />
    </svg>
  );
}

/* 홈 탭 아이콘 */
export function IconHome({ size = 24, style = {} }: { size?: number; style?: React.CSSProperties }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" style={style}>
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H5a1 1 0 01-1-1V9.5z"/>
      <path d="M9 21V12h6v9"/>
    </svg>
  );
}

/* 기록 탭 아이콘 (edit/pencil) */
export function IconRecord({ size = 24, style = {} }: { size?: number; style?: React.CSSProperties }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" style={style}>
      <path d="M12 20h9"/>
      <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>
    </svg>
  );
}

/* 챌린지 탭 아이콘 (trophy) */
export function IconChallenge({ size = 24, style = {} }: { size?: number; style?: React.CSSProperties }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" style={style}>
      <path d="M6 9H3a1 1 0 000 2c0 3.3 2.7 6 6 6h1v2H8v2h8v-2h-2v-2h1c3.3 0 6-2.7 6-6a1 1 0 000-2h-3"/>
      <rect x="6" y="2" width="12" height="11" rx="2"/>
    </svg>
  );
}

/* 마이 탭 아이콘 */
export function IconUser({ size = 24, style = {} }: { size?: number; style?: React.CSSProperties }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" style={style}>
      <circle cx="12" cy="8" r="4"/>
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
    </svg>
  );
}

/* 인라인 유틸 아이콘들 */
export function IconBook({ size = 20, style = {} }: { size?: number; style?: React.CSSProperties }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" style={style}>
      <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/>
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
    </svg>
  );
}

export function IconCert({ size = 20, style = {} }: { size?: number; style?: React.CSSProperties }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" style={style}>
      <circle cx="12" cy="8" r="6"/>
      <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>
    </svg>
  );
}

export function IconLanguage({ size = 20, style = {} }: { size?: number; style?: React.CSSProperties }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" style={style}>
      <path d="M2 5h7 M9 3v2 M7 9A5 5 0 0012 14"/>
      <path d="M12 9a5 5 0 005 5"/>
      <path d="M15 15l3 6 M15 21l3-6"/>
      <path d="M22 15h-7"/>
    </svg>
  );
}

export function IconRun({ size = 20, style = {} }: { size?: number; style?: React.CSSProperties }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" style={style}>
      <circle cx="13" cy="4" r="1"/>
      <path d="M7 21l3-3.5 3 1 3.5-5.5"/>
      <path d="M5 15l2-4 4 2 3-5h4"/>
    </svg>
  );
}

export function IconChevronRight({ size = 20, style = {} }: { size?: number; style?: React.CSSProperties }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" style={style}>
      <path d="M9 18l6-6-6-6"/>
    </svg>
  );
}

export function IconCheck({ size = 20, style = {} }: { size?: number; style?: React.CSSProperties }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
      <path d="M20 6L9 17l-5-5"/>
    </svg>
  );
}

export function IconPlus({ size = 20, style = {} }: { size?: number; style?: React.CSSProperties }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={style}>
      <path d="M12 5v14M5 12h14"/>
    </svg>
  );
}

export function IconArrowLeft({ size = 20, style = {} }: { size?: number; style?: React.CSSProperties }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" style={style}>
      <path d="M19 12H5M12 19l-7-7 7-7"/>
    </svg>
  );
}

export function IconUpload({ size = 20, style = {} }: { size?: number; style?: React.CSSProperties }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" style={style}>
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
      <polyline points="17 8 12 3 7 8"/>
      <line x1="12" y1="3" x2="12" y2="15"/>
    </svg>
  );
}

export function MillogLogo({ size = 24 }: { size?: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <svg width={size} height={size} viewBox="0 0 40 40">
        <circle cx="20" cy="20" r="20" fill="var(--brand-500)"/>
        <path d="M10 26V14l6 6 6-6v12M22 26V14l6 6" fill="none" stroke="#ffffff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      <span style={{ fontFamily: 'var(--font-title)', fontWeight: 700, fontSize: size * 0.75, letterSpacing: '-0.01em', color: 'var(--text-primary)' }}>
        Millog
      </span>
    </div>
  );
}
