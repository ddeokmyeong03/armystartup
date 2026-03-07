export type ChipItem = {
  id: string;
  label: string;
  active: boolean;
};

export type CalendarDayModel = {
  date: string; // 'YYYY-MM-DD'
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  hasSchedule: boolean;
  hasAiPlan: boolean;
  scheduleCount: number;
};

export type SchedulePreviewModel = {
  id: number;
  title: string;
  startTime: string;
  endTime: string;
  category: string;
};

export type AiPlanPreviewModel = {
  id: number;
  title: string;
  startTime: string;
  endTime: string;
  status: 'RECOMMENDED' | 'APPLIED' | 'COMPLETED' | 'MISSED';
};

export type UserModel = {
  id: number;
  nickname: string;
  email: string;
  avatarUrl?: string;
  message?: string;
};
