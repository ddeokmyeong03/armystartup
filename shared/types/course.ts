export interface CourseItem {
  id: number;
  title: string;
  source: string;
  category: string;
  durationMinutes: number;
  url?: string;
  matchScore: number;
}

export interface CourseRecommendation {
  id: number;
  course: CourseItem;
  reason: string;
}
