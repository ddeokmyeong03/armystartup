import apiClient from '../lib/apiClient';

export interface SignUpBody {
  email: string;
  password: string;
  nickname: string;
  phoneNumber?: string;
}

export interface LoginBody {
  email: string;
  password: string;
}

export interface LoginData {
  userId: number;
  email: string;
  nickname: string;
  accessToken: string;
}

export async function signUp(body: SignUpBody): Promise<void> {
  await apiClient.post('/api/auth/signup', body);
}

export async function login(body: LoginBody): Promise<LoginData> {
  const res = await apiClient.post<{ data: LoginData }>('/api/auth/login', body);
  return res.data.data;
}

export async function getMe(): Promise<{ id: number; email: string; nickname: string }> {
  const res = await apiClient.get<{ data: { id: number; email: string; nickname: string } }>('/api/users/me');
  return res.data.data;
}
