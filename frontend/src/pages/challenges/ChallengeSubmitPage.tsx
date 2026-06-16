import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { IconArrowLeft, IconUpload } from '../../shared/components/Icon';
import { apiSubmitChallengeEvidence } from '../../shared/api/index';

export default function ChallengeSubmitPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [evidenceUrl, setEvidenceUrl] = useState('');
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!evidenceUrl.trim()) { setError('증빙 파일 또는 URL을 입력해주세요.'); return; }
    setLoading(true);
    setError('');
    try {
      await apiSubmitChallengeEvidence(Number(id), { evidenceUrl: evidenceUrl.trim(), comment });
      navigate(`/challenges/${id}`, { replace: true });
    } catch {
      setError('제출에 실패했습니다. 다시 시도해주세요.');
      setLoading(false);
    }
  };

  return (
    <div className="page page-enter">
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '16px 20px', flexShrink: 0, borderBottom: '1px solid var(--border)' }}>
        <button onClick={() => navigate(-1)} style={{ padding: 4 }} aria-label="뒤로">
          <IconArrowLeft size={22} style={{ color: 'var(--text-primary)' }}/>
        </button>
        <div className="t-h2" style={{ flex: 1 }}>판정 제출</div>
      </div>

      <div className="scroll-area" style={{ padding: '20px' }}>
        <div style={{ background: 'var(--brand-50)', borderRadius: 12, padding: '12px 16px', fontSize: 13, color: 'var(--brand-700)', marginBottom: 20, wordBreak: 'keep-all', lineHeight: 1.6 }}>
          증빙 자료(성적표, 수료증, 스크린샷 등)를 제출하면 운영자 검토 후 결과가 확정됩니다.
        </div>

        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>
            증빙 URL <span style={{ color: 'var(--danger)' }}>*</span>
          </div>
          <input
            className="input"
            placeholder="파일 공유 링크 또는 URL을 입력하세요"
            value={evidenceUrl}
            onChange={e => setEvidenceUrl(e.target.value)}
          />
          <button
            className="btn btn-secondary"
            style={{ marginTop: 10, height: 40, fontSize: 13, display: 'flex', gap: 6, alignItems: 'center' }}
          >
            <IconUpload size={15}/>파일 업로드
          </button>
        </div>

        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>코멘트 (선택)</div>
          <textarea
            className="input"
            placeholder="추가 설명이 있으면 입력하세요."
            value={comment}
            onChange={e => setComment(e.target.value)}
            rows={3}
          />
        </div>

        {error && <div style={{ color: 'var(--danger)', fontSize: 13, marginBottom: 12 }}>{error}</div>}
      </div>

      <div style={{ padding: '12px 20px', borderTop: '1px solid var(--border)', background: 'var(--bg-elevated)', flexShrink: 0 }}>
        <button className="btn btn-primary btn-full" onClick={handleSubmit} disabled={loading || !evidenceUrl.trim()}>
          {loading ? '제출 중…' : '판정 제출'}
        </button>
      </div>
    </div>
  );
}
