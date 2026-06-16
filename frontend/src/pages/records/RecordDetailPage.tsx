import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { IconArrowLeft, IconCheck, IconUpload } from '../../shared/components/Icon';
import { apiGetRecord, apiDeleteRecord } from '../../shared/api/index';

export default function RecordDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [record, setRecord] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!id) return;
    apiGetRecord(Number(id))
      .then(setRecord)
      .catch(() => navigate('/records', { replace: true }))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('이 기록을 삭제하시겠습니까?')) return;
    setDeleting(true);
    try {
      await apiDeleteRecord(Number(id));
      navigate('/records', { replace: true });
    } catch {
      alert('삭제에 실패했습니다.');
      setDeleting(false);
    }
  };

  if (loading) return (
    <div className="page" style={{ alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: 'var(--text-tertiary)' }}>불러오는 중…</div>
    </div>
  );

  if (!record) return null;

  const meta = typeof record.meta === 'string' ? JSON.parse(record.meta) : record.meta;

  return (
    <div className="page page-enter">
      {/* 헤더 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '16px 20px', flexShrink: 0, borderBottom: '1px solid var(--border)' }}>
        <button onClick={() => navigate(-1)} style={{ padding: 4 }} aria-label="뒤로">
          <IconArrowLeft size={22} style={{ color: 'var(--text-primary)' }}/>
        </button>
        <div className="t-h2" style={{ flex: 1 }}>기록 상세</div>
        <button onClick={handleDelete} disabled={deleting} style={{ fontSize: 13, fontWeight: 600, color: 'var(--danger)' }}>
          {deleting ? '삭제 중…' : '삭제'}
        </button>
      </div>

      <div className="scroll-area" style={{ padding: '20px' }}>
        {/* 상태 배지 */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          <span className="chip" style={{ padding: '4px 12px', fontSize: 12 }}>{record.category}</span>
          {record.verified
            ? <span className="badge badge-verified"><IconCheck size={9}/>검증</span>
            : <span className="badge badge-self">자기보고</span>
          }
        </div>

        {/* 제목 */}
        <div className="t-h1" style={{ marginBottom: 6 }}>{record.title}</div>
        <div style={{ fontSize: 13, color: 'var(--text-tertiary)', marginBottom: 20 }}>{record.recordDate}</div>

        {/* 추가 필드 */}
        {meta && Object.keys(meta).length > 0 && (
          <div className="card" style={{ marginBottom: 16 }}>
            {Object.entries(meta).map(([k, v]: [string, any]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{k}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{v}</span>
              </div>
            ))}
          </div>
        )}

        {/* 메모 */}
        {record.content && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>메모</div>
            <div className="card" style={{ fontSize: 15, lineHeight: 1.6, color: 'var(--text-primary)', wordBreak: 'keep-all' }}>
              {record.content}
            </div>
          </div>
        )}

        {/* 증빙 */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>증빙</div>
          {record.evidenceUrl ? (
            <a href={record.evidenceUrl} target="_blank" rel="noreferrer" style={{ display: 'block', padding: '12px 16px', background: 'var(--brand-50)', borderRadius: 10, fontSize: 14, color: 'var(--brand-700)', fontWeight: 600, textDecoration: 'none' }}>
              증빙 파일 보기 →
            </a>
          ) : (
            <div style={{ background: 'var(--bg-subtle)', borderRadius: 10, padding: '14px 16px', display: 'flex', gap: 10, alignItems: 'center' }}>
              <IconUpload size={18} style={{ color: 'var(--gray-400)' }}/>
              <div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>증빙 없음 — 자기보고 상태</div>
                <button style={{ fontSize: 13, color: 'var(--brand-600)', fontWeight: 600, marginTop: 4 }}>증빙 추가하기</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
