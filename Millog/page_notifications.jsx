// page_notifications.jsx — 알림 목록
const NotificationsPage = () => {
  const { goto } = useNav();
  const [items, setItems] = useState([
    {
      id: 'n1', type: 'goal',
      icon: '🎯', title: '정보처리기사 필기 D-23',
      body: '마감일이 다가오고 있어요. 오늘 모의고사 1회 도전해볼까요?',
      time: '10분 전', unread: true, link: 'goals',
    },
    {
      id: 'n2', type: 'ai',
      icon: '🤖', title: 'AI 코치 메시지',
      body: '어제 학습 피드백: RC 파트5 정답률 72% → 82%로 올랐어요! 이대로 가면 목표 달성 가능합니다.',
      time: '1시간 전', unread: true, link: 'roadmap',
    },
    {
      id: 'n3', type: 'schedule',
      icon: '📅', title: '오늘 일정 알림',
      body: '22:00 불침번 1번초가 2시간 남았습니다.',
      time: '2시간 전', unread: false, link: null,
    },
    {
      id: 'n4', type: 'course',
      icon: '📚', title: '새 강의 추천',
      body: '로드맵 W3에 맞는 강의가 추가됐어요: "데이터베이스 정규화 심화"',
      time: '어제', unread: false, link: 'courses',
    },
    {
      id: 'n5', type: 'goal',
      icon: '🏆', title: '목표 진행 리마인더',
      body: 'TOEIC 850점 목표의 주간 진행이 예상보다 느려요. 일정을 조정해볼까요?',
      time: '어제', unread: false, link: 'goals',
    },
    {
      id: 'n6', type: 'system',
      icon: '⚡', title: '연속 학습 12일 달성!',
      body: '대단해요! 12일 연속 학습을 이어가고 있어요. 새 배지를 획득했습니다.',
      time: '2일 전', unread: false, link: 'profile',
    },
    {
      id: 'n7', type: 'schedule',
      icon: '🗓️', title: '주간 일정 업데이트',
      body: '이번 주 가용시간이 평균보다 2.3시간 많아요. 추가 학습 기회예요!',
      time: '2일 전', unread: false, link: 'home',
    },
  ]);

  const unreadCount = items.filter(n => n.unread).length;

  const markAllRead = () => setItems(ns => ns.map(n => ({ ...n, unread: false })));
  const dismiss = (id) => setItems(ns => ns.filter(n => n.id !== id));
  const markRead = (id) => setItems(ns => ns.map(n => n.id === id ? { ...n, unread: false } : n));

  const typeColor = {
    goal:     '#8b5cf6',
    ai:       'var(--accent)',
    schedule: '#f59e0b',
    course:   '#3b82f6',
    system:   '#10b981',
  };

  const handleTap = (n) => {
    markRead(n.id);
    if (n.link) goto(n.link);
  };

  return (
    <div className="page page-enter">
      <div className="page-gradient"/>
      <StatusSpacer/>
      <PageHeader
        title="알림"
        subtitle={unreadCount > 0 ? `읽지 않은 알림 ${unreadCount}개` : '모두 확인했습니다'}
        showBack
        right={
          unreadCount > 0 ? (
            <button onClick={markAllRead} style={{ color: 'var(--accent)', fontSize: 13, fontWeight: 700 }}>
              모두 읽음
            </button>
          ) : null
        }
      />

      <div className="scroll-area" style={{ padding: '0 0 24px', position: 'relative', zIndex: 1 }}>
        {items.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 280, gap: 14 }}>
            <div style={{ fontSize: 52 }}>🔔</div>
            <div className="t-subdued">새로운 알림이 없습니다</div>
          </div>
        ) : (
          items.map((n, i) => (
            <div key={n.id} onClick={() => handleTap(n)} style={{
              display: 'flex', gap: 12,
              padding: '14px 20px',
              background: n.unread ? 'var(--accent-soft)' : 'transparent',
              borderBottom: '1px solid var(--border-default)',
              cursor: n.link ? 'pointer' : 'default',
              position: 'relative',
              transition: 'background 150ms ease-out',
            }}>
              {/* 아이콘 */}
              <div style={{
                width: 44, height: 44, borderRadius: '50%', flexShrink: 0,
                background: 'var(--bg-surface)',
                border: `2px solid ${typeColor[n.type]}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 20,
              }}>
                {n.icon}
              </div>

              {/* 내용 */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                  <div style={{ fontSize: 14, fontWeight: n.unread ? 700 : 600, color: 'var(--text-bright)', lineHeight: 1.3 }}>
                    {n.title}
                  </div>
                  <div className="t-caption" style={{ flexShrink: 0, whiteSpace: 'nowrap' }}>{n.time}</div>
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-subdued)', marginTop: 4, lineHeight: 1.5 }}>
                  {n.body}
                </div>
                {n.link && (
                  <div style={{ marginTop: 6, fontSize: 11, color: 'var(--accent)', fontWeight: 700 }}>
                    바로가기 →
                  </div>
                )}
              </div>

              {/* 미읽음 표시 */}
              {n.unread && (
                <div style={{
                  position: 'absolute', right: 20, top: '50%', transform: 'translateY(-50%)',
                  width: 8, height: 8, borderRadius: '50%', background: 'var(--accent)',
                }}/>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

Object.assign(window, { NotificationsPage });
