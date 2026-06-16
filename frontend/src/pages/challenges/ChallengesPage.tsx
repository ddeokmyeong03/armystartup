import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TabBar from '../../shared/components/TabBar';
import { IconPlus } from '../../shared/components/Icon';
import { apiGetChallenges, apiGetMyChallenges } from '../../shared/api/index';

type TabKey = 'explore' | 'mine';
const CATEGORIES = ['전체', '자격증', '어학', '독서', '운동'];

function judgmentLabel(type: string) {
  if (type === 'RANKING') return '랭킹';
  if (type === 'PASS_FAIL') return '합불';
  return '비경쟁';
}

function judgmentColor(type: string) {
  if (type === 'RANKING') return 'var(--brand-600)';
  if (type === 'PASS_FAIL') return 'var(--success)';
  return 'var(--info)';
}

function ChallengeCard({ ch, onClick }: { ch: any; onClick: () => void }) {
  return (
    <button className="challenge-card" style={{ width: '100%', textAlign: 'left', marginBottom: 10 }} onClick={onClick}>
      <div className="challenge-card-header">
        <div style={{ display: 'flex', gap: 6, marginBottom: 8, flexWrap: 'wrap' }}>
          <span className="chip" style={{ padding: '3px 10px', fontSize: 11 }}>{ch.category}</span>
          <span style={{ fontSize: 11, fontWeight: 600, color: judgmentColor(ch.judgmentType), background: 'var(--bg-subtle)', borderRadius: 6, padding: '3px 8px' }}>
            {judgmentLabel(ch.judgmentType)}
          </span>
          {ch.isRewarded && <span className="badge badge-ai" style={{ fontSize: 11 }}>보상형</span>}
        </div>
        <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', wordBreak: 'keep-all', marginBottom: 4 }}>{ch.title}</div>
        {ch.description && <div style={{ fontSize: 13, color: 'var(--text-secondary)', wordBreak: 'keep-all' }}>{ch.description}</div>}
      </div>
      <div className="challenge-card-footer">
        <div style={{ display: 'flex', gap: 12 }}>
          <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{ch.startDate} ~ {ch.endDate}</span>
        </div>
        <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
          {ch.participantCount ?? 0}명
          {ch.isRewarded && ch.entryFee > 0 && ` · 참가비 ${ch.entryFee.toLocaleString()}원`}
        </span>
      </div>
    </button>
  );
}

export default function ChallengesPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<TabKey>('explore');
  const [category, setCategory] = useState('전체');
  const [challenges, setChallenges] = useState<any[]>([]);
  const [mine, setMine] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (tab === 'explore') {
      setLoading(true);
      apiGetChallenges(category === '전체' ? undefined : category)
        .then(setChallenges).catch(() => setChallenges([]))
        .finally(() => setLoading(false));
    } else {
      setLoading(true);
      apiGetMyChallenges()
        .then(setMine).catch(() => setMine([]))
        .finally(() => setLoading(false));
    }
  }, [tab, category]);

  return (
    <div className="page page-enter">
      {/* 헤더 */}
      <div style={{ padding: '16px 20px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div className="t-h1">챌린지</div>
        <button className="btn-fab" style={{ width: 40, height: 40, borderRadius: 12 }} onClick={() => navigate('/challenges/new')} aria-label="챌린지 개설">
          <IconPlus size={20}/>
        </button>
      </div>

      {/* 탐색 / 내 챌린지 세그먼트 */}
      <div style={{ padding: '12px 20px 0', flexShrink: 0 }}>
        <div className="segmented">
          <button className={tab === 'explore' ? 'active' : ''} onClick={() => setTab('explore')}>탐색</button>
          <button className={tab === 'mine' ? 'active' : ''} onClick={() => setTab('mine')}>내 챌린지</button>
        </div>
      </div>

      {/* 카테고리 필터 (탐색 탭만) */}
      {tab === 'explore' && (
        <div style={{ padding: '10px 20px 0', display: 'flex', gap: 8, overflowX: 'auto', flexShrink: 0, scrollbarWidth: 'none' }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              className={`chip ${category === cat ? 'active' : ''}`}
              onClick={() => setCategory(cat)}
            >{cat}</button>
          ))}
        </div>
      )}

      <div className="scroll-area" style={{ padding: '12px 20px 24px' }}>
        {loading ? (
          <div style={{ padding: '48px 0', textAlign: 'center', color: 'var(--text-tertiary)', fontSize: 14 }}>불러오는 중…</div>
        ) : tab === 'explore' ? (
          challenges.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🏆</div>
              <div className="empty-state-title">진행 중인 챌린지가 없어요</div>
              <div className="empty-state-sub">직접 챌린지를 개설해보세요!</div>
              <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => navigate('/challenges/new')}>챌린지 개설</button>
            </div>
          ) : (
            challenges.map(ch => (
              <ChallengeCard key={ch.id} ch={ch} onClick={() => navigate(`/challenges/${ch.id}`)}/>
            ))
          )
        ) : (
          mine.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🚀</div>
              <div className="empty-state-title">참여 중인 챌린지가 없어요</div>
              <div className="empty-state-sub">탐색 탭에서 챌린지에 참여해보세요.</div>
              <button className="btn btn-secondary" style={{ marginTop: 16 }} onClick={() => setTab('explore')}>탐색하기</button>
            </div>
          ) : (
            mine.map(ch => (
              <ChallengeCard key={ch.id} ch={ch} onClick={() => navigate(`/challenges/${ch.id}`)}/>
            ))
          )
        )}
      </div>

      <TabBar/>
    </div>
  );
}
