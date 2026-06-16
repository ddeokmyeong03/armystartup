import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { isLoggedIn } from './shared/lib/auth';
import AppLayout from './shared/components/AppLayout';

// 인증
import LandingPage from './pages/landing/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import SocialCallbackPage from './pages/auth/SocialCallbackPage';

// 온보딩
import OnboardingGoalPage from './pages/onboarding/OnboardingGoalPage';
import OnboardingProfilePage from './pages/onboarding/OnboardingProfilePage';

// 탭 메인
import HomePage from './pages/home/HomePage';
import RecordsPage from './pages/records/RecordsPage';
import RecordNewPage from './pages/records/RecordNewPage';
import RecordDetailPage from './pages/records/RecordDetailPage';
import ChallengesPage from './pages/challenges/ChallengesPage';
import ChallengeDetailPage from './pages/challenges/ChallengeDetailPage';
import ChallengeJoinPage from './pages/challenges/ChallengeJoinPage';
import ChallengeStatusPage from './pages/challenges/ChallengeStatusPage';
import ChallengeSubmitPage from './pages/challenges/ChallengeSubmitPage';
import ChallengeNewPage from './pages/challenges/ChallengeNewPage';
import MyPage from './pages/my/MyPage';
import MyProfileEditPage from './pages/my/MyProfileEditPage';
import PaymentsPage from './pages/my/PaymentsPage';
import SettingsPage from './pages/my/SettingsPage';
import ChangePasswordPage from './pages/settings/ChangePasswordPage';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  if (!isLoggedIn()) return <Navigate to="/" replace />;
  return <AppLayout>{children}</AppLayout>;
}

function GuestRoute({ children }: { children: React.ReactNode }) {
  if (isLoggedIn()) return <Navigate to="/home" replace />;
  return <>{children}</>;
}

// 온보딩은 로그인 필요하지만 탭바 없이 풀스크린
function OnboardingRoute({ children }: { children: React.ReactNode }) {
  if (!isLoggedIn()) return <Navigate to="/" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 랜딩 */}
        <Route path="/" element={<GuestRoute><LandingPage /></GuestRoute>} />

        {/* 인증 */}
        <Route path="/login"           element={<GuestRoute><LoginPage /></GuestRoute>} />
        <Route path="/signup"          element={<GuestRoute><SignupPage /></GuestRoute>} />
        <Route path="/forgot-password" element={<GuestRoute><ForgotPasswordPage /></GuestRoute>} />
        <Route path="/reset-password"  element={<GuestRoute><ResetPasswordPage /></GuestRoute>} />
        <Route path="/auth/callback"   element={<SocialCallbackPage />} />

        {/* 온보딩 (1회성) */}
        <Route path="/onboarding/goal"    element={<OnboardingRoute><OnboardingGoalPage /></OnboardingRoute>} />
        <Route path="/onboarding/profile" element={<OnboardingRoute><OnboardingProfilePage /></OnboardingRoute>} />

        {/* 홈 대시보드 */}
        <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />

        {/* 기록 */}
        <Route path="/records"     element={<ProtectedRoute><RecordsPage /></ProtectedRoute>} />
        <Route path="/records/new" element={<ProtectedRoute><RecordNewPage /></ProtectedRoute>} />
        <Route path="/records/:id" element={<ProtectedRoute><RecordDetailPage /></ProtectedRoute>} />

        {/* 챌린지 */}
        <Route path="/challenges"             element={<ProtectedRoute><ChallengesPage /></ProtectedRoute>} />
        <Route path="/challenges/new"         element={<ProtectedRoute><ChallengeNewPage /></ProtectedRoute>} />
        <Route path="/challenges/:id"         element={<ProtectedRoute><ChallengeDetailPage /></ProtectedRoute>} />
        <Route path="/challenges/:id/join"    element={<ProtectedRoute><ChallengeJoinPage /></ProtectedRoute>} />
        <Route path="/challenges/:id/status"  element={<ProtectedRoute><ChallengeStatusPage /></ProtectedRoute>} />
        <Route path="/challenges/:id/submit"  element={<ProtectedRoute><ChallengeSubmitPage /></ProtectedRoute>} />

        {/* 마이 */}
        <Route path="/my"                    element={<ProtectedRoute><MyPage /></ProtectedRoute>} />
        <Route path="/my/profile"            element={<ProtectedRoute><MyProfileEditPage /></ProtectedRoute>} />
        <Route path="/my/payments"           element={<ProtectedRoute><PaymentsPage /></ProtectedRoute>} />
        <Route path="/my/settings"           element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
        <Route path="/my/settings/password"  element={<ProtectedRoute><ChangePasswordPage /></ProtectedRoute>} />

        {/* 404 → 홈 또는 랜딩 */}
        <Route path="*" element={<Navigate to={isLoggedIn() ? '/home' : '/'} replace />} />
      </Routes>
    </BrowserRouter>
  );
}
