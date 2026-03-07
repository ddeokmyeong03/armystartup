import type { ReactNode } from 'react';

type IconButtonProps = {
  children: ReactNode;
  onClick?: () => void;
  label: string;
};

export default function IconButton({ children, onClick, label }: IconButtonProps) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="w-11 h-11 flex items-center justify-center rounded-full text-[#8E8E93] hover:bg-[#EFEFEF] transition-colors"
    >
      {children}
    </button>
  );
}
