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

export async function apiCheckEmail(email: string): Promise<{ available: boolean }> {
  const res = await apiClient.post('/api/auth/check-email', { email });
  return res.data.data ?? res.data;
}

export async function apiForgotPassword(email: string) {
  await apiClient.post('/api/auth/forgot-password', { email });
}

export async function apiResetPassword(token: string, newPassword: string) {
  await apiClient.post('/api/auth/reset-password', { token, newPassword });
}

export async function apiLogout() {
  await apiClient.post('/api/auth/logout').catch(() => {});
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

export async function apiUpdateProfile(data: {
  rankName?: string; branch?: string; unitName?: string;
  enlistedAt?: string; dischargeDate?: string; goal?: string;
}) {
  const res = await apiClient.post('/api/profiles', data);
  return res.data.data;
}

// ── Dashboard ─────────────────────────────────────────────────────────────────

export async function apiGetHome() {
  const res = await apiClient.get('/api/dashboard/home');
  return res.data.data;
}

// ── Records (기록) ────────────────────────────────────────────────────────────

export async function apiGetRecords(category?: string) {
  const res = await apiClient.get('/api/records', { params: category ? { category } : {} });
  return res.data.data as RecordItem[];
}

export async function apiGetRecord(id: number) {
  const res = await apiClient.get(`/api/records/${id}`);
  return res.data.data as RecordItem;
}

export async function apiCreateRecord(data: {
  category: string;
  title: string;
  content?: string;
  recordDate: string;
  evidenceUrl?: string;
  meta?: Record<string, unknown>;
}) {
  const res = await apiClient.post('/api/records', data);
  return res.data.data as RecordItem;
}

export async function apiUpdateRecord(id: number, data: Partial<{
  title: string; content: string; recordDate: string; evidenceUrl: string; meta: Record<string, unknown>;
}>) {
  const res = await apiClient.patch(`/api/records/${id}`, data);
  return res.data.data as RecordItem;
}

export async function apiDeleteRecord(id: number) {
  await apiClient.delete(`/api/records/${id}`);
}

// ── Challenges (챌린지) ───────────────────────────────────────────────────────

export async function apiGetChallenges(category?: string) {
  const res = await apiClient.get('/api/challenges', { params: category ? { category } : {} });
  return res.data.data as ChallengeItem[];
}

export async function apiGetMyChallenges() {
  const res = await apiClient.get('/api/challenges/mine');
  return res.data.data as ChallengeItem[];
}

export async function apiGetChallenge(id: number) {
  const res = await apiClient.get(`/api/challenges/${id}`);
  return res.data.data as ChallengeItem;
}

export async function apiCreateChallenge(data: {
  title: string; description?: string; category: string;
  judgmentType: string; startDate: string; endDate: string;
  maxParticipants?: number; isRewarded?: boolean; entryFee?: number; prizeMoney?: number;
}) {
  const res = await apiClient.post('/api/challenges', data);
  return res.data.data as ChallengeItem;
}

export async function apiJoinChallenge(id: number) {
  const res = await apiClient.post(`/api/challenges/${id}/join`);
  return res.data.data;
}

export async function apiGetChallengeParticipants(id: number) {
  const res = await apiClient.get(`/api/challenges/${id}/participants`);
  return res.data.data as { challenge: ChallengeItem; participants: ParticipantItem[] };
}

export async function apiSubmitChallengeEvidence(id: number, data: { evidenceUrl: string; comment?: string }) {
  const res = await apiClient.post(`/api/challenges/${id}/submit`, data);
  return res.data.data;
}

// ── Payments (결제 내역) ──────────────────────────────────────────────────────

export async function apiGetPayments() {
  const res = await apiClient.get('/api/payments');
  return res.data.data as PaymentItem[];
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

// ── Types ─────────────────────────────────────────────────────────────────────

export interface RecordItem {
  id: number;
  userId: number;
  category: string;
  title: string;
  content?: string;
  recordDate: string;
  verified: boolean;
  evidenceUrl?: string;
  meta: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface ChallengeItem {
  id: number;
  creatorId: number;
  title: string;
  description?: string;
  category: string;
  judgmentType: string;
  startDate: string;
  endDate: string;
  maxParticipants?: number;
  isRewarded: boolean;
  entryFee: number;
  prizeMoney: number;
  status: string;
  participantCount?: number;
  myParticipation?: ParticipantItem;
  createdAt: string;
  updatedAt: string;
}

export interface ParticipantItem {
  id: number;
  challengeId: number;
  userId: number;
  nickname?: string;
  joinedAt: string;
  status: string;
  rank?: number;
  passed?: boolean;
  evidenceUrl?: string;
  judgedAt?: string;
}

export interface PaymentItem {
  id: number;
  challengeId: number;
  challengeTitle: string;
  amount: number;
  paidAt: string;
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
