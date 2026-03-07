import Chip from '../../shared/ui/Chip';
import type { ChipItem } from '../../shared/model/types';

type TopChipBarProps = {
  chips: ChipItem[];
  onChipClick?: (id: string) => void;
};

export default function TopChipBar({ chips, onChipClick }: TopChipBarProps) {
  return (
    <div className="flex gap-2 overflow-x-auto px-5 py-3 scrollbar-none">
      {chips.map((chip) => (
        <Chip
          key={chip.id}
          label={chip.label}
          active={chip.active}
          onClick={() => onChipClick?.(chip.id)}
        />
      ))}
    </div>
  );
}
