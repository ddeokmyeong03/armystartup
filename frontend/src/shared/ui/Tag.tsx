type TagVariant = 'default' | 'ai' | 'success' | 'warning';

type TagProps = {
  label: string;
  variant?: TagVariant;
};

const variantStyles: Record<TagVariant, string> = {
  default: 'bg-[#EFEFEF] text-[#8E8E93]',
  ai: 'bg-[#DCE8F8] text-[#4A7BAF]',
  success: 'bg-[#DDEEDF] text-[#3D7A57]',
  warning: 'bg-[#FFF3E0] text-[#D98E2F]',
};

export default function Tag({ label, variant = 'default' }: TagProps) {
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${variantStyles[variant]}`}>
      {label}
    </span>
  );
}
