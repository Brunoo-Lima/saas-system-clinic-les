import { Navigate } from 'react-router-dom';
import type { JSX } from 'react';
import { useAuth } from '@/hooks/use-auth';

function PrivateRoute({ children }: { children: JSX.Element }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (!user.profileCompleted) {
    return <Navigate to="/completar-perfil" replace />;
  }

  return children;
}

export default PrivateRoute;
