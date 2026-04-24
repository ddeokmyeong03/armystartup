// page_profile.jsx — User profile
const ProfilePage = () => {
  const { goto } = useNav();
  const totalLearned = 42; // hours
  const currentStreak = 12;

  const weeklyData = [3.2, 4.1, 2.8, 5.4, 4.9, 6.2, 5.8];
  const maxH = Math.max(...weeklyData);

  return (
    <div className="page page-enter">
      <div className="page-gradient"/>
      <StatusSpacer/>
      <PageHeader title="프로필"
        right={<button style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--bg-surface-hi)', color: 'var(--text-base)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="more" size={18}/></button>}
      />

      <div className="scroll-area" style={{ padding: '4px 0 24px', position: 'relative', zIndex: 1 }}>
        {/* Identity card */}
        <div style={{ padding: '0 20px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{
              width: 80, height: 80, borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--accent), #0ec98a)',
              color: '#001f12',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--font-title)', fontWeight: 800, fontSize: 30,
              boxShadow: '0 10px 30px -10px var(--accent-glow)',
            }}>
              진
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="t-title" style={{ fontSize: 22 }}>{USER.rank} {USER.name}</div>
              <div className="t-subdued" style={{ marginTop: 4 }}>{USER.branch} · {USER.unit}</div>
              <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                <span className="chip" style={{ fontSize: 11, padding: '4px 10px' }}>D-{USER.dDay}</span>
                <span className="chip chip-outline" style={{ fontSize: 11, padding: '4px 10px' }}>입대 {USER.enlistedAt}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Service progress */}
        <div style={{ padding: '0 20px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <div className="t-caption">복무 진행</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent)' }}>{Math.round(USER.progress * 100)}%</div>
          </div>
          <div className="progress-track" style={{ height: 6 }}>
            <div className="progress-fill" style={{ width: `${USER.progress * 100}%` }}/>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 10, color: 'var(--text-subdued)' }}>
            <span>{USER.enlistedAt} 입대</span>
            <span>{USER.dischargeAt} 전역</span>
          </div>
        </div>

        {/* Stats tile row */}
        <div style={{ padding: '0 20px 20px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
          <StatTile value={totalLearned} unit="시간" label="누적 학습" color="var(--accent)"/>
          <StatTile value={currentStreak} unit="일" label="연속 학습" color="#f59e0b"/>
          <StatTile value={GOALS.length} unit="개" label="진행 목표" color="#8b5cf6"/>
        </div>

        {/* Weekly chart */}
        <div style={{ padding: '0 20px 20px' }}>
          <div className="card" style={{ padding: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div className="t-section" style={{ fontSize: 16 }}>이번 주 학습</div>
              <span style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 700 }}>+18% ↑</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 80 }}>
              {weeklyData.map((h, i) => (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                  <div style={{
                    width: '100%',
                    height: `${(h / maxH) * 100}%`,
                    background: i === 6 ? 'var(--accent)' : 'var(--bg-surface-hi)',
                    borderRadius: 4,
                    transition: 'height 400ms',
                    minHeight: 6,
                  }}/>
                  <div style={{ fontSize: 10, color: i === 6 ? 'var(--accent)' : 'var(--text-subdued)', fontWeight: i === 6 ? 800 : 500 }}>
                    {['월','화','수','목','금','토','일'][i]}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div style={{ padding: '0 20px 20px' }}>
          <div className="t-section" style={{ marginBottom: 10 }}>획득한 배지</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
            {[
              { emoji: '🔥', label: '7일 연속' },
              { emoji: '📚', label: '첫 강의' },
              { emoji: '🎯', label: '목표 달성' },
              { emoji: '🌱', label: '꾸준함' },
              { emoji: '⚡', label: '빠른 완료' },
              { emoji: '💎', label: '자격증 취득', locked: true },
              { emoji: '🏆', label: '마스터', locked: true },
              { emoji: '🎓', label: '졸업', locked: true },
            ].map((b, i) => (
              <div key={i} style={{
                background: b.locked ? 'transparent' : 'var(--bg-surface)',
                border: b.locked ? '1px dashed var(--border-default)' : '1px solid transparent',
                borderRadius: 12,
                padding: 12,
                textAlign: 'center',
                opacity: b.locked ? 0.45 : 1,
              }}>
                <div style={{ fontSize: 24, filter: b.locked ? 'grayscale(1)' : 'none' }}>{b.emoji}</div>
                <div style={{ fontSize: 10, color: 'var(--text-subdued)', marginTop: 4, fontWeight: 600 }}>{b.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 자기개발 설정 */}
        <div style={{ padding: '0 20px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <div className="t-section" style={{ fontSize: 16 }}>자기개발 설정</div>
            <button onClick={() => { window.__profileEditTab = 'interests'; goto('profile-edit'); }}
              style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent)', background: 'var(--accent-soft)', padding: '5px 12px', borderRadius: 9999 }}>
              수정
            </button>
          </div>
          <div className="card" style={{ padding: 14, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {[
              { label: '자격증', accent: '#8b5cf6' },
              { label: '어학',   accent: '#f59e0b' },
              { label: '개발/IT', accent: '#a855f7' },
            ].map(it => (
              <span key={it.label} className="chip" style={{ background: 'var(--bg-surface-hi)' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: it.accent, flexShrink: 0 }}/>
                {it.label}
              </span>
            ))}
          </div>
        </div>

        {/* Menu list */}
        <div style={{ padding: '0 20px' }}>
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            {[
              { icon: 'download',  label: '다운로드한 강의',       meta: '4개',  link: null },
              { icon: 'heart',     label: '찜한 강의',             meta: '12개', link: null },
              { icon: 'equalizer', label: '학습 통계 리포트',                    link: null },
              { icon: 'volume',    label: '알림',                               link: 'notifications' },
              { icon: 'devices',   label: '설정',                               link: 'settings' },
              { icon: 'library',   label: '데이터 및 피드백 공유', meta: 'ON', metaColor: 'var(--accent)', link: null },
            ].map((m, i, arr) => (
              <button key={i} onClick={() => m.link && goto(m.link)} style={{
                width: '100%', padding: '14px 16px',
                display: 'flex', alignItems: 'center', gap: 14,
                borderBottom: i < arr.length - 1 ? '1px solid var(--border-default)' : 'none',
                textAlign: 'left', color: 'var(--text-base)',
              }}>
                <Icon name={m.icon} size={20} style={{ color: 'var(--text-subdued)' }}/>
                <span style={{ flex: 1, fontSize: 14, fontWeight: 500 }}>{m.label}</span>
                {m.meta && <span style={{ fontSize: 12, color: m.metaColor || 'var(--text-subdued)', fontWeight: m.metaColor ? 700 : 400 }}>{m.meta}</span>}
                <Icon name="chevron-right" size={16} style={{ color: 'var(--text-subdued)' }}/>
              </button>
            ))}
          </div>
        </div>

        {/* 프로필 수정 버튼 */}
        <div style={{ padding: '16px 20px 0' }}>
          <button className="btn btn-ghost btn-full" style={{ height: 48 }}
            onClick={() => { window.__profileEditTab = 'profile'; goto('profile-edit'); }}>
            <IconUser size={16}/> 프로필 수정
          </button>
        </div>

        <div style={{ padding: '16px 20px 0', textAlign: 'center' }}>
          <button onClick={() => goto('login')} style={{ fontSize: 13, color: 'var(--text-subdued)', padding: '8px 16px' }}>
            로그아웃
          </button>
          <div className="t-caption" style={{ marginTop: 8 }}>Millog · v1.0.0</div>
        </div>
      </div>
    </div>
  );
};

function StatTile({ value, unit, label, color }) {
  return (
    <div className="card" style={{ padding: 14 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 3 }}>
        <span style={{ fontFamily: 'var(--font-title)', fontSize: 26, fontWeight: 800, color, letterSpacing: '-0.02em' }}>{value}</span>
        <span style={{ fontSize: 11, color: 'var(--text-subdued)', fontWeight: 600 }}>{unit}</span>
      </div>
      <div style={{ fontSize: 11, color: 'var(--text-subdued)', marginTop: 4, fontWeight: 600 }}>{label}</div>
    </div>
  );
}

Object.assign(window, { ProfilePage });
