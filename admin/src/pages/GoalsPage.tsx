import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { apiGoalsAnalytics } from '../api';

const COLORS = ['#8b5cf6', '#f59e0b', '#10b981', '#ef4444', '#3b82f6', '#06b6d4', '#22FFB2'];

export default function GoalsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGoalsAnalytics().then(setData).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ color: 'var(--text-sub)' }}>불러오는 중...</div>;
  if (!data) return <div style={{ color: '#ef4444' }}>데이터 로드 실패</div>;

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>목표 분석</h1>
      <p style={{ color: 'var(--text-sub)', fontSize: 14, marginBottom: 28 }}>장병들이 어떤 목표를 설정하는지 확인하세요</p>

      <div className="grid-2" style={{ marginBottom: 24 }}>
        <div className="kpi">
          <div className="label">활성 목표</div>
          <div className="big-num" style={{ color: 'var(--accent)' }}>{data.activeCount}</div>
        </div>
        <div className="kpi">
          <div className="label">일시중지 목표</div>
          <div className="big-num" style={{ color: '#f59e0b' }}>{data.inactiveCount}</div>
        </div>
      </div>

      <div className="grid-2" style={{ marginBottom: 24 }}>
        <div className="card">
          <div className="section-title">카테고리별 목표 수</div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={data.byCategory} margin={{ left: -20 }}>
              <XAxis dataKey="category" tick={{ fill: 'var(--text-sub)', fontSize: 11 }}/>
              <YAxis tick={{ fill: 'var(--text-sub)', fontSize: 11 }}/>
              <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}/>
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {data.byCategory.map((_: any, i: number) => <Cell key={i} fill={COLORS[i % COLORS.length]}/>)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <div className="section-title">카테고리별 평균 진행률</div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={data.byCategory} margin={{ left: -20 }}>
              <XAxis dataKey="category" tick={{ fill: 'var(--text-sub)', fontSize: 11 }}/>
              <YAxis tick={{ fill: 'var(--text-sub)', fontSize: 11 }} domain={[0, 100]}/>
              <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }} formatter={(v: number) => [`${v}%`, '평균 진행률']}/>
              <Bar dataKey="avgProgress" fill="var(--accent)" radius={[6, 6, 0, 0]}/>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card">
        <div className="section-title">최근 생성된 목표</div>
        <table>
          <thead>
            <tr>
              <th>제목</th>
              <th>카테고리</th>
              <th>진행률</th>
              <th>상태</th>
              <th>생성일</th>
            </tr>
          </thead>
          <tbody>
            {data.recentGoals.map((g: any) => (
              <tr key={g.id}>
                <td style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{g.title}</td>
                <td><span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 9999, background: 'var(--surface-hi)' }}>{g.category}</span></td>
                <td><span style={{ color: 'var(--accent)', fontWeight: 700 }}>{g.progressPercent}%</span></td>
                <td><span style={{ fontSize: 11, color: g.isActive ? 'var(--accent)' : '#f59e0b' }}>{g.isActive ? '진행 중' : '일시중지'}</span></td>
                <td style={{ color: 'var(--text-sub)', fontSize: 12 }}>{new Date(g.createdAt).toLocaleDateString('ko-KR')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
