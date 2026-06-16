import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconArrowLeft } from '../../shared/components/Icon';
import { apiGetProfile, apiUpdateProfile } from '../../shared/api/index';

const RANKS = ['이병', '일병', '상병', '병장'];
const BRANCHES = ['육군', '해군', '공군', '해병대'];

export default function MyProfileEditPage() {
  const navigate = useNavigate();
  const [rankName, setRankName] = useState('');
  const [branch, setBranch] = useState('');
  const [unitName, setUnitName] = useState('');
  const [dischargeDate, setDischargeDate] = useState('');
  const [goal, setGoal] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    apiGetProfile().then((p: any) => {
      setRankName(p.rankName ?? '');
      setBranch(p.branch ?? '');
      setUnitName(p.unitName ?? '');
      setDischargeDate(p.dischargeDate ?? '');
      setGoal(p.goal ?? '');
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      await apiUpdateProfile({ rankName: rankName || undefined, branch: branch || undefined, unitName: unitName || undefined, dischargeDate: dischargeDate || undefined, goal: goal || undefined });
      navigate('/my');
    } catch {
      setError('저장에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
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
        <div className="t-h2" style={{ flex: 1 }}>프로필 편집</div>
        <button className="btn btn-primary" style={{ height: 36, padding: '0 16px', fontSize: 14 }} onClick={handleSave} disabled={saving}>
          {saving ? '저장 중…' : '저장'}
        </button>
      </div>

      <div className="scroll-area" style={{ padding: '20px' }}>
        {/* 목표 */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>나의 목표</div>
          <input className="input" placeholder="예: TOEIC 900점 달성, 정보처리기사 취득" value={goal} onChange={e => setGoal(e.target.value)} maxLength={100}/>
        </div>

        {/* 군종 */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>군종</div>
          <div style={{ display: 'flex', gap: 8 }}>
            {BRANCHES.map(b => (
              <button key={b} onClick={() => setBranch(b)} style={{ flex: 1, padding: '10px 0', borderRadius: 10, fontSize: 13, fontWeight: 600, background: branch === b ? 'var(--brand-50)' : 'var(--bg-subtle)', color: branch === b ? 'var(--brand-700)' : 'var(--text-secondary)', border: branch === b ? '1.5px solid var(--brand-200)' : '1.5px solid transparent' }}>{b}</button>
            ))}
          </div>
        </div>

        {/* 계급 */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>계급</div>
          <div style={{ display: 'flex', gap: 8 }}>
            {RANKS.map(r => (
              <button key={r} onClick={() => setRankName(r)} style={{ flex: 1, padding: '10px 0', borderRadius: 10, fontSize: 13, fontWeight: 600, background: rankName === r ? 'var(--brand-50)' : 'var(--bg-subtle)', color: rankName === r ? 'var(--brand-700)' : 'var(--text-secondary)', border: rankName === r ? '1.5px solid var(--brand-200)' : '1.5px solid transparent' }}>{r}</button>
            ))}
          </div>
        </div>

        {/* 부대 */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>부대명</div>
          <input className="input" placeholder="예: 1군단 / 00사단 / 근무지원대" value={unitName} onChange={e => setUnitName(e.target.value)}/>
        </div>

        {/* 전역 예정일 */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>전역 예정일 *</div>
          <input type="date" className="input" value={dischargeDate} onChange={e => setDischargeDate(e.target.value)}/>
        </div>

        {error && <div style={{ color: 'var(--danger)', fontSize: 13 }}>{error}</div>}
      </div>
    </div>
  );
}
