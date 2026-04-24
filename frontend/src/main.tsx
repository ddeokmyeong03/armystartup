import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './millog-colors.css';
import './millog.css';
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
