import { useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { IconArrowLeft, IconUpload } from '../../shared/components/Icon';
import { apiSubmitChallengeEvidence, apiUploadFile } from '../../shared/api/index';

export default function ChallengeSubmitPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [evidenceUrl, setEvidenceUrl] = useState('');
  const [comment, setComment] = useState('');
  const [uploadingFile, setUploadingFile] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingFile(true);
    setError('');
    try {
      const url = await apiUploadFile(file);
      setEvidenceUrl(url);
      setUploadedFileName(file.name);
    } catch {
      setError('파일 업로드에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setUploadingFile(false);
    }
  };

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
            증빙 자료 <span style={{ color: 'var(--danger)' }}>*</span>
          </div>
          <input
            className="input"
            placeholder="파일 공유 링크 또는 URL을 직접 입력하세요"
            value={evidenceUrl}
            onChange={e => setEvidenceUrl(e.target.value)}
          />
          {uploadedFileName && (
            <div style={{ marginTop: 6, fontSize: 12, color: 'var(--brand-600)', fontWeight: 600 }}>
              ✓ {uploadedFileName}
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept=".jpg,.jpeg,.png,.gif,.webp,.pdf"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
          <button
            className="btn btn-secondary"
            style={{ marginTop: 10, height: 40, fontSize: 13, display: 'flex', gap: 6, alignItems: 'center' }}
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadingFile}
          >
            <IconUpload size={15}/>
            {uploadingFile ? '업로드 중…' : uploadedFileName ? '파일 변경' : '파일 업로드'}
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
        <button className="btn btn-primary btn-full" onClick={handleSubmit} disabled={loading || uploadingFile || !evidenceUrl.trim()}>
          {loading ? '제출 중…' : '판정 제출'}
        </button>
      </div>
    </div>
  );
}
