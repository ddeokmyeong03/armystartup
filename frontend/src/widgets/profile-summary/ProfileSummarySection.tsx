import Avatar from '../../shared/ui/Avatar';
import IconButton from '../../shared/ui/IconButton';

type ProfileSummarySectionProps = {
  nickname: string;
  message?: string;
  avatarUrl?: string;
  onProfileClick?: () => void;
  onSettingsClick?: () => void;
};

export default function ProfileSummarySection({
  nickname,
  message,
  avatarUrl,
  onProfileClick,
  onSettingsClick,
}: ProfileSummarySectionProps) {
  return (
    <div className="flex items-center gap-3 px-5 py-3">
      <button onClick={onProfileClick} className="flex items-center gap-3 flex-1 text-left min-w-0">
        <Avatar src={avatarUrl} alt={nickname} size={46} />
        <div className="min-w-0">
          <p className="text-base font-semibold text-[#111111] leading-tight truncate">{nickname}</p>
          {message && (
            <p className="text-sm text-[#8E8E93] leading-tight truncate">{message}</p>
          )}
        </div>
      </button>

      <div className="flex gap-1 shrink-0">
        {/* 알림 아이콘 */}
        <IconButton label="알림" onClick={() => {}}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
        </IconButton>
        {/* 설정 아이콘 */}
        <IconButton label="설정" onClick={onSettingsClick}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </IconButton>
      </div>
    </div>
  );
}
