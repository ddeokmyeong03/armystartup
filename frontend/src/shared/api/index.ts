import apiClient from '../lib/apiClient';

// ── Auth ─────────────────────────────────────────────────────────────────────

export async function apiLogin(email: string, password: string) {
  const res = await apiClient.post('/api/auth/login', { email, password });
  return res.data.data;
}

export async function apiSignup(payload: {
  email: string; password: string; nickname: string;
  rankName?: string; branch?: string; unitName?: string;
  enlistedAt?: string; dischargeDate?: string;
}) {
  await apiClient.post('/api/auth/signup', payload);
}

// ── User / Profile ────────────────────────────────────────────────────────────

export async function apiGetMe() {
  const res = await apiClient.get('/api/users/me');
  return res.data.data;
}

export async function apiUpdateMe(data: { nickname?: string; phoneNumber?: string }) {
  const res = await apiClient.patch('/api/users/me', data);
  return res.data.data;
}

export async function apiChangePassword(currentPassword: string, newPassword: string) {
  await apiClient.patch('/api/users/password', { currentPassword, newPassword });
}

export async function apiGetProfile() {
  const res = await apiClient.get('/api/profiles/me');
  return res.data.data;
}

export async function apiUpsertProfile(data: {
  wakeUpTime?: string; sleepTime?: string; availableStudyMinutes?: number;
  rankName?: string; branch?: string; unitName?: string;
  enlistedAt?: string; dischargeDate?: string; interests?: string;
}) {
  const res = await apiClient.post('/api/profiles', data);
  return res.data.data;
}

// ── Dashboard ─────────────────────────────────────────────────────────────────

export async function apiGetHome() {
  const res = await apiClient.get('/api/dashboard/home');
  return res.data.data;
}

// ── Goals ─────────────────────────────────────────────────────────────────────

export async function apiGetGoals() {
  const res = await apiClient.get('/api/goals');
  return res.data.data as GoalItem[];
}

export async function apiCreateGoal(data: {
  title: string; category?: string; type?: string;
  deadline?: string; targetDescription?: string; pinned?: boolean;
}) {
  const res = await apiClient.post('/api/goals', data);
  return res.data.data as GoalItem;
}

export async function apiUpdateGoal(id: number, data: Partial<GoalItem>) {
  const res = await apiClient.patch(`/api/goals/${id}`, data);
  return res.data.data as GoalItem;
}

export async function apiDeleteGoal(id: number) {
  await apiClient.delete(`/api/goals/${id}`);
}

// ── Schedules ─────────────────────────────────────────────────────────────────

export async function apiGetSchedules() {
  const res = await apiClient.get('/api/schedules');
  return res.data.data as ScheduleItem[];
}

export async function apiGetSchedulesByDate(date: string) {
  const res = await apiClient.get('/api/schedules/by-date', { params: { date } });
  return res.data.data as ScheduleItem[];
}

export async function apiCreateSchedule(data: {
  title: string; scheduleDate: string; startTime: string; endTime: string;
  category?: string; endDate?: string; fatigueType?: string; memo?: string;
}) {
  const res = await apiClient.post('/api/schedules', data);
  return res.data.data as ScheduleItem;
}

export async function apiUpdateSchedule(id: number, data: Partial<ScheduleItem>) {
  const res = await apiClient.put(`/api/schedules/${id}`, data);
  return res.data.data as ScheduleItem;
}

export async function apiDeleteSchedule(id: number) {
  await apiClient.delete(`/api/schedules/${id}`);
}

// ── Courses ───────────────────────────────────────────────────────────────────

export async function apiGetCourses(params?: { source?: string; category?: string }) {
  const res = await apiClient.get('/api/courses', { params });
  return res.data.data as { courses: CourseItem[]; total: number };
}

export async function apiGetRecommendedCourses() {
  const res = await apiClient.get('/api/courses/recommend');
  return res.data.data as { recommendations: CourseRecommendation[] };
}

// ── Roadmap ───────────────────────────────────────────────────────────────────

export async function apiGetRoadmaps() {
  const res = await apiClient.get('/api/roadmap');
  return res.data.data as RoadmapItem[];
}

export async function apiGenerateRoadmap(goalId: number) {
  const res = await apiClient.post('/api/roadmap/generate', { goalId });
  return res.data.data as RoadmapItem;
}

export async function apiCheckRoadmapItem(roadmapId: number, stageIndex: number, itemIndex: number, checked: boolean) {
  const res = await apiClient.patch(`/api/roadmap/${roadmapId}/check-item`, { stageIndex, itemIndex, checked });
  return res.data.data as RoadmapItem;
}

// ── Notifications ─────────────────────────────────────────────────────────────

export async function apiGetNotifications() {
  const res = await apiClient.get('/api/notifications');
  return res.data.data as { items: NotificationItem[]; unreadCount: number };
}

export async function apiMarkAllNotificationsRead() {
  await apiClient.patch('/api/notifications/read-all');
}

export async function apiMarkNotificationRead(id: number) {
  await apiClient.patch(`/api/notifications/${id}/read`);
}

// ── AI Chat ───────────────────────────────────────────────────────────────────

export async function apiAiChat(message: string, history: { role: string; content: string }[]) {
  const res = await apiClient.post('/api/ai/chat', { message, history });
  return res.data.data as { reply: string };
}

// ── Types ─────────────────────────────────────────────────────────────────────

export interface GoalItem {
  id: number;
  title: string;
  category: string;
  type: string;
  deadline: string | null;
  pinned: boolean;
  isActive: boolean;
  progressPercent: number;
  targetDescription: string | null;
  createdAt: string;
}

export interface ScheduleItem {
  id: number;
  title: string;
  scheduleDate: string;
  endDate: string | null;
  startTime: string;
  endTime: string;
  category: string;
  fatigueType: string | null;
  memo: string | null;
}

export interface CourseItem {
  id: number;
  title: string;
  source: string;
  category: string;
  description: string | null;
  durationMinutes: number;
  url: string | null;
  tags: string;
  matchScore: number;
}

export interface CourseRecommendation {
  id: number;
  course: CourseItem;
  reason: string;
  priority: number;
}

export interface RoadmapItem {
  id: number;
  goalId: number;
  title: string;
  totalWeeks: number;
  stages: RoadmapStage[];
  progressPercent: number;
  updateCount: number;
  nextUpdateDate: string | null;
  goal: { title: string; type: string; progressPercent: number };
}

export interface RoadmapStage {
  week: string;
  title: string;
  status: 'completed' | 'in_progress' | 'pending';
  items: string[];
  checkedItems?: number[];
}

export interface NotificationItem {
  id: number;
  type: string;
  title: string;
  body: string;
  link: string | null;
  isRead: boolean;
  createdAt: string;
}
