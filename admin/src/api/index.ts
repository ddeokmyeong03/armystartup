const BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000';

function authHeader(): HeadersInit {
  const email = sessionStorage.getItem('adminEmail') ?? '';
  const password = sessionStorage.getItem('adminPassword') ?? '';
  return { Authorization: `Basic ${btoa(`${email}:${password}`)}`, 'Content-Type': 'application/json' };
}

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}/api${path}`, { headers: authHeader() });
  if (!res.ok) throw new Error(`${res.status}`);
  const json = await res.json();
  return json.data as T;
}

export const apiOverview = () => get<any>('/admin/analytics/overview');
export const apiGoalsAnalytics = () => get<any>('/admin/analytics/goals');
export const apiCoursesAnalytics = () => get<any>('/admin/analytics/courses');
export const apiFatigueAnalytics = () => get<any>('/admin/analytics/fatigue');
export const apiUsersAnalytics = () => get<any>('/admin/analytics/users');
