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
  const stored = localStorage.getItem('nickname');
  if (!stored || stored === 'undefined' || stored === 'null') return '사용자';
  return stored;
}
