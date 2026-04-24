import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { apiCoursesAnalytics } from '../api';

const COLORS = ['#8b5cf6', '#f59e0b', '#10b981', '#ef4444', '#3b82f6', '#06b6d4', '#22FFB2'];
const STATUS_LABEL: Record<string, string> = { RECOMMENDED: '추천됨', SAVED: '저장됨', DISMISSED: '닫음' };
const STATUS_COLOR: Record<string, string> = { RECOMMENDED: '#3b82f6', SAVED: 'var(--accent)', DISMISSED: '#6b7280' };

export default function CoursesPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiCoursesAnalytics().then(setData).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ color: 'var(--text-sub)' }}>불러오는 중...</div>;
  if (!data) return <div style={{ color: '#ef4444' }}>데이터 로드 실패</div>;

  const statusData = data.recommendationStatus.map((s: any) => ({
    ...s,
    name: STATUS_LABEL[s.status] ?? s.status,
  }));

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>강의 분석</h1>
      <p style={{ color: 'var(--text-sub)', fontSize: 14, marginBottom: 28 }}>추천 강의 사용 현황 및 카테고리별 분포</p>

      <div className="grid-2" style={{ marginBottom: 24 }}>
        <div className="card">
          <div className="section-title">추천 상태 분포</div>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={statusData} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={90}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {statusData.map((s: any, i: number) => <Cell key={i} fill={STATUS_COLOR[s.status] ?? COLORS[i]}/>)}
              </Pie>
              <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}/>
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <div className="section-title">카테고리별 강의 수</div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={data.coursesByCategory} margin={{ left: -20 }}>
              <XAxis dataKey="category" tick={{ fill: 'var(--text-sub)', fontSize: 11 }}/>
              <YAxis tick={{ fill: 'var(--text-sub)', fontSize: 11 }}/>
              <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}/>
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {data.coursesByCategory.map((_: any, i: number) => <Cell key={i} fill={COLORS[i % COLORS.length]}/>)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card">
        <div className="section-title">인기 강의 TOP 10</div>
        <table>
          <thead>
            <tr><th>강의명</th><th>소스</th><th>카테고리</th><th>추천 수</th></tr>
          </thead>
          <tbody>
            {data.topCourses.map((c: any, i: number) => (
              <tr key={c.courseId}>
                <td style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--text-sub)', width: 20 }}>#{i + 1}</span>
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 220 }}>{c.title}</span>
                </td>
                <td><span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 9999, background: 'var(--surface-hi)' }}>{c.source}</span></td>
                <td style={{ color: 'var(--text-sub)', fontSize: 12 }}>{c.category}</td>
                <td><span style={{ color: 'var(--accent)', fontWeight: 700 }}>{c.count}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
