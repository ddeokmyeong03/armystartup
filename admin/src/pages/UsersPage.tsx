import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { apiUsersAnalytics } from '../api';

const PROVIDER_LABEL: Record<string, string> = {
  LOCAL: '이메일',
  GOOGLE: '구글',
  KAKAO: '카카오',
  NAVER: '네이버',
  APPLE: '애플',
};

export default function UsersPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    apiUsersAnalytics().then(setData).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ color: 'var(--text-sub)' }}>불러오는 중...</div>;
  if (!data) return <div style={{ color: '#ef4444' }}>데이터 로드 실패</div>;

  const filtered = (data.users ?? []).filter((u: any) => {
    const q = search.toLowerCase();
    return (
      u.nickname?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.rankName?.toLowerCase().includes(q) ||
      u.branch?.toLowerCase().includes(q) ||
      u.unitName?.toLowerCase().includes(q)
    );
  });

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
          <ResponsiveContainer width="100%" height={240}>
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

      {/* 가입자 목록 */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div className="section-title" style={{ margin: 0 }}>가입자 목록</div>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="닉네임 / 이메일 / 계급 / 군종 검색..."
            style={{
              height: 34, borderRadius: 8, border: '1px solid var(--border)',
              background: 'var(--surface-hi)', color: 'var(--text)',
              padding: '0 12px', fontSize: 12, width: 240,
            }}
          />
        </div>

        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-sub)' }}>
            {search ? '검색 결과가 없습니다' : '가입자가 없습니다'}
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  {['#', '닉네임', '이메일', '가입 방법', '계급', '군종', '소속 부대', '가입일'].map(h => (
                    <th key={h} style={{ padding: '8px 10px', textAlign: 'left', color: 'var(--text-sub)', fontWeight: 600, whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((u: any, i: number) => (
                  <tr key={u.id} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.15s' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface-hi)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                    <td style={{ padding: '10px 10px', color: 'var(--text-sub)' }}>{i + 1}</td>
                    <td style={{ padding: '10px 10px', fontWeight: 600 }}>{u.nickname}</td>
                    <td style={{ padding: '10px 10px', color: 'var(--text-sub)' }}>{u.email}</td>
                    <td style={{ padding: '10px 10px' }}>
                      <span style={{
                        display: 'inline-block', padding: '2px 8px', borderRadius: 6, fontSize: 11, fontWeight: 700,
                        background: u.provider === 'LOCAL' ? 'rgba(34,255,178,0.12)' : 'rgba(99,102,241,0.12)',
                        color: u.provider === 'LOCAL' ? 'var(--accent)' : '#818cf8',
                      }}>
                        {PROVIDER_LABEL[u.provider] ?? u.provider}
                      </span>
                    </td>
                    <td style={{ padding: '10px 10px' }}>{u.rankName ?? <span style={{ color: 'var(--text-sub)' }}>-</span>}</td>
                    <td style={{ padding: '10px 10px' }}>{u.branch ?? <span style={{ color: 'var(--text-sub)' }}>-</span>}</td>
                    <td style={{ padding: '10px 10px' }}>{u.unitName ?? <span style={{ color: 'var(--text-sub)' }}>-</span>}</td>
                    <td style={{ padding: '10px 10px', color: 'var(--text-sub)', whiteSpace: 'nowrap' }}>
                      {new Date(u.createdAt).toLocaleDateString('ko-KR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div style={{ marginTop: 12, fontSize: 12, color: 'var(--text-sub)', textAlign: 'right' }}>
          총 {filtered.length}명{search && ` (전체 ${data.users.length}명 중)`}
        </div>
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
