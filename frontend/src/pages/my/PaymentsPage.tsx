import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconArrowLeft } from '../../shared/components/Icon';
import { apiGetPayments } from '../../shared/api/index';

export default function PaymentsPage() {
  const navigate = useNavigate();
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGetPayments().then(setPayments).catch(() => setPayments([])).finally(() => setLoading(false));
  }, []);

  return (
    <div className="page page-enter">
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '16px 20px', flexShrink: 0, borderBottom: '1px solid var(--border)' }}>
        <button onClick={() => navigate(-1)} style={{ padding: 4 }} aria-label="뒤로">
          <IconArrowLeft size={22} style={{ color: 'var(--text-primary)' }}/>
        </button>
        <div className="t-h2" style={{ flex: 1 }}>결제 내역</div>
      </div>

      <div className="scroll-area" style={{ padding: '16px 20px 24px' }}>
        {loading ? (
          <div style={{ padding: '48px 0', textAlign: 'center', color: 'var(--text-tertiary)', fontSize: 14 }}>불러오는 중…</div>
        ) : payments.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">💳</div>
            <div className="empty-state-title">결제 내역이 없어요</div>
            <div className="empty-state-sub">유료 챌린지 참여 시 여기에 표시됩니다.</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {payments.map((p: any) => (
              <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 0', borderBottom: '1px solid var(--border)' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.challengeTitle}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 2 }}>{p.paidAt?.slice(0, 10)}</div>
                </div>
                <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', flexShrink: 0 }}>
                  {p.amount.toLocaleString()}원
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
