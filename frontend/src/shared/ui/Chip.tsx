type ChipProps = {
  label: string;
  active?: boolean;
  onClick?: () => void;
};

export default function Chip({ label, active = false, onClick }: ChipProps) {
  return (
    <button
      onClick={onClick}
      className={`
        px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors
        ${active
          ? 'bg-[#E4E4E4] text-[#111111]'
          : 'bg-[#EFEFEF] text-[#8E8E93]'}
      `}
    >
      {label}
    </button>
  );
}
