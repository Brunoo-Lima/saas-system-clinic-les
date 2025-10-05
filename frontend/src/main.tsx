import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './styles/globals.css';
import { BrowserRouter } from 'react-router-dom';
import { Providers } from './providers/providers.tsx';
import AuthProvider from './contexts/auth-context.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Providers>
          <App />
        </Providers>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
