import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout, getNickname } from '../../shared/lib/auth';
import Avatar from '../../shared/ui/Avatar';
import BottomNavBar from '../../shared/ui/BottomNavBar';
import apiClient from '../../shared/lib/apiClient';

type UserProfile = {
  wakeUpTime: string;
  sleepTime: string;
  availableStudyMinutes: number;
  preferredPlanIntensity: 'LOW' | 'MEDIUM' | 'HIGH';
  memo: string | null;
};

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

type MenuItem = {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
};

export default function ProfilePage() {
  const navigate = useNavigate();
  const nickname = getNickname();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    wakeUpTime: '06:30',
    sleepTime: '23:00',
    availableStudyMinutes: 60,
    preferredPlanIntensity: 'MEDIUM',
    memo: '',
  });
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  useEffect(() => {
    apiClient
      .get<{ data: UserProfile }>('/api/profiles/me')
      .then((res) => {
        const p = res.data.data;
        setProfile(p);
        setForm({
          wakeUpTime: p.wakeUpTime,
          sleepTime: p.sleepTime,
          availableStudyMinutes: p.availableStudyMinutes,
          preferredPlanIntensity: p.preferredPlanIntensity,
          memo: p.memo ?? '',
        });
      })
      .catch(() => {
        // 프로필 미설정 상태
      });
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
      });
      setProfile({
        wakeUpTime: form.wakeUpTime,
        sleepTime: form.sleepTime,
        availableStudyMinutes: form.availableStudyMinutes,
        preferredPlanIntensity: form.preferredPlanIntensity as 'LOW' | 'MEDIUM' | 'HIGH',
        memo: form.memo || null,
      });
      setEditing(false);
    } catch {
      setSaveError('저장에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setSaving(false);
    }
  }

  const menuItems: MenuItem[] = [
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
      <div className="px-5 pt-12 pb-4 flex items-center justify-between">
        <h1 className="text-[20px] font-bold text-[#111111]">내 정보</h1>
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="text-[14px] font-medium text-[#4A7BAF]"
          >
            수정
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto pb-28 px-5 flex flex-col gap-4">
        {/* 프로필 카드 */}
        <div className="bg-white rounded-[20px] px-5 py-5 flex items-center gap-4">
          <Avatar size={56} alt={nickname} />
          <div className="flex-1 min-w-0">
            <p className="text-[17px] font-bold text-[#111111] truncate">{nickname}</p>
            <p className="text-[13px] text-[#8E8E93] mt-0.5">Millog 사용자</p>
          </div>
        </div>

        {/* 자기개발 설정 카드 */}
        {editing ? (
          <div className="bg-white rounded-[20px] px-5 py-5 flex flex-col gap-4">
            <p className="text-[13px] font-semibold text-[#111111]">자기개발 설정</p>

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
            <p className="text-[13px] font-semibold text-[#111111]">자기개발 설정</p>
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

function ProfileRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[13px] text-[#8E8E93]">{label}</span>
      <span className="text-[13px] font-medium text-[#111111]">{value}</span>
    </div>
  );
}
