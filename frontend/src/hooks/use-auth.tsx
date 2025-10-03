/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import type { IUser } from '@/@types/IUser';
import {
  createContext,
  type ReactNode,
  type SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react';

import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export interface AuthToken {
  token: string;
}

interface IAuthProvider {
  user: IUser | null;
  setUser: React.Dispatch<SetStateAction<IUser | null>>;
  authToken: AuthToken | null;
  setAuthToken: React.Dispatch<SetStateAction<AuthToken | null>>;
  isAuthenticated: boolean;
  logout: () => void;
  loading: boolean;
}
interface ChildrenProps {
  children: ReactNode;
}

const AuthContext = createContext({} as IAuthProvider);

const AuthProvider = ({ children }: ChildrenProps) => {
  const [authToken, setAuthToken] = useState<AuthToken | null>(null);
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchUserData = async () => {
      const storedToken =
        localStorage.getItem('@user:token') ||
        sessionStorage.getItem('@user:token');

      if (storedToken) {
        try {
          setAuthToken({ token: storedToken });
        } catch {
          logout();
        }
      } else {
        navigate('/');
      }
      setLoading(false);
    };

    fetchUserData();
  }, [navigate]);

  // Redireciona se já estiver logado
  useEffect(() => {
    const token = localStorage.getItem('@user:token');
    if (token && location.pathname === '/') {
      navigate('/dashboard');
    }
  }, [navigate, location.pathname]);

  useEffect(() => {
    if (!loading && user?.token) {
      if (!user.profileCompleted && location.pathname !== '/completar-perfil') {
        navigate('/completar-perfil');
      }
    }
  }, [authToken?.token, loading, location.pathname, navigate]);

  const logout = () => {
    localStorage.removeItem('@token:accessToken');
    sessionStorage.removeItem('@token:accessToken');
    setUser({} as IUser);
    setAuthToken({} as AuthToken);
    navigate('/');
  };

  const authValue = useMemo(
    () => ({
      user,
      setUser,
      isAuthenticated: !!authToken?.token,
      logout,
      authToken,
      setAuthToken,
      loading,
    }),
    [user, authToken, loading],
  );

  if (loading) {
    return null;
  }

  return (
    <AuthContext.Provider value={authValue}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

export const useAuth = () => useContext(AuthContext);
