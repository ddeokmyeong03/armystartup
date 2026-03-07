import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainPage from './pages/main/MainPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
