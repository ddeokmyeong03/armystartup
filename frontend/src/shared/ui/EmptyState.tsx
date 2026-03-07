type EmptyStateProps = {
  message: string;
  subMessage?: string;
};

export default function EmptyState({ message, subMessage }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-10 gap-1">
      <p className="text-[#8E8E93] text-sm font-medium">{message}</p>
      {subMessage && (
        <p className="text-[#B7B7BD] text-xs">{subMessage}</p>
      )}
    </div>
  );
}
