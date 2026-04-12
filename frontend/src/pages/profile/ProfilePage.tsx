import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { logout, getNickname } from '../../shared/lib/auth';
import Avatar from '../../shared/ui/Avatar';
import BottomNavBar from '../../shared/ui/BottomNavBar';
import apiClient from '../../shared/lib/apiClient';

// ─── 타입 ─────────────────────────────────────────────────────────────────────

type UserProfile = {
  wakeUpTime: string;
  sleepTime: string;
  availableStudyMinutes: number;
  preferredPlanIntensity: 'LOW' | 'MEDIUM' | 'HIGH';
  memo: string | null;
  dischargeDate: string | null;
  unitName: string | null;
  rankName: string | null;
};

type ActivitySummary = {
  completedCourses: number;
  studyDays: number;
  goalAchieveRate: number;
};

// ─── 상수 ─────────────────────────────────────────────────────────────────────

const INTENSITY_LABEL: Record<string, string> = {
  LOW: '여유롭게',
  MEDIUM: '적당하게',
  HIGH: '집중적으로',
};

const INTENSITY_OPTIONS = [
  { value: 'LOW', label: '여유롭게' },
  { value: 'MEDIUM', label: '적당하게' },
  { value: 'HIGH', label: '집중적으로' },
];

// ─── 서브컴포넌트 ──────────────────────────────────────────────────────────────

function ProfileRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[13px] text-[#8E8E93]">{label}</span>
      <span className="text-[13px] font-medium text-[#111111]">{value}</span>
    </div>
  );
}

