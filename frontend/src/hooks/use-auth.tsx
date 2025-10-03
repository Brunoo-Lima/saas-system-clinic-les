/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import type { IUser } from '@/@types/IUser';
import { getUser } from '@/services/get-user-service';
import { loginService } from '@/services/login-service';
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
  user: IUser;
  setUser: React.Dispatch<SetStateAction<IUser>>;
  authToken: AuthToken;
  setAuthToken: React.Dispatch<SetStateAction<AuthToken>>;
  isAuthenticated: boolean;
  login: (
    email: string,
    password: string,
    role: 'admin' | 'doctor' | 'patient',
  ) => Promise<void>;
  logout: () => void;
  loading: boolean;
}
interface ChildrenProps {
  children: ReactNode;
}

const AuthContext = createContext({} as IAuthProvider);

const AuthProvider = ({ children }: ChildrenProps) => {
  const [authToken, setAuthToken] = useState<AuthToken>({} as AuthToken);
  const [user, setUser] = useState<IUser>({} as IUser);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchUserData = async () => {
      const storageToken =
        localStorage.getItem('@token:accessToken') ||
        sessionStorage.getItem('@token:accessToken');

      const email =
        localStorage.getItem('@user:email') ||
        sessionStorage.getItem('@user:email');

      if (storageToken) {
        try {
          setAuthToken({ token: storageToken });

          const data = await getUser(email!);
          setUser({
            email: data.email,
            username: data.username,
            role: data.role,
            profileCompleted: data.profileCompleted,
          });
        } catch (error) {
          logout();
        }
      } else {
        navigate('/');
      }

      setLoading(false);
    };

    fetchUserData();
  }, [navigate]);

  useEffect(() => {
    const accessToken = localStorage.getItem('@token:accessToken');

    if (accessToken && location.pathname === '/') {
      navigate('/dashboard');
    }
  }, [navigate, location.pathname]);

  useEffect(() => {
    if (!loading && user?.email) {
      if (!user.profileCompleted && location.pathname !== '/completar-perfil') {
        navigate('/completar-perfil');
      }
    }
  }, [authToken.token, loading, location.pathname, navigate]);

  const login = async (
    email: string,
    password: string,
    role: 'admin' | 'doctor' | 'patient',
  ) => {
    try {
      const {
        user: userData,
        jwt,
        refreshToken,
      } = await loginService({
        email,
        password,
        role,
      });

      if (userData && jwt) {
        setAuthToken({ token: jwt });
        setUser({
          email: userData.email,
          username: userData.username,
          role: userData.role,
          profileCompleted: userData.profileCompleted,
        });
      }

      localStorage.setItem('@token:accessToken', jwt);
      localStorage.setItem('@token:refreshToken', refreshToken);
      localStorage.setItem('@user:email', userData.email);

      // remove o localStorage quando a página for fechada
      localStorage.setItem('removeLocalStorageOnClose', 'true');

      window.addEventListener('beforeunload', () => {
        localStorage.removeItem('@token:accessToken');
        localStorage.removeItem('@token:refreshToken');
      });

      navigate('/dashboard');
    } catch (error: any) {
      // toast.error('Email ou senha incorretos.');
    }
    setLoading(false);
  };

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
      isAuthenticated: !!user.email,
      logout,
      authToken,
      setAuthToken,
      login,
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
