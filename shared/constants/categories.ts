export const GOAL_CATEGORIES = ['자격증', '어학', '취업', '취미', '독서', '체력', '기타'] as const;
export type GoalCategory = typeof GOAL_CATEGORIES[number];

export const GOAL_CAT_COLORS: Record<string, string> = {
  '자격증': '#8b5cf6',
  '어학': '#f59e0b',
  '취업': '#10b981',
  '취미': '#ef4444',
  '독서': '#3b82f6',
  '체력': '#06b6d4',
  '기타': '#6b7280',
};

export const COURSE_SOURCES = ['유데미', '인프런', '유튜브', 'K-MOOC', '기타'] as const;

export const INTEREST_LABELS: Record<string, string> = {
  cert: '자격증', lang: '어학', job: '취업/진로', hobby: '취미',
  read: '독서', health: '체력', finance: '금융/재테크', it: '개발/IT',
};

export const INTEREST_COLORS: Record<string, string> = {
  cert: '#8b5cf6', lang: '#f59e0b', job: '#10b981', hobby: '#ef4444',
  read: '#3b82f6', health: '#06b6d4', finance: '#22FFB2', it: '#a855f7',
};
