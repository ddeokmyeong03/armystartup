import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import TabBar from '../../shared/components/TabBar';
import { IconCert, IconLanguage, IconBook, IconRun, IconPlus, IconCheck } from '../../shared/components/Icon';
import { apiGetRecords } from '../../shared/api/index';

const CATEGORIES = [
  { key: '전체' },
  { key: '자격증', icon: <IconCert size={14}/> },
  { key: '어학',   icon: <IconLanguage size={14}/> },
  { key: '독서',   icon: <IconBook size={14}/> },
  { key: '운동',   icon: <IconRun size={14}/> },
];

function categoryColor(cat: string): string {
  const map: Record<string, string> = {
    '자격증': 'var(--brand-500)',
    '어학': 'var(--info)',
    '독서': 'var(--warning)',
    '운동': 'var(--danger)',
  };
  return map[cat] ?? 'var(--gray-400)';
}

export default function RecordsPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const initCat = params.get('category') ?? '전체';
  const [activeCategory, setActiveCategory] = useState(initCat);
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    apiGetRecords(activeCategory === '전체' ? undefined : activeCategory)
      .then(setRecords)
      .catch(() => setRecords([]))
      .finally(() => setLoading(false));
  }, [activeCategory]);

  return (
    <div className="page page-enter">
      {/* 헤더 */}
      <div style={{ padding: '16px 20px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div className="t-h1">기록</div>
        <button className="btn-fab" style={{ width: 40, height: 40, borderRadius: 12 }} onClick={() => navigate('/records/new')} aria-label="기록 추가">
          <IconPlus size={20}/>
        </button>
      </div>

      {/* 카테고리 탭 */}
      <div style={{ padding: '12px 20px 8px', flexShrink: 0, display: 'flex', gap: 8, overflowX: 'auto' }}>
        {CATEGORIES.map(cat => (
          <button
            key={cat.key}
            className={`chip ${activeCategory === cat.key ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat.key)}
          >
            {cat.icon}{cat.key}
          </button>
        ))}
      </div>

      {/* 타임라인 */}
      <div className="scroll-area" style={{ padding: '4px 20px 24px' }}>
        {loading ? (
          <div style={{ padding: '48px 0', textAlign: 'center', color: 'var(--text-tertiary)', fontSize: 14 }}>불러오는 중…</div>
        ) : records.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📋</div>
            <div className="empty-state-title">아직 기록이 없어요</div>
            <div className="empty-state-sub">오늘의 자기계발을 첫 번째로 기록해보세요.</div>
            <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => navigate('/records/new')}>
              + 기록 추가
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {records.map((rec: any, idx: number) => {
              const showDate = idx === 0 || records[idx - 1].recordDate !== rec.recordDate;
              return (
                <div key={rec.id}>
                  {showDate && (
                    <div style={{ padding: '16px 0 8px', fontSize: 12, fontWeight: 700, color: 'var(--text-tertiary)', letterSpacing: '0.05em' }}>
                      {rec.recordDate}
                    </div>
                  )}
                  <button
                    className="row"
                    style={{ width: '100%', textAlign: 'left' }}
                    onClick={() => navigate(`/records/${rec.id}`)}
                  >
                    <div style={{ width: 4, alignSelf: 'stretch', borderRadius: 2, background: categoryColor(rec.category), flexShrink: 0 }}/>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontSize: 11, fontWeight: 600, color: categoryColor(rec.category) }}>{rec.category}</span>
                        {rec.verified
                          ? <span className="badge badge-verified"><IconCheck size={9}/>검증</span>
                          : <span className="badge badge-self">자기보고</span>
                        }
                      </div>
                      <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {rec.title}
                      </div>
                      {rec.content && (
                        <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {rec.content}
                        </div>
                      )}
                    </div>
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <TabBar/>
    </div>
  );
}
