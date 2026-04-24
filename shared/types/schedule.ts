export interface ScheduleItem {
  id: number;
  userId: number;
  title: string;
  category: string;
  date: string;
  endDate?: string;
  startTime: string;
  endTime: string;
  memo?: string;
  createdAt: string;
}
