/* eslint-disable react-hooks/exhaustive-deps */

import type { IUser } from '@/@types/IUser';
import { loginService } from '@/services/login-service';
import {
  createContext,
  type ReactNode,
  type SetStateAction,
  useEffect,
  useState,
} from 'react';

import { useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';

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
  login: ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => Promise<void>;
  loading: boolean;
}
interface ChildrenProps {
  children: ReactNode;
}

export const AuthContext = createContext({} as IAuthProvider);

const AuthProvider = ({ children }: ChildrenProps) => {
  const [authToken, setAuthToken] = useState<AuthToken | null>(null);
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const navigate = useNavigate();
  const location = useLocation();

  const isAuthenticated = !!authToken?.token;

  useEffect(() => {
    const fetchUserData = async () => {
      const storedToken =
        localStorage.getItem('@user:token') ||
        sessionStorage.getItem('@user:token');

      if (storedToken) {
        try {
          setAuthToken({ token: storedToken });
          // Se precisar validar dados do usuário
          // const userData = await api.get('/user/me');
          // setUser(userData.data);
        } catch {
          // Só limpa o token em caso de erro
          localStorage.removeItem('@user:token');
          sessionStorage.removeItem('@user:token');
          setAuthToken({} as AuthToken);
        }
      }
      setLoading(false);
    };

    fetchUserData();
  }, []);

  // para redirecionamentos
  useEffect(() => {
    if (loading) return;

    const isPublicRoute = location.pathname === '/';

    // Só redireciona se realmente necessário
    if (isAuthenticated && isPublicRoute) {
      navigate('/dashboard', { replace: true });
    } else if (
      !isAuthenticated &&
      !isPublicRoute &&
      location.pathname !== '/'
    ) {
      navigate('/', { replace: true });
    }
  }, [loading, isAuthenticated, location.pathname, navigate]);

  const login = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    setLoading(true);
    try {
      const { token, data } = await loginService({
        email,
        password,
        role: 'admin',
      });

      setAuthToken({ token });
      localStorage.setItem('@user:token', token);
      setUser(data);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('@user:token');
    sessionStorage.removeItem('@user:token');
    setUser({} as IUser);
    setAuthToken({} as AuthToken);
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
      login,
    }),
    [user, authToken, loading],
  );

  return (
    <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
