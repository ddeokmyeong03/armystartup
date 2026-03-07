import axios from 'axios';

// 로컬(dev): VITE_API_BASE_URL 없으면 빈 문자열 → vite proxy가 /api를 8080으로 전달
// Netlify(prod): VITE_API_BASE_URL=https://your-backend.run.app 형태로 주입
// Codespaces: Vite proxy 사용 (프론트엔드와 백엔드가 같은 컨테이너)
const baseURL = import.meta.env.VITE_API_BASE_URL ?? '';

const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
});

// 요청 인터셉터: JWT 토큰 자동 첨부
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 응답 인터셉터: 401 시 토큰 제거 후 로그인으로 이동
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
