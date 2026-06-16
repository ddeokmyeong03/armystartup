import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { IconArrowLeft } from '../../shared/components/Icon';
import { apiGetChallenge, apiJoinChallenge } from '../../shared/api/index';

export default function ChallengeJoinPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [challenge, setChallenge] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [agreePay, setAgreePay] = useState(false);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (!id) return;
    apiGetChallenge(Number(id)).then(setChallenge).catch(() => navigate(-1)).finally(() => setLoading(false));
  }, [id]);

  const handlePayAndJoin = async () => {
    if (!agreePay) return;
    setProcessing(true);
    try {
      // TODO: 실제 결제 연동 (앱인토스 인앱결제)
      await apiJoinChallenge(Number(id));
      navigate(`/challenges/${id}`, { replace: true });
    } catch {
      alert('참여 처리에 실패했습니다. 다시 시도해주세요.');
      setProcessing(false);
    }
  };

  if (loading || !challenge) return (
    <div className="page" style={{ alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: 'var(--text-tertiary)' }}>불러오는 중…</div>
    </div>
  );

  return (
    <div className="page page-enter">
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '16px 20px', flexShrink: 0, borderBottom: '1px solid var(--border)' }}>
        <button onClick={() => navigate(-1)} style={{ padding: 4 }} aria-label="뒤로">
          <IconArrowLeft size={22} style={{ color: 'var(--text-primary)' }}/>
        </button>
        <div className="t-h2" style={{ flex: 1 }}>챌린지 참여하기 ★</div>
      </div>

      <div className="scroll-area" style={{ padding: '20px' }}>
        <div className="card" style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>참여할 챌린지</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>{challenge.title}</div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>{challenge.startDate} ~ {challenge.endDate}</div>
        </div>

        {/* 결제 요약 */}
        <div className="card" style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 12 }}>결제 요약</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>참가비</span>
            <span style={{ fontSize: 14, fontWeight: 600 }}>{challenge.entryFee.toLocaleString()}원</span>
          </div>
          <div style={{ height: 1, background: 'var(--border)', margin: '10px 0' }}/>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 15, fontWeight: 700 }}>총 결제금액</span>
            <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--brand-600)' }}>{challenge.entryFee.toLocaleString()}원</span>
          </div>
        </div>

        {challenge.prizeMoney > 0 && (
          <div style={{ background: 'var(--brand-50)', borderRadius: 12, padding: '12px 16px', fontSize: 13, color: 'var(--brand-700)', marginBottom: 20, wordBreak: 'keep-all' }}>
            🏆 달성 시 <strong>{challenge.prizeMoney.toLocaleString()}원</strong> 상금을 받을 수 있어요!
          </div>
        )}

        {/* 동의 */}
        <button
          style={{ display: 'flex', gap: 10, alignItems: 'flex-start', width: '100%', textAlign: 'left', padding: '14px', background: agreePay ? 'var(--brand-50)' : 'var(--bg-subtle)', borderRadius: 10, border: agreePay ? '1.5px solid var(--brand-200)' : '1.5px solid transparent', transition: 'all 150ms' }}
          onClick={() => setAgreePay(v => !v)}
        >
          <div style={{ width: 20, height: 20, borderRadius: 6, border: '1.5px solid', borderColor: agreePay ? 'var(--brand-500)' : 'var(--gray-300)', background: agreePay ? 'var(--brand-500)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 150ms' }}>
            {agreePay && <svg width="11" height="11" viewBox="0 0 12 12"><path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round"/></svg>}
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-primary)', wordBreak: 'keep-all', lineHeight: 1.5 }}>
            위 결제 내용을 확인하였으며, 챌린지 규정 및 환불 정책에 동의합니다.
          </div>
        </button>
      </div>

      <div style={{ padding: '12px 20px', borderTop: '1px solid var(--border)', background: 'var(--bg-elevated)', flexShrink: 0 }}>
        <button className="btn btn-primary btn-full" onClick={handlePayAndJoin} disabled={!agreePay || processing}>
          {processing ? '처리 중…' : `${challenge.entryFee.toLocaleString()}원 결제하고 참여`}
        </button>
      </div>
    </div>
  );
}