function DdayBadge({ dischargeDate }: { dischargeDate: string }) {
  const daysLeft = dayjs(dischargeDate).diff(dayjs(), 'day');
  const isNear = daysLeft <= 90;
  const isPast = daysLeft < 0;

  return (
    <div
      className={`flex items-center gap-2 rounded-[14px] px-4 py-3 ${
        isPast ? 'bg-[#E8F4E8]' : isNear ? 'bg-[#FFF3DC]' : 'bg-[#DCE8F8]'
      }`}
    >
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center ${
          isPast ? 'bg-[#3A7D44]' : isNear ? 'bg-[#B07830]' : 'bg-[#4A7BAF]'
        }`}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      </div>
      <div>
        <p
          className={`text-[11px] font-medium ${
            isPast ? 'text-[#3A7D44]' : isNear ? 'text-[#B07830]' : 'text-[#4A7BAF]'
          }`}
        >
          {isPast ? '전역 완료' : '전역까지'}
        </p>
        <p
          className={`text-[17px] font-bold leading-none ${
            isPast ? 'text-[#3A7D44]' : isNear ? 'text-[#B07830]' : 'text-[#4A7BAF]'
          }`}
        >
          {isPast ? '전역했습니다!' : `D-${daysLeft}`}
        </p>
      </div>
      <div className="ml-auto text-right">
        <p className="text-[11px] text-[#8E8E93]">전역 예정일</p>
        <p className="text-[12px] font-semibold text-[#111111]">{dischargeDate}</p>
      </div>
    </div>
  );
}

function ActivityCard({ summary }: { summary: ActivitySummary }) {
  return (
    <div className="bg-white rounded-[20px] px-5 py-5">
      <p className="text-[13px] font-semibold text-[#111111] mb-3">활동 요약</p>
      <div className="grid grid-cols-3 gap-3">
        <div className="flex flex-col items-center gap-1 bg-[#F8F8F6] rounded-[14px] py-3">
          <span className="text-[22px] font-bold text-[#4A7BAF]">{summary.studyDays}</span>
          <span className="text-[11px] text-[#8E8E93]">학습 일수</span>
        </div>
        <div className="flex flex-col items-center gap-1 bg-[#F8F8F6] rounded-[14px] py-3">
          <span className="text-[22px] font-bold text-[#3A7D44]">{summary.completedCourses}</span>
          <span className="text-[11px] text-[#8E8E93]">완료 강의</span>
        </div>
        <div className="flex flex-col items-center gap-1 bg-[#F8F8F6] rounded-[14px] py-3">
          <span className="text-[22px] font-bold text-[#B07830]">{summary.goalAchieveRate}%</span>
          <span className="text-[11px] text-[#8E8E93]">목표 달성</span>
        </div>
      </div>
    </div>
  );
}

// ─── 메인 ─────────────────────────────────────────────────────────────────────

export default function ProfilePage() {
  const navigate = useNavigate();
  const nickname = getNickname();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [activity, setActivity] = useState<ActivitySummary>({ completedCourses: 0, studyDays: 0, goalAchieveRate: 0 });
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    wakeUpTime: '06:30',
    sleepTime: '23:00',
    availableStudyMinutes: 60,
    preferredPlanIntensity: 'MEDIUM',
    memo: '',
    dischargeDate: '',
    unitName: '',
    rankName: '',
  });
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  useEffect(() => {
    apiClient
      .get<{ data: UserProfile }>('/api/profiles/me')
      .then((res) => {
        const p = res.data.data;
        if (!p) return;
        setProfile(p);
        setForm({
          wakeUpTime: p.wakeUpTime,
          sleepTime: p.sleepTime,
          availableStudyMinutes: p.availableStudyMinutes,
          preferredPlanIntensity: p.preferredPlanIntensity,
          memo: p.memo ?? '',
          dischargeDate: p.dischargeDate ?? '',
          unitName: p.unitName ?? '',
          rankName: p.rankName ?? '',
        });
      })
      .catch(() => {});

    // 활동 요약: 완료 강의 수
    apiClient
      .get<{ data: Array<{ status: string }> }>('/api/courses/saved')
      .then((res) => {
        const saved = res.data.data ?? [];
        const completed = saved.filter((c) => c.status === 'SAVED').length;
        setActivity((prev) => ({ ...prev, completedCourses: completed }));
      })
      .catch(() => {});

    // 활동 요약: 목표 달성률
    apiClient
      .get<{ data: Array<{ progressPercent: number }> }>('/api/goals')
      .then((res) => {
        const goals = res.data.data ?? [];
        if (goals.length > 0) {
          const avg = Math.round(
            goals.reduce((sum, g) => sum + (g.progressPercent ?? 0), 0) / goals.length,
          );
          setActivity((prev) => ({ ...prev, goalAchieveRate: avg }));
        }
      })
      .catch(() => {});
  }, []);

  function handleLogout() {
    if (confirm('로그아웃 하시겠어요?')) {
      logout();
      navigate('/onboarding', { replace: true });
    }
  }

  async function handleSave() {
    setSaveError('');
    setSaving(true);
    try {
      await apiClient.post('/api/profiles', {
        wakeUpTime: form.wakeUpTime,
        sleepTime: form.sleepTime,
        availableStudyMinutes: form.availableStudyMinutes,
        preferredPlanIntensity: form.preferredPlanIntensity,
        memo: form.memo || undefined,
        dischargeDate: form.dischargeDate || undefined,
        unitName: form.unitName || undefined,
        rankName: form.rankName || undefined,
      });
      setProfile({
        wakeUpTime: form.wakeUpTime,
        sleepTime: form.sleepTime,
        availableStudyMinutes: form.availableStudyMinutes,
        preferredPlanIntensity: form.preferredPlanIntensity as 'LOW' | 'MEDIUM' | 'HIGH',
        memo: form.memo || null,
        dischargeDate: form.dischargeDate || null,
        unitName: form.unitName || null,
        rankName: form.rankName || null,
      });
      setEditing(false);
    } catch {
      setSaveError('저장에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setSaving(false);
    }
  }

  const menuItems = [
    {
      label: '프로필 수정',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      ),
      onClick: () => navigate('/profile/edit'),
    },
    {
      label: '강의 목록',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
        </svg>
      ),
      onClick: () => navigate('/courses'),
    },
    {
      label: '알림 설정',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
      ),
      onClick: () => navigate('/notifications'),
    },
    {
      label: '목표 관리',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="6" />
          <circle cx="12" cy="12" r="2" fill="currentColor" stroke="none" />
        </svg>
      ),
      onClick: () => navigate('/goals'),
    },
    {
      label: '설정',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      ),
      onClick: () => navigate('/settings'),
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8F8F6] flex flex-col">
      {/* 헤더 */}
      <div className="px-5 pt-12 pb-4">
        <h1 className="text-[20px] font-bold text-[#111111]">내 정보</h1>
      </div>

      <div className="flex-1 overflow-y-auto pb-28 px-5 flex flex-col gap-4">
        {/* 프로필 카드 */}
        <div className="bg-white rounded-[20px] px-5 py-5 flex items-center gap-4">
          <Avatar size={56} alt={nickname} />
          <div className="flex-1 min-w-0">
            <p className="text-[17px] font-bold text-[#111111] truncate">{nickname}</p>
            <div className="flex items-center gap-2 mt-0.5">
              {profile?.rankName && (
                <span className="text-[12px] text-[#4A7BAF] font-medium">{profile.rankName}</span>
              )}
              {profile?.unitName && (
                <span className="text-[12px] text-[#8E8E93]">{profile.unitName}</span>
              )}
              {!profile?.rankName && !profile?.unitName && (
                <span className="text-[12px] text-[#8E8E93]">Millog 사용자</span>
              )}
            </div>
          </div>
        </div>

        {/* 전역 D-day 배지 */}
        {profile?.dischargeDate && (
          <DdayBadge dischargeDate={profile.dischargeDate} />
        )}

        {/* 활동 요약 */}
        <ActivityCard summary={activity} />

        {/* 자기개발 설정 카드 */}
        {editing ? (
          <div className="bg-white rounded-[20px] px-5 py-5 flex flex-col gap-4">
            <p className="text-[13px] font-semibold text-[#111111]">자기개발 설정</p>

            {/* 군 정보 */}
            <div className="flex gap-3">
              <div className="flex flex-col gap-1 flex-1">
                <label className="text-[11px] font-semibold text-[#8E8E93]">계급</label>
                <input
                  type="text"
                  value={form.rankName}
                  onChange={(e) => setForm((p) => ({ ...p, rankName: e.target.value }))}
                  placeholder="예: 일병"
                  className="h-[44px] bg-[#F8F8F6] rounded-[12px] px-3 text-[14px] text-[#111111] placeholder:text-[#C7C7CC] outline-none"
                />
              </div>
              <div className="flex flex-col gap-1 flex-1">
                <label className="text-[11px] font-semibold text-[#8E8E93]">부대</label>
                <input
                  type="text"
                  value={form.unitName}
                  onChange={(e) => setForm((p) => ({ ...p, unitName: e.target.value }))}
                  placeholder="예: 00사단"
                  className="h-[44px] bg-[#F8F8F6] rounded-[12px] px-3 text-[14px] text-[#111111] placeholder:text-[#C7C7CC] outline-none"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-semibold text-[#8E8E93]">전역 예정일</label>
              <input
                type="date"
                value={form.dischargeDate}
                onChange={(e) => setForm((p) => ({ ...p, dischargeDate: e.target.value }))}
                className="h-[44px] bg-[#F8F8F6] rounded-[12px] px-3 text-[14px] text-[#111111] outline-none"
              />
            </div>

            <div className="h-px bg-[#F0F0F0]" />

            <div className="flex gap-3">
              <div className="flex flex-col gap-1 flex-1">
                <label className="text-[11px] font-semibold text-[#8E8E93]">기상 시간</label>
                <input
                  type="time"
                  value={form.wakeUpTime}
                  onChange={(e) => setForm((p) => ({ ...p, wakeUpTime: e.target.value }))}
                  className="h-[44px] bg-[#F8F8F6] rounded-[12px] px-3 text-[14px] text-[#111111] outline-none"
                />
              </div>
              <div className="flex flex-col gap-1 flex-1">
                <label className="text-[11px] font-semibold text-[#8E8E93]">취침 시간</label>
                <input
                  type="time"
                  value={form.sleepTime}
                  onChange={(e) => setForm((p) => ({ ...p, sleepTime: e.target.value }))}
                  className="h-[44px] bg-[#F8F8F6] rounded-[12px] px-3 text-[14px] text-[#111111] outline-none"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-semibold text-[#8E8E93]">
                하루 가용 학습 시간: <span className="text-[#111111]">{form.availableStudyMinutes}분</span>
              </label>
              <input
                type="range"
                min={0}
                max={240}
                step={10}
                value={form.availableStudyMinutes}
                onChange={(e) => setForm((p) => ({ ...p, availableStudyMinutes: Number(e.target.value) }))}
                className="w-full accent-[#111111]"
              />
              <div className="flex justify-between text-[11px] text-[#C7C7CC]">
                <span>0분</span>
                <span>240분</span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-semibold text-[#8E8E93]">선호 학습 강도</label>
              <div className="flex gap-2">
                {INTENSITY_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setForm((p) => ({ ...p, preferredPlanIntensity: opt.value }))}
                    className={`flex-1 h-9 rounded-[10px] text-[12px] font-semibold transition-colors ${
                      form.preferredPlanIntensity === opt.value
                        ? 'bg-[#111111] text-white'
                        : 'bg-[#F8F8F6] text-[#8E8E93]'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-semibold text-[#8E8E93]">메모 (선택)</label>
              <textarea
                value={form.memo}
                onChange={(e) => setForm((p) => ({ ...p, memo: e.target.value }))}
                placeholder="군 생활 특이사항을 입력하세요"
                rows={2}
                maxLength={200}
                className="bg-[#F8F8F6] rounded-[12px] px-3 py-2.5 text-[14px] text-[#111111] placeholder:text-[#C7C7CC] outline-none resize-none"
              />
            </div>

            {saveError && <p className="text-[12px] text-[#E05C5C]">{saveError}</p>}

            <div className="flex gap-2 pt-1">
              <button
                onClick={() => { setEditing(false); setSaveError(''); }}
                className="flex-1 h-[44px] bg-[#F8F8F6] text-[#8E8E93] rounded-[12px] text-[14px] font-semibold"
              >
                취소
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 h-[44px] bg-[#111111] text-white rounded-[12px] text-[14px] font-semibold disabled:opacity-50"
              >
                {saving ? '저장 중...' : '저장'}
              </button>
            </div>
          </div>
        ) : profile ? (
          <div className="bg-white rounded-[20px] px-5 py-5 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <p className="text-[13px] font-semibold text-[#111111]">자기개발 설정</p>
              <button
                onClick={() => setEditing(true)}
                className="text-[12px] font-medium text-[#4A7BAF]"
              >
                수정
              </button>
            </div>
            <div className="flex flex-col gap-2.5">
              <ProfileRow label="기상 시간" value={profile.wakeUpTime} />
              <ProfileRow label="취침 시간" value={profile.sleepTime} />
              <ProfileRow label="하루 가용 시간" value={`${profile.availableStudyMinutes}분`} />
              <ProfileRow label="학습 강도" value={INTENSITY_LABEL[profile.preferredPlanIntensity] ?? profile.preferredPlanIntensity} />
              {profile.memo && <ProfileRow label="메모" value={profile.memo} />}
            </div>
          </div>
        ) : (
          <button
            onClick={() => setEditing(true)}
            className="bg-white rounded-[20px] px-5 py-5 flex items-center justify-center gap-2 text-[14px] font-medium text-[#4A7BAF]"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            자기개발 설정 추가하기
          </button>
        )}

        {/* 메뉴 목록 */}
        <div className="bg-white rounded-[20px] overflow-hidden">
          {menuItems.map((item, idx) => (
            <button
              key={item.label}
              onClick={item.onClick}
              className={`w-full flex items-center gap-4 px-5 py-4 text-left ${
                idx < menuItems.length - 1 ? 'border-b border-[#F0F0F0]' : ''
              }`}
            >
              <div className="text-[#8E8E93]">{item.icon}</div>
              <span className="text-[15px] font-medium text-[#111111]">{item.label}</span>
              <svg className="ml-auto" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C7C7CC" strokeWidth="2">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          ))}
        </div>

        {/* 보안 정책 */}
        <div className="bg-white rounded-[20px] px-5 py-4 flex flex-col gap-2">
          <div className="flex items-center gap-2 mb-1">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8E8E93" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <p className="text-[12px] font-semibold text-[#8E8E93]">보안 정책</p>
          </div>
          <p className="text-[12px] text-[#8E8E93] leading-relaxed">
            • 모든 데이터는 암호화되어 저장됩니다<br />
            • 개인 정보는 군 보안 규정에 따라 보호됩니다<br />
            • 활동 이력은 30일 후 자동으로 삭제됩니다<br />
            • 비밀 이상의 군사 정보는 절대 입력하지 마세요
          </p>
        </div>

        {/* 로그아웃 */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-4 bg-white rounded-[20px] px-5 py-4 text-left"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#E05C5C" strokeWidth="1.8">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          <span className="text-[15px] font-medium text-[#E05C5C]">로그아웃</span>
        </button>

        <p className="text-center text-[12px] text-[#C7C7CC]">Millog v1.0.0</p>
      </div>

      <BottomNavBar />
    </div>
  );
}
