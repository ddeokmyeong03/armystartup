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
  dischargeDate?: string;  // 전역 예정일 (보고서 트리거, 필수)
  goal?: string;           // 측정가능 목표 (온보딩에서 설정)
}
