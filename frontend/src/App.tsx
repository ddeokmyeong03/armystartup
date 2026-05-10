import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { isLoggedIn } from './shared/lib/auth';
import AppLayout from './shared/components/AppLayout';
import LandingPage from './pages/landing/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import SocialCallbackPage from './pages/auth/SocialCallbackPage';
import HomePage from './pages/home/HomePage';
import GoalsPage from './pages/goals/GoalsPage';
import RoadmapPage from './pages/roadmap/RoadmapPage';
import CoursesPage from './pages/courses/CoursesPage';
import ProfilePage from './pages/profile/ProfilePage';
import ProfileEditPage from './pages/profile/ProfileEditPage';
import NotificationsPage from './pages/notifications/NotificationsPage';
import SettingsPage from './pages/settings/SettingsPage';
import ChangePasswordPage from './pages/settings/ChangePasswordPage';
import ScheduleCreatePage from './pages/schedules/ScheduleCreatePage';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  if (!isLoggedIn()) return <Navigate to="/" replace />;
  return <AppLayout>{children}</AppLayout>;
}

function GuestRoute({ children }: { children: React.ReactNode }) {
  if (isLoggedIn()) return <Navigate to="/home" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 랜딩 */}
        <Route path="/" element={<GuestRoute><LandingPage /></GuestRoute>} />

        {/* 인증 */}
        <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
        <Route path="/signup" element={<GuestRoute><SignupPage /></GuestRoute>} />
        <Route path="/forgot-password" element={<GuestRoute><ForgotPasswordPage /></GuestRoute>} />
        <Route path="/reset-password" element={<GuestRoute><ResetPasswordPage /></GuestRoute>} />
        <Route path="/auth/callback" element={<SocialCallbackPage />} />

        {/* 탭 메인 화면 */}
        <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
        <Route path="/goals" element={<ProtectedRoute><GoalsPage /></ProtectedRoute>} />
        <Route path="/roadmap" element={<ProtectedRoute><RoadmapPage /></ProtectedRoute>} />
        <Route path="/courses" element={<ProtectedRoute><CoursesPage /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

        {/* 서브 페이지 */}
        <Route path="/schedule" element={<ProtectedRoute><ScheduleCreatePage /></ProtectedRoute>} />
        <Route path="/schedule/new" element={<ProtectedRoute><ScheduleCreatePage /></ProtectedRoute>} />
        <Route path="/profile/edit" element={<ProtectedRoute><ProfileEditPage /></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
        <Route path="/settings/password" element={<ProtectedRoute><ChangePasswordPage /></ProtectedRoute>} />

        <Route path="*" element={<Navigate to={isLoggedIn() ? '/home' : '/'} replace />} />
      </Routes>
    </BrowserRouter>
  );
}
