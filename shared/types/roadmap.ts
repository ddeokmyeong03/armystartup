export interface RoadmapStage {
  week: string;
  title: string;
  status: 'completed' | 'in_progress' | 'pending';
  items: string[];
  checkedItems?: number[];
}

export interface RoadmapItem {
  id: number;
  goalId: number;
  goal: { id: number; title: string };
  totalWeeks: number;
  progressPercent: number;
  updateCount: number;
  stages: RoadmapStage[];
}
