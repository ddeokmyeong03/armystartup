import { useState, useEffect } from 'react';
import TabBar from '../../shared/components/TabBar';
import PageHeader from '../../shared/components/PageHeader';
import { Icon, IconClock } from '../../shared/components/Icon';
import { apiGetCourses, apiGetRecommendedCourses } from '../../shared/api/index';
import type { CourseItem, CourseRecommendation } from '../../shared/api/index';

const CAT_COLORS: Record<string, string> = { '자격증': '#8b5cf6', '어학': '#f59e0b', '취업': '#10b981', '취미': '#ef4444', '독서': '#3b82f6', '체력': '#06b6d4', '기타': '#6b7280' };

export default function CoursesPage() {
  const [cat, setCat] = useState('all');
  const [duration, setDuration] = useState('all');
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [recommended, setRecommended] = useState<CourseRecommendation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      apiGetCourses(),
      apiGetRecommendedCourses().catch(() => ({ recommendations: [] })),
    ]).then(([c, r]) => {
      setCourses(c.courses ?? []);
      setRecommended(r.recommendations ?? []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const cats = [
    { id: 'all', label: '전체' }, { id: '자격증', label: '자격증' },
    { id: '어학', label: '어학' }, { id: '취업', label: '취업' }, { id: '취미', label: '취미' },
  ];
  const durations = [
    { id: 'all', label: '전체' }, { id: 'short', label: '30분 이하' },
    { id: 'mid', label: '~1시간' }, { id: 'long', label: '장기' },
  ];

  const filterCourse = (c: CourseItem) => {
    if (cat !== 'all' && c.category !== cat) return false;
    if (duration === 'short' && c.durationMinutes > 30) return false;
    if (duration === 'mid' && (c.durationMinutes <= 30 || c.durationMinutes > 60)) return false;
    if (duration === 'long' && c.durationMinutes <= 60) return false;
    return true;
  };

  const filteredCourses = courses.filter(filterCourse);
  const filteredRec = recommended.filter(r => filterCourse(r.course)).slice(0, 3);

  return (
    <div className="page page-enter">
      <div className="page-gradient"/>
      <div style={{ height: 8 }}/>
      <PageHeader title="추천 강의" subtitle="가용시간과 로드맵에 맞춰"/>

      <div className="scroll-area" style={{ padding: '4px 0 24px', position: 'relative', zIndex: 1 }}>
        {/* 필터 */}
        <div style={{ padding: '0 20px 12px' }}>
          <div className="h-scroll" style={{ padding: 0, marginBottom: 8 }}>
            {cats.map(c => (
              <button key={c.id} className="chip" style={{ padding: '8px 14px', background: cat === c.id ? 'rgba(80,80,80,0.55)' : undefined, color: cat === c.id ? 'var(--text-bright)' : undefined, border: cat === c.id ? '1px solid rgba(140,140,140,0.35)' : '1px solid transparent' }} onClick={() => setCat(c.id)}>{c.label}</button>
            ))}
          </div>
          <div className="h-scroll" style={{ padding: 0 }}>
            {durations.map(d => (
              <button key={d.id} className="chip chip-outline" style={{ padding: '6px 12px', fontSize: 11, display: 'flex', alignItems: 'center', gap: 4, background: duration === d.id ? 'rgba(80,80,80,0.55)' : 'transparent', color: duration === d.id ? 'var(--text-bright)' : undefined }} onClick={() => setDuration(d.id)}>
                <IconClock size={12}/>{d.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="t-subdued" style={{ textAlign: 'center', padding: '60px 0' }}>불러오는 중...</div>
        ) : (
          <>
            {/* 로드맵 기반 추천 */}
            {filteredRec.length > 0 && (
              <div style={{ marginBottom: 24 }}>
                <div style={{ padding: '0 20px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div className="t-eyebrow">TOP MATCH</div>
                    <div className="t-section" style={{ marginTop: 4 }}>목표 기반 추천</div>
                  </div>
                </div>
                <div className="h-scroll" style={{ paddingBottom: 4 }}>
                  {filteredRec.map(r => <FeaturedCard key={r.id} c={r.course} reason={r.reason}/>)}
                </div>
              </div>
            )}

            {/* 전체 강의 목록 */}
            {filteredCourses.length > 0 ? (
              <div style={{ marginBottom: 20 }}>
                <div style={{ padding: '0 20px 10px' }}>
                  <div className="t-eyebrow">강의 목록</div>
                  <div className="t-section" style={{ marginTop: 4 }}>전체 강의</div>
                </div>
                <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {filteredCourses.map(c => <CourseRow key={c.id} c={c}/>)}
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>📚</div>
                <div className="t-subdued">조건에 맞는 강의가 없어요</div>
              </div>
            )}
          </>
        )}
      </div>

      <TabBar/>
    </div>
  );
}

function FeaturedCard({ c, reason }: { c: CourseItem; reason: string }) {
  const color = CAT_COLORS[c.category] ?? '#6b7280';
  return (
    <div style={{ flexShrink: 0, width: 260, marginLeft: 20, background: 'var(--bg-surface)', borderRadius: 14, overflow: 'hidden', cursor: 'pointer' }}
      onClick={() => c.url && window.open(c.url, '_blank')}>
      <div style={{ height: 120, background: `linear-gradient(135deg, ${color} 0%, ${color}99 100%)`, display: 'flex', alignItems: 'flex-end', padding: 14, position: 'relative' }}>
        <span style={{ position: 'absolute', top: 12, left: 12, background: 'rgba(0,0,0,0.35)', color: '#fff', fontSize: 10, fontWeight: 800, padding: '4px 8px', borderRadius: 6 }}>
          {c.source}
        </span>
        <span style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(0,0,0,0.35)', color: 'var(--accent)', fontSize: 11, fontWeight: 800, padding: '4px 8px', borderRadius: 999 }}>
          {c.matchScore}% 매칭
        </span>
        <button className="btn-icon-circle" style={{ position: 'absolute', bottom: -14, right: 14 }}>
          <Icon name="play" size={18}/>
        </button>
      </div>
      <div style={{ padding: '20px 14px 14px' }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-bright)', lineHeight: 1.3, minHeight: 36 }}>{c.title}</div>
        <div style={{ fontSize: 11, color: 'var(--text-subdued)', marginTop: 4, lineHeight: 1.4 }}>{reason}</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
          <span className="t-caption">{c.source}</span>
          <span className="t-caption" style={{ display: 'flex', alignItems: 'center', gap: 3 }}><IconClock size={10}/>{c.durationMinutes}분</span>
        </div>
      </div>
    </div>
  );
}

function CourseRow({ c }: { c: CourseItem }) {
  const color = CAT_COLORS[c.category] ?? '#6b7280';
  return (
    <div className="course-tile" onClick={() => c.url && window.open(c.url, '_blank')}>
      <div className="course-thumb" style={{ background: color, color: '#000' }}>
        {c.category[0]}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-bright)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.title}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 2 }}>
          <span className="t-caption">{c.source}</span>
          <span style={{ width: 2, height: 2, borderRadius: '50%', background: 'var(--text-subdued)' }}/>
          <span className="t-caption">{c.durationMinutes}분</span>
          <span style={{ width: 2, height: 2, borderRadius: '50%', background: 'var(--text-subdued)' }}/>
          <span className="t-caption" style={{ color: 'var(--accent)', fontWeight: 700 }}>{c.matchScore}%</span>
        </div>
      </div>
      <button className="btn-icon-circle" style={{ width: 36, height: 36 }}>
        <Icon name="play" size={14}/>
      </button>
    </div>
  );
}
