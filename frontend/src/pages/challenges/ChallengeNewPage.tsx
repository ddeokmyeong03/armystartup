import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconArrowLeft } from '../../shared/components/Icon';
import { apiCreateChallenge } from '../../shared/api/index';

type Category = '자격증' | '어학' | '독서' | '운동';
type JudgmentType = 'RANKING' | 'PASS_FAIL' | 'NON_COMPETITIVE';

const CATEGORIES: Category[] = ['자격증', '어학', '독서', '운동'];
const JUDGMENT_TYPES: { key: JudgmentType; label: string; desc: string }[] = [
  { key: 'NON_COMPETITIVE', label: '비경쟁', desc: '참여 자체에 의미 (기록 공유)' },
  { key: 'PASS_FAIL', label: '합불', desc: '목표 달성 여부 판정' },
  { key: 'RANKING', label: '랭킹', desc: '성과 순위 결정' },
];

export default function ChallengeNewPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Category>('자격증');
  const [judgmentType, setJudgmentType] = useState<JudgmentType>('NON_COMPETITIVE');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isRewarded, setIsRewarded] = useState(false);
  const [entryFee, setEntryFee] = useState('');
  const [prizeMoney, setPrizeMoney] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const today = new Date().toISOString().slice(0, 10);

  const handleSubmit = async () => {
    if (!title.trim()) { setError('챌린지 제목을 입력해주세요.'); return; }
    if (!startDate || !endDate) { setError('기간을 설정해주세요.'); return; }
    if (startDate > endDate) { setError('종료일은 시작일 이후여야 합니다.'); return; }
    setLoading(true);
    setError('');
    try {
      const result = await apiCreateChallenge({
        title: title.trim(),
        description: description.trim() || undefined,
        category,
        judgmentType,
        startDate,
        endDate,
        isRewarded,
        entryFee: isRewarded ? Number(entryFee) || 0 : 0,
        prizeMoney: isRewarded ? Number(prizeMoney) || 0 : 0,
      });
      navigate(`/challenges/${result.id}`, { replace: true });
    } catch {
      setError('챌린지 개설에 실패했습니다. 다시 시도해주세요.');
      setLoading(false);
    }
  };

  return (
    <div className="page page-enter">
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '16px 20px', flexShrink: 0, borderBottom: '1px solid var(--border)' }}>
        <button onClick={() => navigate(-1)} style={{ padding: 4 }} aria-label="뒤로">
          <IconArrowLeft size={22} style={{ color: 'var(--text-primary)' }}/>
        </button>
        <div className="t-h2" style={{ flex: 1 }}>챌린지 개설</div>
        <button className="btn btn-primary" style={{ height: 36, padding: '0 16px', fontSize: 14 }} onClick={handleSubmit} disabled={loading}>
          {loading ? '개설 중…' : '개설'}
        </button>
      </div>

      <div className="scroll-area" style={{ padding: '20px' }}>
        {/* 제목 */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>챌린지 이름 *</div>
          <input className="input" placeholder="예: TOEIC 900점 돌파 챌린지" value={title} onChange={e => setTitle(e.target.value)} maxLength={50}/>
        </div>

        {/* 설명 */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>설명 (선택)</div>
          <textarea className="input" placeholder="챌린지 목표와 방식을 간단히 설명해주세요." value={description} onChange={e => setDescription(e.target.value)} rows={3}/>
        </div>

        {/* 카테고리 */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>카테고리 *</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {CATEGORIES.map(cat => (
              <button key={cat} className={`chip ${category === cat ? 'active' : ''}`} onClick={() => setCategory(cat)}>{cat}</button>
            ))}
          </div>
        </div>

        {/* 판정 방식 */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>판정 방식 *</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {JUDGMENT_TYPES.map(jt => (
              <button
                key={jt.key}
                onClick={() => setJudgmentType(jt.key)}
                style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 10, textAlign: 'left', background: judgmentType === jt.key ? 'var(--brand-50)' : 'var(--bg-subtle)', border: judgmentType === jt.key ? '1.5px solid var(--brand-200)' : '1.5px solid transparent', transition: 'all 150ms' }}
              >
                <div style={{ width: 18, height: 18, borderRadius: '50%', border: '2px solid', borderColor: judgmentType === jt.key ? 'var(--brand-500)' : 'var(--gray-300)', background: judgmentType === jt.key ? 'var(--brand-500)' : 'transparent', flexShrink: 0 }}/>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: judgmentType === jt.key ? 'var(--brand-700)' : 'var(--text-primary)' }}>{jt.label}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 1 }}>{jt.desc}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 기간 */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>기간 *</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>
              <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginBottom: 4 }}>시작일</div>
              <input type="date" className="input" value={startDate} onChange={e => setStartDate(e.target.value)} min={today}/>
            </div>
            <div>
              <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginBottom: 4 }}>종료일</div>
              <input type="date" className="input" value={endDate} onChange={e => setEndDate(e.target.value)} min={startDate || today}/>
            </div>
          </div>
        </div>

        {/* 보상형 설정 ★ */}
        <div style={{ marginBottom: 16 }}>
          <button
            onClick={() => setIsRewarded(v => !v)}
            style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '14px', borderRadius: 12, textAlign: 'left', background: isRewarded ? 'var(--brand-50)' : 'var(--bg-subtle)', border: isRewarded ? '1.5px solid var(--brand-200)' : '1.5px solid transparent', transition: 'all 150ms' }}
          >
            <div style={{ width: 20, height: 20, borderRadius: 6, border: '1.5px solid', borderColor: isRewarded ? 'var(--brand-500)' : 'var(--gray-300)', background: isRewarded ? 'var(--brand-500)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 150ms' }}>
              {isRewarded && <svg width="11" height="11" viewBox="0 0 12 12"><path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round"/></svg>}
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: isRewarded ? 'var(--brand-700)' : 'var(--text-primary)' }}>보상형 챌린지 ★</div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 1 }}>참가비 수거 및 상금 설정 (결제 연동)</div>
            </div>
          </button>

          {isRewarded && (
            <div style={{ marginTop: 12, padding: 14, background: 'var(--bg-subtle)', borderRadius: 10, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6 }}>참가비 (원)</div>
                <input className="input" type="number" placeholder="0" value={entryFee} onChange={e => setEntryFee(e.target.value)} min="0"/>
              </div>
              <div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6 }}>상금 (원)</div>
                <input className="input" type="number" placeholder="0" value={prizeMoney} onChange={e => setPrizeMoney(e.target.value)} min="0"/>
              </div>
            </div>
          )}
        </div>

        {error && <div style={{ color: 'var(--danger)', fontSize: 13 }}>{error}</div>}
      </div>
    </div>
  );
}
