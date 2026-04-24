import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../shared/components/PageHeader';
import { apiGetNotifications, apiMarkAllNotificationsRead, apiMarkNotificationRead } from '../../shared/api/index';
import type { NotificationItem } from '../../shared/api/index';

const TYPE_COLOR: Record<string, string> = {
  goal:     '#8b5cf6', GOAL:     '#8b5cf6',
  ai:       'var(--accent)', AI: 'var(--accent)',
  schedule: '#f59e0b', SCHEDULE: '#f59e0b',
  course:   '#3b82f6', COURSE:   '#3b82f6',
  system:   '#10b981', SYSTEM:   '#10b981',
};

const TYPE_EMOJI: Record<string, string> = {
  goal: '🎯', GOAL: '🎯',
  ai: '🤖', AI: '🤖',
  schedule: '📅', SCHEDULE: '📅',
  course: '📚', COURSE: '📚',
  system: '⚡', SYSTEM: '⚡',
};

const PAGE_PATH: Record<string, string> = {
  goals: '/goals', roadmap: '/roadmap', courses: '/courses', profile: '/profile', home: '/',
};

export default function NotificationsPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGetNotifications()
      .then(d => { setItems(d.items ?? []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const unreadCount = items.filter(n => !n.isRead).length;

  const markAllRead = async () => {
    await apiMarkAllNotificationsRead().catch(() => {});
    setItems(ns => ns.map(n => ({ ...n, isRead: true })));
  };

  const handleTap = async (n: NotificationItem) => {
    if (!n.isRead) {
      await apiMarkNotificationRead(n.id).catch(() => {});
      setItems(ns => ns.map(x => x.id === n.id ? { ...x, isRead: true } : x));
    }
    if (n.link && PAGE_PATH[n.link]) navigate(PAGE_PATH[n.link]);
  };

  return (
    <div className="page page-enter" style={{ display: 'flex', flexDirection: 'column', position: 'fixed', inset: 0 }}>
      <div className="page-gradient"/>
      <div style={{ height: 8, flexShrink: 0 }}/>
      <PageHeader
        title="알림"
        subtitle={unreadCount > 0 ? `읽지 않은 알림 ${unreadCount}개` : '모두 확인했습니다'}
        showBack
        right={unreadCount > 0 ? (
          <button onClick={markAllRead} style={{ color: 'var(--accent)', fontSize: 13, fontWeight: 700 }}>
            모두 읽음
          </button>
        ) : undefined}
      />

      <div className="scroll-area" style={{ padding: '0 0 24px', position: 'relative', zIndex: 1 }}>
        {loading && <div className="t-subdued" style={{ textAlign: 'center', padding: 40 }}>불러오는 중...</div>}

        {!loading && items.length === 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 280, gap: 14 }}>
            <div style={{ fontSize: 52 }}>🔔</div>
            <div className="t-subdued">새로운 알림이 없습니다</div>
          </div>
        )}

        {items.map((n) => (
          <div key={n.id} onClick={() => handleTap(n)} style={{
            display: 'flex', gap: 12, padding: '14px 20px',
            background: !n.isRead ? 'var(--accent-soft)' : 'transparent',
            borderBottom: '1px solid var(--border-default)',
            cursor: n.link ? 'pointer' : 'default', position: 'relative',
            transition: 'background 150ms ease-out',
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: '50%', flexShrink: 0,
              background: 'var(--bg-surface)',
              border: `2px solid ${TYPE_COLOR[n.type] ?? 'var(--border-default)'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
            }}>
              {TYPE_EMOJI[n.type] ?? '🔔'}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                <div style={{ fontSize: 14, fontWeight: !n.isRead ? 700 : 600, color: 'var(--text-bright)', lineHeight: 1.3 }}>
                  {n.title}
                </div>
                <div className="t-caption" style={{ flexShrink: 0, whiteSpace: 'nowrap' }}>
                  {new Date(n.createdAt).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })}
                </div>
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-subdued)', marginTop: 4, lineHeight: 1.5 }}>{n.body}</div>
              {n.link && <div style={{ marginTop: 6, fontSize: 11, color: 'var(--accent)', fontWeight: 700 }}>바로가기 →</div>}
            </div>
            {!n.isRead && (
              <div style={{
                position: 'absolute', right: 20, top: '50%', transform: 'translateY(-50%)',
                width: 8, height: 8, borderRadius: '50%', background: 'var(--accent)',
              }}/>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
