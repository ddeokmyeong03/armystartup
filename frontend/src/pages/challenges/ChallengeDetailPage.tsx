import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { IconArrowLeft, IconCheck } from '../../shared/components/Icon';
import { apiGetChallenge, apiJoinChallenge } from '../../shared/api/index';

function judgmentLabel(type: string) {
  if (type === 'RANKING') return '랭킹형';
  if (type === 'PASS_FAIL') return '합불형';
  return '비경쟁형';
}

export default function ChallengeDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [challenge, setChallenge] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);

  useEffect(() => {
    if (!id) return;
    apiGetChallenge(Number(id))
      .then(setChallenge)
      .catch(() => navigate('/challenges', { replace: true }))
      .finally(() => setLoading(false));
  }, [id]);

  const handleJoin = () => {
    if (challenge?.isRewarded && challenge?.entryFee > 0) {
      navigate(`/challenges/${id}/join`);
    } else {
      setJoining(true);
      apiJoinChallenge(Number(id))
        .then(() => { setChallenge((p: any) => ({ ...p, myParticipation: { status: 'JOINED' } })); })
        .catch(() => alert('참여에 실패했습니다.'))
        .finally(() => setJoining(false));
    }
  };

  if (loading) return (
    <div className="page" style={{ alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: 'var(--text-tertiary)' }}>불러오는 중…</div>
    </div>
  );
  if (!challenge) return null;

  const joined = !!challenge.myParticipation;
  const submitted = challenge.myParticipation?.status === 'SUBMITTED';

  return (
    <div className="page page-enter">
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '16px 20px', flexShrink: 0, borderBottom: '1px solid var(--border)' }}>
        <button onClick={() => navigate(-1)} style={{ padding: 4 }} aria-label="뒤로">
          <IconArrowLeft size={22} style={{ color: 'var(--text-primary)' }}/>
        </button>
        <div className="t-h2" style={{ flex: 1 }}>챌린지 상세</div>
      </div>

      <div className="scroll-area" style={{ padding: '20px' }}>
        {/* 뱃지 */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
          <span className="chip" style={{ padding: '4px 12px', fontSize: 12 }}>{challenge.category}</span>
          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--brand-600)', background: 'var(--brand-50)', borderRadius: 8, padding: '4px 10px' }}>
            {judgmentLabel(challenge.judgmentType)}
          </span>
          {challenge.isRewarded && <span className="badge badge-ai">보상형</span>}
        </div>

        <div className="t-h1" style={{ marginBottom: 8, wordBreak: 'keep-all' }}>{challenge.title}</div>

        {challenge.description && (
          <div style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.65, marginBottom: 20, wordBreak: 'keep-all' }}>
            {challenge.description}
          </div>
        )}

        {/* 메트릭 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
          <div className="metric-card">
            <div className="metric-label">기간</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginTop: 2 }}>
              {challenge.startDate}<br/>~ {challenge.endDate}
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-label">참여 인원</div>
            <div className="metric-value" style={{ fontSize: 22 }}>{challenge.participantCount ?? 0}</div>
            <div className="metric-sub">
              {challenge.maxParticipants ? `최대 ${challenge.maxParticipants}명` : '제한 없음'}
            </div>
          </div>
          {challenge.isRewarded && (
            <>
              <div className="metric-card">
                <div className="metric-label">참가비</div>
                <div className="metric-value" style={{ fontSize: 18 }}>
                  {challenge.entryFee > 0 ? `${challenge.entryFee.toLocaleString()}원` : '무료'}
                </div>
              </div>
              <div className="metric-card">
                <div className="metric-label">상금</div>
                <div className="metric-value" style={{ fontSize: 18, color: 'var(--brand-600)' }}>
                  {challenge.prizeMoney > 0 ? `${challenge.prizeMoney.toLocaleString()}원` : '—'}
                </div>
              </div>
            </>
          )}
        </div>

        {/* 현황 / 제출 링크 */}
        {joined && (
          <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
            <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => navigate(`/challenges/${id}/status`)}>
              참여 현황
            </button>
            {!submitted && (
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => navigate(`/challenges/${id}/submit`)}>
                판정 제출
              </button>
            )}
          </div>
        )}
      </div>

      {/* 하단 CTA */}
      {!joined && (
        <div style={{ padding: '12px 20px', borderTop: '1px solid var(--border)', background: 'var(--bg-elevated)', flexShrink: 0 }}>
          {challenge.isRewarded && challenge.entryFee > 0 && (
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', textAlign: 'center', marginBottom: 8 }}>
              참가비 {challenge.entryFee.toLocaleString()}원 결제 후 참여 확정
            </div>
          )}
          <button className="btn btn-primary btn-full" onClick={handleJoin} disabled={joining}>
            {joining ? '참여 중…' : (challenge.isRewarded && challenge.entryFee > 0 ? `결제하고 참여하기` : '참여하기')}
          </button>
        </div>
      )}

      {joined && (
        <div style={{ padding: '12px 20px', borderTop: '1px solid var(--border)', background: 'var(--bg-elevated)', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
            <IconCheck size={16} style={{ color: 'var(--success)' }}/>
            <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--success)' }}>이미 참여 중입니다</span>
          </div>
        </div>
      )}
    </div>
  );
}
