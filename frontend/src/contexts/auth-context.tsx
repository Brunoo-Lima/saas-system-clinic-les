import type { IUser } from '@/@types/IUser';
import { loginService } from '@/services/login-service';
import {
  createContext,
  type ReactNode,
  type SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';

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

  const isRedirecting = useRef(false);
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
  // para redirecionamentos automáticos (após login ou refresh)
  useEffect(() => {
    if (loading) return;

    // só roda se token e user existem
    if (!authToken || !user) return;

    const path = location.pathname;

    // evitar duplo redirecionamento
    if (isRedirecting.current) return;

    if (!user.profileCompleted && path !== '/completar-perfil') {
      isRedirecting.current = true;
      navigate('/completar-perfil', { replace: true });
      return;
    }

    if (user.profileCompleted && path === '/completar-perfil') {
      isRedirecting.current = true;
      navigate('/dashboard', { replace: true });
      return;
    }

    // libera o redirect
    const timer = setTimeout(() => {
      isRedirecting.current = false;
    }, 100);

    return () => clearTimeout(timer);
  }, [loading, authToken, user, location.pathname, navigate]);

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

      if (!newUser.profileCompleted) {
        navigate('/completar-perfil', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
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

  const authValue = {
    user,
    setUser,
    isAuthenticated,
    logout,
    authToken,
    setAuthToken,
    loading,
    login,
    updateUser,
  };

  return (
    <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
