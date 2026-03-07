type FriendActionSectionProps = {
  onGoFriends?: () => void;
};

export default function FriendActionSection({ onGoFriends }: FriendActionSectionProps) {
  return (
    <button
      onClick={onGoFriends}
      className="mx-5 mb-6 w-[calc(100%-40px)] flex items-center gap-3 bg-white rounded-[20px] px-4 py-3.5"
    >
      {/* 아이콘 */}
      <div className="w-9 h-9 rounded-full bg-[#DDEEDF] flex items-center justify-center shrink-0">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3D7A57" strokeWidth="1.8">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      </div>

      {/* 텍스트 */}
      <div className="flex-1 text-left min-w-0">
        <p className="text-sm font-semibold text-[#111111]">함께 성장하는 동료</p>
        <p className="text-xs text-[#8E8E93] mt-0.5">친구와 목표를 공유하고 함께 도전해보세요</p>
      </div>

      {/* 화살표 */}
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8E8E93" strokeWidth="2" className="shrink-0">
        <polyline points="9 18 15 12 9 6" />
      </svg>
    </button>
  );
}
