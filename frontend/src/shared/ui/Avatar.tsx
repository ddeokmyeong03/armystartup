type AvatarProps = {
  src?: string;
  alt?: string;
  size?: number;
};

export default function Avatar({ src, alt = '프로필', size = 44 }: AvatarProps) {
  return (
    <div
      className="rounded-full bg-[#E4E4E4] flex items-center justify-center overflow-hidden shrink-0"
      style={{ width: size, height: size }}
    >
      {src ? (
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      ) : (
        <span className="text-[#8E8E93] text-lg font-semibold select-none">
          {alt.charAt(0)}
        </span>
      )}
    </div>
  );
}
