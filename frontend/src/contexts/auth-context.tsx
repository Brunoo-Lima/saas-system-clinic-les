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

    // Evita loops durante logout
    if (!user && !isAuthenticated) return;

    const isPublicRoute = location.pathname === '/';
    const isProfilePage = location.pathname === '/completar-perfil';
    const isDashboard = location.pathname === '/dashboard';

    // Não autenticado
    if (!isAuthenticated) {
      if (!isPublicRoute) navigate('/', { replace: true });
      return;
    }

    // Autenticado, perfil incompleto
    if (isAuthenticated && !user?.profileCompleted) {
      if (!isProfilePage) navigate('/completar-perfil', { replace: true });
      return;
    }

    // Autenticado, perfil completo e está na tela de completar perfil
    if (isAuthenticated && user?.profileCompleted && isProfilePage) {
      if (!isDashboard) navigate('/dashboard', { replace: true });
      return;
    }

    // Autenticado e acessando login
    if (isAuthenticated && isPublicRoute) {
      if (!isDashboard) navigate('/dashboard', { replace: true });
      return;
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

    navigate('/', { replace: true });
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
