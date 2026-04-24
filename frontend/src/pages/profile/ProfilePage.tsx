import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TabBar from '../../shared/components/TabBar';
import PageHeader from '../../shared/components/PageHeader';
import { Icon, IconUser } from '../../shared/components/Icon';
import { apiGetMe, apiGetProfile, apiGetGoals } from '../../shared/api/index';

function logout2() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('nickname');
  localStorage.removeItem('userInfo');
}

export default function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [goals, setGoals] = useState<any[]>([]);
  const [, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      apiGetMe().catch(() => null),
      apiGetProfile().catch(() => null),
      apiGetGoals().catch(() => []),
    ]).then(([u, p, g]) => { setUser(u); setProfile(p); setGoals(g as any[]); })
      .finally(() => setLoading(false));
  }, []);

  const nickname = user?.nickname ?? localStorage.getItem('nickname') ?? '장병';
  const rank = profile?.rankName ?? '';
  const branch = profile?.branch ?? '';
  const unit = profile?.unitName ?? '';
  const enlistedAt = profile?.enlistedAt ?? '';
  const dischargeDate = profile?.dischargeDate ?? '';
  const dDay = dischargeDate ? Math.ceil((new Date(dischargeDate).getTime() - Date.now()) / 86400000) : null;
  const progress = (enlistedAt && dischargeDate)
    ? Math.max(0, Math.min(1, (Date.now() - new Date(enlistedAt).getTime()) / (new Date(dischargeDate).getTime() - new Date(enlistedAt).getTime())))
    : 0;

  const interests: string[] = (() => {
    try { return JSON.parse(profile?.interests || '[]'); } catch { return []; }
  })();

  const interestColors: Record<string, string> = {
    cert: '#8b5cf6', lang: '#f59e0b', job: '#10b981', hobby: '#ef4444',
    read: '#3b82f6', health: '#06b6d4', finance: '#22FFB2', it: '#a855f7',
  };
  const interestLabels: Record<string, string> = {
    cert: '자격증', lang: '어학', job: '취업/진로', hobby: '취미',
    read: '독서', health: '체력', finance: '금융/재테크', it: '개발/IT',
  };

  return (
    <div className="page page-enter">
      <div className="page-gradient"/>
      <div style={{ height: 8 }}/>
      <PageHeader title="프로필"/>

      <div className="scroll-area" style={{ padding: '4px 0 24px', position: 'relative', zIndex: 1 }}>
        {/* 신원 카드 */}
        <div style={{ padding: '0 20px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent), #0ec98a)', color: '#001f12', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-title)', fontWeight: 800, fontSize: 30, boxShadow: '0 10px 30px -10px var(--accent-glow)', flexShrink: 0 }}>
              {nickname[0]}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="t-title" style={{ fontSize: 22 }}>{rank} {nickname}</div>
              <div className="t-subdued" style={{ marginTop: 4 }}>{branch}{unit ? ` · ${unit}` : ''}</div>
              <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
                {dDay !== null && <span className="chip" style={{ fontSize: 11, padding: '4px 10px' }}>D-{dDay}</span>}
                {enlistedAt && <span className="chip chip-outline" style={{ fontSize: 11, padding: '4px 10px' }}>입대 {enlistedAt}</span>}
              </div>
            </div>
          </div>
        </div>

        {/* 복무 진행 */}
        {(enlistedAt && dischargeDate) && (
          <div style={{ padding: '0 20px 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <div className="t-caption">복무 진행</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent)' }}>{Math.round(progress * 100)}%</div>
            </div>
            <div className="progress-track" style={{ height: 6 }}>
              <div className="progress-fill" style={{ width: `${progress * 100}%` }}/>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 10, color: 'var(--text-subdued)' }}>
              <span>{enlistedAt} 입대</span>
              <span>{dischargeDate} 전역</span>
            </div>
          </div>
        )}

        {/* 통계 */}
        <div style={{ padding: '0 20px 20px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
          <StatTile value={goals.length} unit="개" label="진행 목표" color="#8b5cf6"/>
          <StatTile value={goals.filter(g => g.progressPercent >= 100).length} unit="개" label="달성 목표" color="var(--accent)"/>
          <StatTile value={goals.length > 0 ? Math.round(goals.reduce((s: number, g: any) => s + g.progressPercent, 0) / goals.length) : 0} unit="%" label="평균 진행" color="#f59e0b"/>
        </div>

        {/* 자기개발 설정 */}
        <div style={{ padding: '0 20px 20px' }}>
          <div className="t-section" style={{ fontSize: 16, marginBottom: 10 }}>자기개발 설정</div>
          <div className="card" style={{ padding: 14, position: 'relative', minHeight: 56 }}>
            <button onClick={() => navigate('/profile/edit', { state: { tab: 'interests' } })}
              style={{ position: 'absolute', top: 10, right: 12, fontSize: 11, fontWeight: 700, color: 'var(--accent)', background: 'var(--accent-soft)', padding: '4px 10px', borderRadius: 9999 }}>
              수정
            </button>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, paddingRight: 52, marginTop: 2 }}>
              {interests.length === 0 ? (
                <span className="t-subdued" style={{ fontSize: 12 }}>아직 설정된 관심 분야가 없습니다</span>
              ) : interests.map(id => (
                <span key={id} className="chip" style={{ background: 'var(--bg-surface-hi)' }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: interestColors[id] ?? '#6b7280', flexShrink: 0 }}/>
                  {interestLabels[id] ?? id}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* 메뉴 */}
        <div style={{ padding: '0 20px' }}>
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            {[
              { icon: 'volume',    label: '알림',     link: '/notifications' },
              { icon: 'equalizer', label: '설정',     link: '/settings' },
            ].map((m, i, arr) => (
              <button key={i} onClick={() => m.link && navigate(m.link)} style={{
                width: '100%', padding: '14px 16px',
                display: 'flex', alignItems: 'center', gap: 14,
                borderBottom: i < arr.length - 1 ? '1px solid var(--border-default)' : 'none',
                textAlign: 'left', color: 'var(--text-base)',
              }}>
                <Icon name={m.icon} size={20} style={{ color: 'var(--text-subdued)' }}/>
                <span style={{ flex: 1, fontSize: 14, fontWeight: 500 }}>{m.label}</span>
                <Icon name="chevron-right" size={16} style={{ color: 'var(--text-subdued)' }}/>
              </button>
            ))}
          </div>
        </div>

        {/* 프로필 수정 버튼 */}
        <div style={{ padding: '16px 20px 0' }}>
          <button className="btn btn-ghost btn-full" style={{ height: 48 }}
            onClick={() => navigate('/profile/edit', { state: { tab: 'profile' } })}>
            <IconUser size={16}/> 프로필 수정
          </button>
        </div>

        <div style={{ padding: '16px 20px 0', textAlign: 'center' }}>
          <button onClick={() => { logout2(); navigate('/login'); }}
            style={{ fontSize: 13, color: 'var(--text-subdued)', padding: '8px 16px' }}>
            로그아웃
          </button>
          <div className="t-caption" style={{ marginTop: 8 }}>Millog · v2.0.0</div>
        </div>
      </div>

      <TabBar/>
    </div>
  );
}

function StatTile({ value, unit, label, color }: { value: number; unit: string; label: string; color: string }) {
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
