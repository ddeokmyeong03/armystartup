import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { apiUsersAnalytics } from '../api';

export default function UsersPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiUsersAnalytics().then(setData).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ color: 'var(--text-sub)' }}>불러오는 중...</div>;
  if (!data) return <div style={{ color: '#ef4444' }}>데이터 로드 실패</div>;

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>유저 분석</h1>
      <p style={{ color: 'var(--text-sub)', fontSize: 14, marginBottom: 28 }}>월별 가입자 추이 및 전체 통계</p>

      <div className="kpi" style={{ marginBottom: 24, display: 'inline-block', minWidth: 200 }}>
        <div className="label">총 가입자</div>
        <div className="big-num" style={{ color: 'var(--accent)' }}>{data.totalUsers.toLocaleString()}</div>
      </div>

      <div className="card" style={{ marginBottom: 24 }}>
        <div className="section-title">월별 신규 가입자</div>
        {data.byMonth.length > 0 ? (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={[...data.byMonth].reverse()} margin={{ left: -20 }}>
              <XAxis dataKey="month" tick={{ fill: 'var(--text-sub)', fontSize: 11 }}/>
              <YAxis tick={{ fill: 'var(--text-sub)', fontSize: 11 }}/>
              <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}/>
              <Bar dataKey="count" fill="var(--accent)" radius={[6, 6, 0, 0]}/>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-sub)' }}>아직 데이터가 없습니다</div>
        )}
      </div>

      <div className="card" style={{ background: 'var(--accent-soft)', border: '1px solid rgba(34,255,178,0.2)' }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--accent)', marginBottom: 8 }}>💡 B2G 인사이트</div>
        <div style={{ fontSize: 13, color: 'var(--text-sub)', lineHeight: 1.7 }}>
          Millog는 현재 <strong style={{ color: 'var(--text)' }}>{data.totalUsers}명의 장병</strong>이 자기개발을 위해 활용하고 있습니다.
          월별 가입자 추이를 통해 서비스 성장세를 국방부·투자자에게 제시할 수 있습니다.
          계급·군종별 유저 분포 데이터는 향후 <strong style={{ color: 'var(--text)' }}>맞춤형 직업훈련 프로그램 제안</strong>의 근거가 됩니다.
        </div>
      </div>
    </div>
  );
}
