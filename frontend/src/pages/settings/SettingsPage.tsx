import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNavBar from '../../shared/ui/BottomNavBar';

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className={`w-11 h-6 rounded-full transition-colors relative ${value ? 'bg-[#111111]' : 'bg-[#D1D1D6]'}`}
    >
      <span
        className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
          value ? 'translate-x-5' : 'translate-x-0.5'
        }`}
      />
    </button>
  );
}

type SettingRowProps = {
  label: string;
  description?: string;
  right: React.ReactNode;
  onClick?: () => void;
};

function SettingRow({ label, description, right, onClick }: SettingRowProps) {
  return (
    <button
      onClick={onClick}
      disabled={!onClick && typeof right !== 'undefined'}
      className="w-full flex items-center justify-between px-5 py-4 text-left border-b border-[#F0F0F0] last:border-0"
    >
      <div>
        <p className="text-[15px] font-medium text-[#111111]">{label}</p>
        {description && <p className="text-[12px] text-[#8E8E93] mt-0.5">{description}</p>}
      </div>
      <div className="shrink-0 ml-3">{right}</div>
    </button>
  );
}

export default function SettingsPage() {
  const navigate = useNavigate();
  const [pushEnabled, setPushEnabled] = useState(true);
  const [scheduleReminder, setScheduleReminder] = useState(true);
  const [courseAlert, setCourseAlert] = useState(true);
  const [goalReminder, setGoalReminder] = useState(false);

  const chevron = (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C7C7CC" strokeWidth="2">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );

  return (
    <div className="min-h-screen bg-[#F8F8F6] flex flex-col">
      {/* 헤더 */}
      <div className="flex items-center gap-3 px-5 pt-12 pb-2">
        <button onClick={() => navigate(-1)} className="w-9 h-9 flex items-center justify-center" aria-label="뒤로가기">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#111111" strokeWidth="2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <h1 className="text-[17px] font-semibold text-[#111111]">설정</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-3 pb-28 flex flex-col gap-4">
        {/* 알림 설정 */}
        <div className="bg-white rounded-[20px] overflow-hidden">
          <p className="px-5 pt-4 pb-2 text-[12px] font-semibold text-[#8E8E93] uppercase tracking-wide">알림</p>
          <SettingRow
            label="푸시 알림"
            description="모든 알림을 켜거나 끕니다"
            right={<Toggle value={pushEnabled} onChange={setPushEnabled} />}
          />
          <SettingRow
            label="일정 알림"
            description="일정 30분 전에 알려드려요"
            right={<Toggle value={scheduleReminder} onChange={setScheduleReminder} />}
          />
          <SettingRow
            label="강의 추천 알림"
            description="새로운 AI 추천 강의가 도착하면 알려드려요"
            right={<Toggle value={courseAlert} onChange={setCourseAlert} />}
          />
          <SettingRow
            label="목표 리마인더"
            description="매일 저녁 목표 현황을 알려드려요"
            right={<Toggle value={goalReminder} onChange={setGoalReminder} />}
          />
        </div>

        {/* 계정 설정 */}
        <div className="bg-white rounded-[20px] overflow-hidden">
          <p className="px-5 pt-4 pb-2 text-[12px] font-semibold text-[#8E8E93] uppercase tracking-wide">계정</p>
          <SettingRow
            label="프로필 수정"
            right={chevron}
            onClick={() => navigate('/profile')}
          />
          <SettingRow
            label="비밀번호 변경"
            right={chevron}
            onClick={() => {}}
          />
        </div>

        {/* 앱 정보 */}
        <div className="bg-white rounded-[20px] overflow-hidden">
          <p className="px-5 pt-4 pb-2 text-[12px] font-semibold text-[#8E8E93] uppercase tracking-wide">앱 정보</p>
          <SettingRow label="버전" right={<span className="text-[14px] text-[#8E8E93]">v1.0.0</span>} />
          <SettingRow label="개인정보처리방침" right={chevron} onClick={() => {}} />
          <SettingRow label="서비스 이용약관" right={chevron} onClick={() => {}} />
        </div>
      </div>

      <BottomNavBar />
    </div>
  );
}
