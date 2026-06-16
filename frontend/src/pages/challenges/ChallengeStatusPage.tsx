import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { IconArrowLeft, IconCheck } from '../../shared/components/Icon';
import { apiGetChallengeParticipants } from '../../shared/api/index';

export default function ChallengeStatusPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [participants, setParticipants] = useState<any[]>([]);
  const [challengeInfo, setChallengeInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    apiGetChallengeParticipants(Number(id))
      .then(res => { setParticipants(res.participants ?? []); setChallengeInfo(res.challenge); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const judgeType = challengeInfo?.judgmentType;

  return (
    <div className="page page-enter">
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '16px 20px', flexShrink: 0, borderBottom: '1px solid var(--border)' }}>
        <button onClick={() => navigate(-1)} style={{ padding: 4 }} aria-label="뒤로">
          <IconArrowLeft size={22} style={{ color: 'var(--text-primary)' }}/>
        </button>
        <div className="t-h2" style={{ flex: 1 }}>참여 현황</div>
      </div>

      <div className="scroll-area" style={{ padding: '16px 20px 24px' }}>
        {loading ? (
          <div style={{ padding: '48px 0', textAlign: 'center', color: 'var(--text-tertiary)', fontSize: 14 }}>불러오는 중…</div>
        ) : participants.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">👥</div>
            <div className="empty-state-title">아직 참여자가 없어요</div>
          </div>
        ) : (
          <div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 12 }}>
              {participants.length}명 참여 중
            </div>
            {participants.map((p: any, i: number) => (
              <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                {judgeType === 'RANKING' && (
                  <div style={{ width: 28, textAlign: 'center', fontSize: 14, fontWeight: 700, color: i < 3 ? 'var(--brand-600)' : 'var(--text-tertiary)', flexShrink: 0 }}>
                    {p.rank ?? i + 1}
                  </div>
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>{p.nickname ?? '익명'}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 2 }}>{p.joinedAt?.slice(0, 10)} 참여</div>
                </div>
                <div>
                  {p.status === 'SUBMITTED' || p.status === 'JUDGED' || p.status === 'REWARDED' ? (
                    <span className="badge badge-verified"><IconCheck size={9}/>제출 완료</span>
                  ) : (
                    <span className="badge badge-self">참여 중</span>
                  )}
                  {judgeType === 'PASS_FAIL' && p.status === 'JUDGED' && (
                    <span className={`badge ${p.passed ? 'badge-verified' : 'badge-self'}`} style={{ marginLeft: 4 }}>
                      {p.passed ? '합격' : '불합격'}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
