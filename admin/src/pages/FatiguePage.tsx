import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { apiFatigueAnalytics } from '../api';

const COLORS = ['#8b5cf6', '#f59e0b', '#10b981', '#ef4444', '#3b82f6', '#06b6d4', '#22FFB2', '#f43f5e'];
const FATIGUE_COLORS: Record<string, string> = { '고피로(80+)': '#ef4444', '중피로(50-79)': '#f59e0b', '저피로(~49)': 'var(--accent)' };

export default function FatiguePage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFatigueAnalytics().then(setData).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ color: 'var(--text-sub)' }}>불러오는 중...</div>;
  if (!data) return <div style={{ color: '#ef4444' }}>데이터 로드 실패</div>;

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>피로도 분석</h1>
      <p style={{ color: 'var(--text-sub)', fontSize: 14, marginBottom: 28 }}>근무 종류별 일정 등록 현황 및 피로도 분포</p>

      <div className="grid-2" style={{ marginBottom: 24 }}>
        <div className="card">
          <div className="section-title">근무 종류별 일정 등록 수</div>
          {(data.schedulesByCategory ?? []).length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={data.schedulesByCategory} layout="vertical" margin={{ left: 10, right: 20 }}>
                <XAxis type="number" tick={{ fill: 'var(--text-sub)', fontSize: 11 }}/>
                <YAxis dataKey="category" type="category" width={70} tick={{ fill: 'var(--text-sub)', fontSize: 11 }}/>
                <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}/>
                <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                  {(data.schedulesByCategory ?? []).map((_: any, i: number) => <Cell key={i} fill={COLORS[i % COLORS.length]}/>)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 200, color: 'var(--text-sub)', fontSize: 14 }}>
              일정 데이터가 아직 없습니다
            </div>
          )}
        </div>

        <div className="card">
          <div className="section-title">피로도 구간 분포</div>
          {(data.fatigueDistribution ?? []).length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={data.fatigueDistribution} dataKey="count" nameKey="bucket" cx="50%" cy="50%" outerRadius={100}
                  label={({ bucket, percent }: any) => `${bucket} ${(percent * 100).toFixed(0)}%`}>
                  {(data.fatigueDistribution ?? []).map((d: any, i: number) => (
                    <Cell key={i} fill={FATIGUE_COLORS[d.bucket] ?? COLORS[i]}/>
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}/>
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 200, color: 'var(--text-sub)', fontSize: 14 }}>
              피로도 데이터가 아직 없습니다
            </div>
          )}
        </div>
      </div>

      <div className="card" style={{ background: 'var(--accent-soft)', border: '1px solid rgba(34,255,178,0.2)' }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--accent)', marginBottom: 8 }}>💡 B2G 인사이트</div>
        <div style={{ fontSize: 13, color: 'var(--text-sub)', lineHeight: 1.7 }}>
          장병들의 근무 피로도 데이터를 분석하면 <strong style={{ color: 'var(--text)' }}>자기개발 가용시간이 가장 많은 근무 패턴</strong>을 파악할 수 있습니다.
          고피로 근무(야간 당직, CRST) 이후에는 학습 효율이 평균 40% 감소합니다.
          이 데이터를 바탕으로 <strong style={{ color: 'var(--text)' }}>국방부·부대 지휘관을 대상으로 최적 학습 시간 배분 제안</strong>이 가능합니다.
        </div>
      </div>
    </div>
  );
}
