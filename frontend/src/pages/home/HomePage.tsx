import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TabBar from '../../shared/components/TabBar';
import PageHeader from '../../shared/components/PageHeader';
import { IconCert, IconLanguage, IconBook, IconRun, IconChallenge } from '../../shared/components/Icon';
import { apiGetHome } from '../../shared/api/index';

const CATEGORIES = [
  { key: '자격증', icon: <IconCert size={18}/>, color: 'var(--brand-500)' },
  { key: '어학',   icon: <IconLanguage size={18}/>, color: 'var(--info)' },
  { key: '독서',   icon: <IconBook size={18}/>, color: 'var(--warning)' },
  { key: '운동',   icon: <IconRun size={18}/>, color: 'var(--danger)' },
];

function dDay(dischargeDate?: string): number | null {
  if (!dischargeDate) return null;
  return Math.ceil((new Date(dischargeDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
}

export default function HomePage() {
  const navigate = useNavigate();
  const [homeData, setHomeData] = useState<any>(null);

  useEffect(() => {
    apiGetHome().then(setHomeData).catch(() => {});
  }, []);

  const nickname = homeData?.nickname ?? localStorage.getItem('nickname') ?? '장병';
  const profile = homeData?.profile;
  const dDayNum = dDay(profile?.dischargeDate);
  const recordStats: Record<string, number> = homeData?.recordStats ?? {};
  const totalRecords: number = Object.values(recordStats).reduce((a: number, b) => a + (b as number), 0);
  const activeChallenges: any[] = homeData?.activeChallenges ?? [];

  return (
    <div className="page page-enter">
      <div className="page-gradient"/>

      <PageHeader
        title={`안녕하세요, ${nickname}`}
        subtitle={
          profile
            ? [profile.branch, profile.rankName, dDayNum != null ? `전역 D-${dDayNum}` : null]
                .filter(Boolean).join(' · ')
            : undefined
        }
        right={
          <button
            onClick={() => navigate('/my')}
            style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--brand-50)', color: 'var(--brand-700)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13, border: '1px solid var(--brand-200)' }}
            aria-label="마이 페이지"
          >
            {nickname[0]}
          </button>
        }
      />

      <div className="scroll-area" style={{ padding: '4px 0 24px', position: 'relative', zIndex: 1 }}>

        {/* 목표 진척 요약 */}
        {profile?.goal && (
          <div style={{ padding: '0 20px', marginBottom: 16 }}>
            <div className="card" style={{ borderLeft: '3px solid var(--brand-500)' }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--brand-600)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>나의 목표</div>
              <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', wordBreak: 'keep-all' }}>{profile.goal}</div>
              {dDayNum != null && (
                <div style={{ marginTop: 8, fontSize: 13, color: 'var(--text-secondary)' }}>
                  전역까지 <strong style={{ color: 'var(--brand-600)' }}>D-{dDayNum}</strong>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 누적 기록 요약 */}
        <div style={{ padding: '0 20px', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div className="t-h3">누적 기록</div>
            <button onClick={() => navigate('/records')} style={{ fontSize: 13, fontWeight: 600, color: 'var(--brand-600)' }}>
              전체 보기
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div className="metric-card" style={{ gridColumn: '1 / -1' }}>
              <div className="metric-label">총 기록 수</div>
              <div className="metric-value">{totalRecords.toLocaleString()}</div>
              <div className="metric-sub">누적 자기계발 기록</div>
            </div>
            {CATEGORIES.map(cat => (
              <button
                key={cat.key}
                className="metric-card"
                style={{ textAlign: 'left', cursor: 'pointer' }}
                onClick={() => navigate(`/records?category=${encodeURIComponent(cat.key)}`)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                  <span style={{ color: cat.color }}>{cat.icon}</span>
                  <span className="metric-label" style={{ color: 'var(--text-secondary)' }}>{cat.key}</span>
                </div>
                <div className="metric-value" style={{ fontSize: 20 }}>{(recordStats[cat.key] ?? 0).toLocaleString()}</div>
              </button>
            ))}
          </div>
        </div>

        {/* 진행 중 챌린지 */}
        <div style={{ padding: '0 20px', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div className="t-h3">참여 중인 챌린지</div>
            <button onClick={() => navigate('/challenges')} style={{ fontSize: 13, fontWeight: 600, color: 'var(--brand-600)' }}>
              전체 보기
            </button>
          </div>

          {activeChallenges.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '24px 16px' }}>
              <IconChallenge size={32} style={{ color: 'var(--gray-300)', marginBottom: 8 }}/>
              <div style={{ fontSize: 14, color: 'var(--text-secondary)', wordBreak: 'keep-all' }}>
                참여 중인 챌린지가 없습니다.
              </div>
              <button className="btn btn-primary" style={{ marginTop: 14, height: 40, fontSize: 14 }} onClick={() => navigate('/challenges')}>
                챌린지 탐색
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {activeChallenges.map((ch: any) => (
                <button
                  key={ch.id}
                  className="challenge-card"
                  style={{ width: '100%', textAlign: 'left' }}
                  onClick={() => navigate(`/challenges/${ch.id}`)}
                >
                  <div className="challenge-card-header">
                    <div style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
                      <span className="chip" style={{ padding: '3px 10px', fontSize: 11 }}>{ch.category}</span>
                      {ch.isRewarded && <span className="badge badge-ai">보상형</span>}
                    </div>
                    <div className="t-h3" style={{ fontWeight: 600, fontSize: 15 }}>{ch.title}</div>
                  </div>
                  <div className="challenge-card-footer">
                    <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{ch.endDate}까지</span>
                    <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{ch.participantCount}명 참여 중</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 기록 추가 CTA */}
        <div style={{ padding: '0 20px' }}>
          <button className="btn btn-primary btn-full" onClick={() => navigate('/records/new')}>
            + 오늘의 자기계발 기록하기
          </button>
        </div>

      </div>

      <TabBar/>
    </div>
  );
}
