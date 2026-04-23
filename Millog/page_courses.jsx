// page_courses.jsx — Course recommendations
const CoursesPage = () => {
  const [cat, setCat] = useState('all');
  const [duration, setDuration] = useState('all');

  const cats = [
    { id: 'all', label: '전체' },
    { id: '자격증', label: '자격증' },
    { id: '어학', label: '어학' },
    { id: '취업', label: '취업' },
    { id: '취미', label: '취미' },
  ];
  const durations = [
    { id: 'all', label: '전체' },
    { id: 'short', label: '30분 이하' },
    { id: 'mid', label: '~1시간' },
    { id: 'long', label: '장기' },
  ];

  const filter = (c) => {
    if (cat !== 'all' && c.tag !== cat) return false;
    if (duration === 'short' && c.duration > 30) return false;
    if (duration === 'mid' && (c.duration <= 30 || c.duration > 60)) return false;
    if (duration === 'long' && c.duration <= 60) return false;
    return true;
  };

  const picks = ROADMAP_PICKS.filter(filter);
  const armye = COURSES_BY_SOURCE.armye.filter(filter);
  const external = COURSES_BY_SOURCE.external.filter(filter);

  return (
    <div className="page page-enter">
      <div className="page-gradient"/>
      <StatusSpacer/>
      <PageHeader title="추천 강의" subtitle="가용시간과 로드맵에 맞춰"
        right={<button style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--bg-surface-hi)', color: 'var(--text-base)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="search" size={18}/></button>}
      />

      <div className="scroll-area" style={{ padding: '4px 0 24px', position: 'relative', zIndex: 1 }}>
        {/* Filters */}
        <div style={{ padding: '0 20px 12px' }}>
          <div className="h-scroll" style={{ padding: 0, marginBottom: 8 }}>
            {cats.map(c => (
              <button key={c.id} className={`chip ${cat === c.id ? 'active' : ''}`} style={{ padding: '8px 14px' }} onClick={() => setCat(c.id)}>{c.label}</button>
            ))}
          </div>
          <div className="h-scroll" style={{ padding: 0 }}>
            {durations.map(d => (
              <button key={d.id} className={`chip chip-outline ${duration === d.id ? 'active' : ''}`} style={{ padding: '6px 12px', fontSize: 11 }} onClick={() => setDuration(d.id)}>
                <IconClock size={12}/> {d.label}
              </button>
            ))}
          </div>
        </div>

        {/* Section: roadmap-linked (top) */}
        {picks.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <div style={{ padding: '0 20px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div className="t-eyebrow">ROADMAP W3 · TOP MATCH</div>
                <div className="t-section" style={{ marginTop: 4 }}>이번 주 로드맵 연계</div>
              </div>
            </div>
            <div className="h-scroll" style={{ paddingBottom: 4 }}>
              {picks.map(c => <FeaturedCard key={c.id} c={c}/>)}
            </div>
          </div>
        )}

        {/* 장병e음 / 국방전직교육원 */}
        {armye.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <div style={{ padding: '0 20px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div className="t-eyebrow" style={{ color: '#539df5' }}>공식 추천</div>
                <div className="t-section" style={{ marginTop: 4 }}>장병e음 · 국방전직교육원</div>
              </div>
              <button style={{ fontSize: 13, color: 'var(--text-subdued)' }}>전체 →</button>
            </div>
            <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {armye.map(c => <CourseRow key={c.id} c={c}/>)}
            </div>
          </div>
        )}

        {/* K-MOOC / Class 101 */}
        {external.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <div style={{ padding: '0 20px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div className="t-eyebrow" style={{ color: '#f59e0b' }}>더 풍부하게</div>
                <div className="t-section" style={{ marginTop: 4 }}>K-MOOC · Class 101</div>
              </div>
              <button style={{ fontSize: 13, color: 'var(--text-subdued)' }}>전체 →</button>
            </div>
            <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {external.map(c => <CourseRow key={c.id} c={c}/>)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

function FeaturedCard({ c }) {
  return (
    <div style={{
      flexShrink: 0,
      width: 260,
      marginLeft: 20,
      background: 'var(--bg-surface)',
      borderRadius: 14,
      overflow: 'hidden',
      cursor: 'pointer',
    }}>
      <div style={{
        height: 120,
        background: `linear-gradient(135deg, ${c.color} 0%, ${c.color}99 100%)`,
        display: 'flex',
        alignItems: 'flex-end',
        padding: 14,
        position: 'relative',
      }}>
        <span style={{ position: 'absolute', top: 12, left: 12, background: 'rgba(0,0,0,0.35)', color: '#fff', fontSize: 10, fontWeight: 800, padding: '4px 8px', borderRadius: 6, letterSpacing: '0.08em' }}>
          {c.linkedWeek} 연계
        </span>
        <span style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(0,0,0,0.35)', color: 'var(--accent)', fontSize: 11, fontWeight: 800, padding: '4px 8px', borderRadius: 999 }}>
          {c.match}% 매칭
        </span>
        <button className="btn-icon-circle" style={{ position: 'absolute', bottom: -14, right: 14 }}>
          <Icon name="play" size={18}/>
        </button>
      </div>
      <div style={{ padding: '20px 14px 14px' }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-bright)', lineHeight: 1.3, minHeight: 36 }}>{c.title}</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
          <span className="t-caption">{c.provider}</span>
          <span className="t-caption"><IconClock size={10}/> {c.duration}분</span>
        </div>
      </div>
    </div>
  );
}

function CourseRow({ c }) {
  return (
    <div className="course-tile">
      <div className="course-thumb" style={{ background: c.color, color: '#000' }}>
        {c.tag[0]}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-bright)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {c.title}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 2 }}>
          <span className="t-caption">{c.provider}</span>
          <span style={{ width: 2, height: 2, borderRadius: '50%', background: 'var(--text-subdued)' }}/>
          <span className="t-caption">{c.duration}분</span>
          <span style={{ width: 2, height: 2, borderRadius: '50%', background: 'var(--text-subdued)' }}/>
          <span className="t-caption" style={{ color: 'var(--accent)', fontWeight: 700 }}>{c.match}%</span>
        </div>
      </div>
      <button className="btn-icon-circle" style={{ width: 36, height: 36 }}>
        <Icon name="play" size={14}/>
      </button>
    </div>
  );
}

Object.assign(window, { CoursesPage });
