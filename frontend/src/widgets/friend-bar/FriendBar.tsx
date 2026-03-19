type Friend = {
  id: number;
  nickname: string;
  avatarUrl?: string;
};

type FriendBarProps = {
  friends: Friend[];
  onFriendClick: (friend: Friend) => void;
  onAddFriend: () => void;
};

function getInitial(nickname: string) {
  return nickname.charAt(0);
}

const BG_COLORS = ['#DCE8F8', '#DDEEDF', '#F8E8DC', '#EEE0F8', '#F8F0DC'];

function FriendAvatar({ friend, index, onClick }: { friend: Friend; index: number; onClick: () => void }) {
  const bg = BG_COLORS[index % BG_COLORS.length];
  return (
    <button onClick={onClick} className="flex flex-col items-center gap-1.5 shrink-0">
      <div
        className="w-11 h-11 rounded-full flex items-center justify-center text-[15px] font-bold text-[#111111]"
        style={{ backgroundColor: bg }}
      >
        {friend.avatarUrl ? (
          <img src={friend.avatarUrl} alt={friend.nickname} className="w-full h-full rounded-full object-cover" />
        ) : (
          getInitial(friend.nickname)
        )}
      </div>
      <span className="text-[11px] text-[#555555] max-w-[44px] truncate">{friend.nickname}</span>
    </button>
  );
}

function AddButton({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex flex-col items-center gap-1.5 shrink-0">
      <div className="w-11 h-11 rounded-full bg-[#EFEFEF] flex items-center justify-center">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8E8E93" strokeWidth="2.2">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </div>
      <span className="text-[11px] text-[#8E8E93]">추가</span>
    </button>
  );
}

export default function FriendBar({ friends, onFriendClick, onAddFriend }: FriendBarProps) {
  return (
    <div className="flex gap-4 overflow-x-auto px-5 py-3 scrollbar-hide">
      {friends.map((friend, idx) => (
        <FriendAvatar
          key={friend.id}
          friend={friend}
          index={idx}
          onClick={() => onFriendClick(friend)}
        />
      ))}
      <AddButton onClick={onAddFriend} />
    </div>
  );
}
