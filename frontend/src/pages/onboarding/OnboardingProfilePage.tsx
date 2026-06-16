import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiUpdateProfile } from '../../shared/api/index';
import { MillogLogo } from '../../shared/components/Icon';

const RANKS = ['이병', '일병', '상병', '병장'];
const BRANCHES = ['육군', '해군', '공군', '해병대'];

export default function OnboardingProfilePage() {
  const navigate = useNavigate();
  const [rankName, setRankName] = useState('');
  const [branch, setBranch] = useState('');
  const [unitName, setUnitName] = useState('');
  const [dischargeDate, setDischargeDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const valid = rankName && branch && dischargeDate;

  const handleDone = async () => {
    if (!valid) return;
    setLoading(true);
    setError('');
    try {
      await apiUpdateProfile({ rankName, branch, unitName: unitName || undefined, dischargeDate });
      navigate('/home', { replace: true });
    } catch {
      setError('저장에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page" style={{ display: 'flex', flexDirection: 'column', minHeight: '100%', padding: '48px 24px 32px' }}>
      <div style={{ marginBottom: 40 }}>
        <MillogLogo size={32}/>
      </div>

      <div style={{ flex: 1 }}>
        <div className="signup-step-tag">02 / 02 · 프로필</div>
        <div className="signup-step-title">군 프로필을<br/>입력해주세요</div>
        <div className="signup-step-sub">전역일은 성장 보고서 생성에 사용됩니다.</div>

        {/* 군종 */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>군종 *</div>
          <div style={{ display: 'flex', gap: 8 }}>
            {BRANCHES.map(b => (
              <button
                key={b}
                onClick={() => setBranch(b)}
                style={{
                  flex: 1, padding: '10px 0', borderRadius: 10, fontSize: 13, fontWeight: 600,
                  background: branch === b ? 'var(--brand-50)' : 'var(--bg-subtle)',
                  color: branch === b ? 'var(--brand-700)' : 'var(--text-secondary)',
                  border: branch === b ? '1.5px solid var(--brand-200)' : '1.5px solid transparent',
                }}
              >{b}</button>
            ))}
          </div>
        </div>

        {/* 계급 */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>계급 *</div>
          <div style={{ display: 'flex', gap: 8 }}>
            {RANKS.map(r => (
              <button
                key={r}
                onClick={() => setRankName(r)}
                style={{
                  flex: 1, padding: '10px 0', borderRadius: 10, fontSize: 13, fontWeight: 600,
                  background: rankName === r ? 'var(--brand-50)' : 'var(--bg-subtle)',
                  color: rankName === r ? 'var(--brand-700)' : 'var(--text-secondary)',
                  border: rankName === r ? '1.5px solid var(--brand-200)' : '1.5px solid transparent',
                }}
              >{r}</button>
            ))}
          </div>
        </div>

        {/* 부대 (선택) */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>부대명 (선택)</div>
          <input
            className="input signup-input"
            placeholder="예: 1군단 / 00사단 / 근무지원대"
            value={unitName}
            onChange={e => setUnitName(e.target.value)}
          />
        </div>

        {/* 전역 예정일 */}
        <div style={{ marginBottom: 8 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>전역 예정일 *</div>
          <input
            type="date"
            className="input signup-input"
            value={dischargeDate}
            onChange={e => setDischargeDate(e.target.value)}
            min={new Date().toISOString().slice(0, 10)}
          />
        </div>

        {error && <div style={{ color: 'var(--danger)', fontSize: 13, marginTop: 8 }}>{error}</div>}
      </div>

      <button
        className="btn btn-primary btn-full signup-next-btn"
        style={{ borderRadius: 12, marginTop: 24 }}
        onClick={handleDone}
        disabled={!valid || loading}
      >
        {loading ? '저장 중…' : '완료'}
      </button>
    </div>
  );
}
