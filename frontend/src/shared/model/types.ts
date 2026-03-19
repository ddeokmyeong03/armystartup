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

export type WeeklyDayModel = CalendarDayModel & {
  dayLabel: string; // '일', '월', '화', ...
};

export type AiChatMessage = {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: string;
};

export type CourseSource = 'JANGBYEONGEEUM' | 'DEFENSE_TRANSITION' | 'K_MOOC';

export type CourseModel = {
  id: number;
  title: string;
  source: CourseSource;
  category: string;
  targetGoalType: string | null;
  description: string;
  durationMinutes: number;
  url: string;
  tags: string[];
};

export type CourseRecommendationModel = {
  id: number;
  course: CourseModel;
  reason: string;
  priority: number;
  goalTitle: string | null;
};
