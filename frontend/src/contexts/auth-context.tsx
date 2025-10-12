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
  updateUser: (userData: Partial<IUser>) => void;
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

      const storedUser = localStorage.getItem('@user:data');

      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
        } catch (error) {
          console.error('Erro ao parsear usuário do localStorage:', error);
          localStorage.removeItem('@user:data');
        }
      }

      if (storedToken) {
        try {
          setAuthToken({ token: storedToken });
        } catch {
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

    const currentPath = location.pathname;
    const isPublicRoute = currentPath === '/';
    const isProfilePage = currentPath === '/completar-perfil';

    // Se não está autenticado
    if (!isAuthenticated) {
      // Se não está em uma rota pública, redireciona para login
      if (!isPublicRoute) {
        navigate('/', { replace: true });
      }
      return;
    }

    // Se está autenticado mas não tem dados do usuário ainda, aguarda
    if (!user) return;

    // Usuário autenticado com perfil incompleto
    if (!user.profileCompleted) {
      // Se não está na página de completar perfil, redireciona
      if (!isProfilePage) {
        navigate('/completar-perfil', { replace: true });
      }
      return;
    }

    // Usuário autenticado com perfil completo
    if (user.profileCompleted) {
      // Se está na página de completar perfil, redireciona para dashboard
      if (isProfilePage) {
        navigate('/dashboard', { replace: true });
        return;
      }

      // Se está na página de login, redireciona para dashboard
      if (isPublicRoute) {
        navigate('/dashboard', { replace: true });
        return;
      }
    }
  }, [loading, isAuthenticated, location.pathname, navigate, user]);

  const login = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    setLoading(true);
    try {
      const { user, token } = await loginService({
        email,
        password,
        role: 'admin',
      });

      setAuthToken({ token });
      localStorage.setItem('@user:token', token);

      const newUser = {
        id: user.id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        emailVerified: user.emailVerified,
        profileCompleted: user.profileCompleted,
      };

      setUser(newUser);

      localStorage.setItem('@user:data', JSON.stringify(newUser));
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateUser = (userData: Partial<IUser>) => {
    setUser((prevUser) => {
      if (!prevUser) return prevUser;

      const updatedUser = {
        ...prevUser,
        ...userData,
      };

      // Atualiza no localStorage também
      localStorage.setItem('@user:data', JSON.stringify(updatedUser));

      return updatedUser;
    });
  };

  const logout = () => {
    localStorage.removeItem('@user:token');
    sessionStorage.removeItem('@user:token');
    localStorage.removeItem('@user:data');
    setUser(null);
    setAuthToken(null);
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
      updateUser,
    }),
    [user, authToken, loading],
  );

  return (
    <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
