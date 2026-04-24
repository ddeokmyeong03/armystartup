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

export function IconGoal({ size = 20, style = {} }: { size?: number; style?: React.CSSProperties }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={style}>
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.6"/>
      <circle cx="12" cy="12" r="5.5" fill="none" stroke="currentColor" strokeWidth="1.6"/>
      <circle cx="12" cy="12" r="2" fill="currentColor"/>
    </svg>
  );
}

export function IconMap({ size = 20, style = {} }: { size?: number; style?: React.CSSProperties }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={style}>
      <path fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
        d="M4 6l5-2 6 2 5-2v14l-5 2-6-2-5 2V6z M9 4v16 M15 6v16"/>
    </svg>
  );
}

export function IconBook({ size = 20, style = {} }: { size?: number; style?: React.CSSProperties }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={style}>
      <path fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"
        d="M4 5a1 1 0 011-1h5a3 3 0 013 3v13a2 2 0 00-2-2H4V5z M20 5a1 1 0 00-1-1h-5a3 3 0 00-3 3v13a2 2 0 012-2h7V5z"/>
    </svg>
  );
}

export function IconUser({ size = 20, style = {} }: { size?: number; style?: React.CSSProperties }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={style}>
      <circle cx="12" cy="8" r="4" fill="currentColor"/>
      <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" fill="currentColor"/>
    </svg>
  );
}

export function IconClock({ size = 20, style = {} }: { size?: number; style?: React.CSSProperties }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={style}>
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.6"/>
      <path d="M12 7v5l3 2" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  );
}

export function IconSparkle({ size = 20, style = {} }: { size?: number; style?: React.CSSProperties }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={style}>
      <path fill="currentColor" d="M12 2l1.7 6.3L20 10l-6.3 1.7L12 18l-1.7-6.3L4 10l6.3-1.7z"/>
      <path fill="currentColor" d="M19 15l.7 2.3L22 18l-2.3.7L19 21l-.7-2.3L16 18l2.3-.7z"/>
    </svg>
  );
}

export function MillogLogo({ size = 24 }: { size?: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <svg width={size} height={size} viewBox="0 0 40 40">
        <circle cx="20" cy="20" r="20" fill="var(--accent)"/>
        <path d="M10 26V14l6 6 6-6v12M22 26V14l6 6" fill="none" stroke="#001f12" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      <span style={{ fontFamily: 'var(--font-title)', fontWeight: 800, fontSize: size * 0.75, letterSpacing: '-0.02em', color: 'var(--text-bright)' }}>
        Millog
      </span>
    </div>
  );
}
