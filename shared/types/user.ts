export interface UserInfo {
  id: number;
  email: string;
  nickname: string;
  role: string;
}

export interface UserProfile {
  userId: number;
  rankName?: string;
  branch?: string;
  unitName?: string;
  enlistedAt?: string;
  dischargeDate?: string;
  interests?: string;
}
