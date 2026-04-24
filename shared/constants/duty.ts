export const DUTY_TYPES = [
  { id: 'guard-night', label: '불침번',    fatigue: 0.9, color: '#8b5cf6', glyph: '불', hours: 2 },
  { id: 'cctv',        label: 'CCTV',      fatigue: 0.5, color: '#3b82f6', glyph: 'C',  hours: 4 },
  { id: 'duty-day',    label: '주간 당직', fatigue: 0.7, color: '#f59e0b', glyph: '주', hours: 4 },
  { id: 'duty-night',  label: '야간 당직', fatigue: 1.0, color: '#ef4444', glyph: '야', hours: 6 },
  { id: 'mess-clean',  label: '식당청소',  fatigue: 0.4, color: '#10b981', glyph: '식', hours: 2 },
  { id: 'training',    label: '훈련',      fatigue: 0.9, color: '#f43f5e', glyph: '훈', hours: 9 },
  { id: 'crst',        label: 'CRST',      fatigue: 1.0, color: '#dc2626', glyph: 'R',  hours: 8 },
  { id: 'gate',        label: '위병소',    fatigue: 0.6, color: '#06b6d4', glyph: '위', hours: 4 },
] as const;
