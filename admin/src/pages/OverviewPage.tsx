import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { apiOverview } from '../api';

const COLORS = ['#8b5cf6', '#f59e0b', '#10b981', '#ef4444', '#3b82f6', '#06b6d4', '#22FFB2'];

function KPI({ label, value, color, sub }: { label: string; value: string | number; color?: string; sub?: string }) {
  return (
    <div className="kpi">
      <div className="label">{label}</div>
      <div className="big-num" style={{ color: color ?? 'var(--text)' }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: 'var(--text-sub)', marginTop: 6 }}>{sub}</div>}
    </div>
  );
}

export default function OverviewPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiOverview().then(setData).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ color: 'var(--text-sub)' }}>불러오는 중...</div>;
  if (!data) return <div style={{ color: '#ef4444' }}>데이터 로드 실패. 로그인 정보를 확인하세요.</div>;

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>개요</h1>
      <p style={{ color: 'var(--text-sub)', fontSize: 14, marginBottom: 28 }}>Millog 전체 서비스 현황</p>

      <div className="grid-4" style={{ marginBottom: 24 }}>
        <KPI label="총 유저" value={data.totalUsers.toLocaleString()} color="var(--accent)" sub="누적 가입자"/>
        <KPI label="DAU" value={data.dauUsers} color="#3b82f6" sub="최근 24시간 신규"/>
        <KPI label="MAU" value={data.mauUsers} color="#8b5cf6" sub="최근 30일 신규"/>
        <KPI label="목표 달성률" value={`${data.goalCompletionRate}%`} color="#10b981" sub={`${data.completedGoals} / ${data.totalGoals}개`}/>
      </div>

      <div className="grid-2" style={{ marginBottom: 24 }}>
        <div className="card">
          <div className="section-title">목표 카테고리 분포</div>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={data.goalsByCategory} dataKey="count" nameKey="category" cx="50%" cy="50%" outerRadius={100} label={({ category, percent }) => `${category} ${(percent * 100).toFixed(0)}%`}>
                {data.goalsByCategory.map((_: any, i: number) => <Cell key={i} fill={COLORS[i % COLORS.length]}/>)}
              </Pie>
              <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}/>
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <div className="section-title">핵심 지표</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 8 }}>
            {[
              { label: '진행 중 목표', value: data.totalGoals, color: '#8b5cf6' },
              { label: '완료된 목표', value: data.completedGoals, color: 'var(--accent)' },
              { label: '등록된 일정', value: data.totalSchedules, color: '#f59e0b' },
              { label: '강의 추천 수', value: data.totalCourseViews, color: '#3b82f6' },
            ].map(m => (
              <div key={m.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: m.color, flexShrink: 0 }}/>
                  <span style={{ fontSize: 14, color: 'var(--text-sub)' }}>{m.label}</span>
                </div>
                <span style={{ fontSize: 20, fontWeight: 800, color: m.color }}>{m.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
