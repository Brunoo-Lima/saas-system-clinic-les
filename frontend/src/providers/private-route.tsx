import { Navigate, Outlet } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '@/contexts/auth-context';

export const PrivateRoute = () => {
  const { isAuthenticated, loading } = useContext(AuthContext);

  if (loading) {
    return null;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
};
