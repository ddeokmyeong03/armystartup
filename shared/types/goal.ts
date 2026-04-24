export interface GoalItem {
  id: number;
  userId: number;
  title: string;
  category: string;
  deadline?: string;
  progressPercent: number;
  isActive: boolean;
  pinned: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateGoalPayload {
  title: string;
  category: string;
  deadline?: string;
  pinned?: boolean;
}

export interface UpdateGoalPayload {
  title?: string;
  category?: string;
  deadline?: string;
  progressPercent?: number;
  isActive?: boolean;
  pinned?: boolean;
}
