export function isLoggedIn(): boolean {
  return !!localStorage.getItem('accessToken');
}

export function getToken(): string | null {
  return localStorage.getItem('accessToken');
}

export function logout(): void {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('nickname');
}

export function getNickname(): string {
  return localStorage.getItem('nickname') ?? '사용자';
}
