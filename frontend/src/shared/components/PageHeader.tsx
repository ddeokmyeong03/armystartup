import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from './Icon';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  showBack?: boolean;
}

export default function PageHeader({ title, subtitle, right, showBack }: PageHeaderProps) {
  const navigate = useNavigate();
  return (
    <div style={{ padding: '8px 20px 10px', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0, position: 'relative', zIndex: 1 }}>
      {showBack && (
        <button
          onClick={() => navigate(-1)}
          style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--bg-surface-hi)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-base)' }}
        >
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
