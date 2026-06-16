import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconArrowLeft, IconUpload } from '../../shared/components/Icon';
import { apiCreateRecord, apiUploadFile } from '../../shared/api/index';

type Category = '자격증' | '어학' | '독서' | '운동';
const CATEGORIES: Category[] = ['자격증', '어학', '독서', '운동'];

const CATEGORY_FIELDS: Record<Category, { label: string; placeholder: string }[]> = {
  '자격증': [
    { label: '자격증명', placeholder: '예: 정보처리기사' },
    { label: '시험 회차 / 일정', placeholder: '예: 2024년 1회' },
  ],
  '어학': [
    { label: '어학 종류', placeholder: '예: TOEIC / OPIC / JLPT' },
    { label: '점수 또는 목표 점수', placeholder: '예: 860점 (목표 900)' },
  ],
  '독서': [
    { label: '책 제목', placeholder: '예: 원칙' },
    { label: '저자', placeholder: '예: 레이 달리오' },
  ],
  '운동': [
    { label: '운동 종류', placeholder: '예: 달리기 / 푸시업' },
    { label: '운동량', placeholder: '예: 5km / 50개' },
  ],
};

export default function RecordNewPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [category, setCategory] = useState<Category>('자격증');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [recordDate, setRecordDate] = useState(new Date().toISOString().slice(0, 10));
  const [extraFields, setExtraFields] = useState<Record<string, string>>({});
  const [evidenceUrl, setEvidenceUrl] = useState<string | undefined>(undefined);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fields = CATEGORY_FIELDS[category];

  const handleCategoryChange = (cat: Category) => {
    setCategory(cat);
    setExtraFields({});
  };

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
    if (!title.trim()) { setError('제목을 입력해주세요.'); return; }
    setLoading(true);
    setError('');
    try {
      await apiCreateRecord({
        category,
        title: title.trim(),
        content: content.trim() || undefined,
        recordDate,
        evidenceUrl,
        meta: extraFields,
      });
      navigate('/records', { replace: true });
    } catch {
      setError('저장에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page page-enter">
      {/* 헤더 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '16px 20px', flexShrink: 0, borderBottom: '1px solid var(--border)' }}>
        <button onClick={() => navigate(-1)} style={{ padding: 4 }} aria-label="뒤로">
          <IconArrowLeft size={22} style={{ color: 'var(--text-primary)' }}/>
        </button>
        <div className="t-h2" style={{ flex: 1 }}>기록 추가</div>
        <button className="btn btn-primary" style={{ height: 36, padding: '0 16px', fontSize: 14 }} onClick={handleSubmit} disabled={loading || uploadingFile}>
          {loading ? '저장 중…' : '저장'}
        </button>
      </div>

      <div className="scroll-area" style={{ padding: '20px' }}>
        {/* 카테고리 선택 */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 10 }}>카테고리</div>
          <div style={{ display: 'flex', gap: 8 }}>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                className={`chip ${category === cat ? 'active' : ''}`}
                onClick={() => handleCategoryChange(cat)}
              >{cat}</button>
            ))}
          </div>
        </div>

        {/* 날짜 */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>날짜</div>
          <input type="date" className="input" value={recordDate} onChange={e => setRecordDate(e.target.value)} max={new Date().toISOString().slice(0, 10)}/>
        </div>

        {/* 제목 */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>
            제목 <span style={{ color: 'var(--danger)' }}>*</span>
          </div>
          <input
            className="input"
            placeholder={fields[0]?.placeholder ?? '제목을 입력하세요'}
            value={title}
            onChange={e => setTitle(e.target.value)}
            maxLength={80}
          />
        </div>

        {/* 카테고리별 추가 필드 */}
        {fields.slice(1).map((f, i) => (
          <div key={i} style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>{f.label}</div>
            <input
              className="input"
              placeholder={f.placeholder}
              value={extraFields[f.label] ?? ''}
              onChange={e => setExtraFields(prev => ({ ...prev, [f.label]: e.target.value }))}
            />
          </div>
        ))}

        {/* 메모 */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>메모 (선택)</div>
          <textarea
            className="input"
            placeholder="기록에 대한 간단한 메모를 남겨보세요."
            value={content}
            onChange={e => setContent(e.target.value)}
            rows={3}
          />
        </div>

        {/* 증빙 첨부 */}
        <div style={{ background: 'var(--bg-subtle)', borderRadius: 12, padding: 14, display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 16 }}>
          <IconUpload size={18} style={{ color: 'var(--brand-500)', flexShrink: 0, marginTop: 1 }}/>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>증빙 첨부 (선택)</div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2, wordBreak: 'keep-all' }}>
              성적표, 수료증 등을 첨부하면 <span className="badge badge-verified" style={{ verticalAlign: 'middle' }}>검증</span> 배지가 부여됩니다.
            </div>
            {uploadedFileName && (
              <div style={{ marginTop: 8, fontSize: 12, color: 'var(--brand-600)', fontWeight: 600 }}>
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
              style={{ height: 36, fontSize: 13, marginTop: 10 }}
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingFile}
            >
              {uploadingFile ? '업로드 중…' : uploadedFileName ? '파일 변경' : '파일 선택'}
            </button>
          </div>
        </div>

        {/* 자기보고 안내 */}
        <div style={{ background: 'var(--gray-50)', borderRadius: 10, padding: '10px 14px', fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          <span className="badge badge-self" style={{ marginRight: 6 }}>자기보고</span>
          증빙 없이 저장하면 자기보고로 표시됩니다. 증빙을 나중에 추가할 수 있습니다.
        </div>

        {error && <div style={{ color: 'var(--danger)', fontSize: 13, marginTop: 12 }}>{error}</div>}
      </div>
    </div>
  );
}
