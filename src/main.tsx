import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Google Analytics
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

if (import.meta.env.PROD) {
  const script = document.createElement('script');
  script.src = 'https://www.googletagmanager.com/gtag/js?id=G-L1VNPLP486';
  script.async = true;
  document.head.appendChild(script);

  window.gtag = window.gtag || function() { dataLayer.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('config', 'G-L1VNPLP486');
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
