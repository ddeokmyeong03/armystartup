import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { isLoggedIn } from './shared/lib/auth';
import OnboardingPage from './pages/onboarding/OnboardingPage';
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import MainPage from './pages/main/MainPage';
import ProfilePage from './pages/profile/ProfilePage';
import TodayPage from './pages/today/TodayPage';
import GoalsPage from './pages/goals/GoalsPage';
import GoalCreatePage from './pages/goals/GoalCreatePage';
import AiPage from './pages/ai/AiPage';
import RoadmapPage from './pages/roadmap/RoadmapPage';
import ScheduleCreatePage from './pages/schedules/ScheduleCreatePage';
import ScheduleDetailPage from './pages/schedules/ScheduleDetailPage';
import ScheduleEditPage from './pages/schedules/ScheduleEditPage';
import NotificationsPage from './pages/notifications/NotificationsPage';
import SettingsPage from './pages/settings/SettingsPage';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  if (!isLoggedIn()) return <Navigate to="/onboarding" replace />;
  return <>{children}</>;
}

function GuestRoute({ children }: { children: React.ReactNode }) {
  if (isLoggedIn()) return <Navigate to="/" replace />;
  return <>{children}</>;
}

// 뒤로가기가 있는 서브 페이지 플레이스홀더
function SubPlaceholderPage({ title }: { title: string }) {
  return (
    <div className="min-h-screen bg-[#F8F8F6] flex flex-col">
      <div className="flex items-center gap-3 px-5 pt-12 pb-4">
        <button
          onClick={() => window.history.back()}
          className="w-9 h-9 flex items-center justify-center"
          aria-label="뒤로가기"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#111111" strokeWidth="2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <h1 className="text-[17px] font-semibold text-[#111111]">{title}</h1>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center gap-2 pb-24">
        <div className="w-12 h-12 rounded-full bg-[#EFEFEF] flex items-center justify-center mb-2">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#8E8E93" strokeWidth="1.8">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <p className="text-[15px] font-semibold text-[#111111]">{title}</p>
        <p className="text-[13px] text-[#8E8E93]">준비 중입니다.</p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 온보딩 / 인증 (비로그인 전용) */}
        <Route path="/onboarding" element={<GuestRoute><OnboardingPage /></GuestRoute>} />
        <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
        <Route path="/signup" element={<GuestRoute><SignupPage /></GuestRoute>} />

        {/* 탭 메인 화면 (하단 내비게이션 포함) */}
        <Route path="/" element={<ProtectedRoute><MainPage /></ProtectedRoute>} />
        <Route path="/roadmap" element={<ProtectedRoute><RoadmapPage /></ProtectedRoute>} />
        <Route path="/recommend" element={<ProtectedRoute><AiPage /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

        {/* 서브 페이지 */}
        <Route path="/today" element={<ProtectedRoute><TodayPage /></ProtectedRoute>} />
        <Route path="/goals" element={<ProtectedRoute><GoalsPage /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
        <Route path="/schedules/new" element={<ProtectedRoute><ScheduleCreatePage /></ProtectedRoute>} />
        <Route path="/schedules/:id" element={<ProtectedRoute><ScheduleDetailPage /></ProtectedRoute>} />
        <Route path="/schedules/:id/edit" element={<ProtectedRoute><ScheduleEditPage /></ProtectedRoute>} />
        <Route path="/goals/new" element={<ProtectedRoute><GoalCreatePage /></ProtectedRoute>} />
        <Route path="/ai/chat" element={<ProtectedRoute><AiPage /></ProtectedRoute>} />
        <Route path="/friends" element={<ProtectedRoute><SubPlaceholderPage title="친구" /></ProtectedRoute>} />
        <Route path="/friends/add" element={<ProtectedRoute><SubPlaceholderPage title="친구 추가" /></ProtectedRoute>} />
        <Route path="/friends/:id" element={<ProtectedRoute><SubPlaceholderPage title="친구 캘린더" /></ProtectedRoute>} />

        <Route path="*" element={<Navigate to={isLoggedIn() ? '/' : '/onboarding'} replace />} />
      </Routes>
    </BrowserRouter>
  );
}
