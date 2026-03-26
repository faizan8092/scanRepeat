'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/src/lib/toast-context';
import {
  AuthUser,
  login as apiLogin,
  register as apiRegister,
  logout as apiLogout,
  refresh as apiRefresh,
  loginWithGoogle as apiLoginWithGoogle,
  getMe as apiGetMe,
  updateMe as apiUpdateMe,
} from '@/src/lib/auth-service';
import { setAuthToken } from '@/src/lib/api';

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (data: Partial<AuthUser>) => void;
  refreshSession: () => Promise<void>;
  loginWithGoogle: (idToken: string) => Promise<void>;
  fetchProfile: () => Promise<AuthUser>;
  updateProfile: (data: Partial<AuthUser>) => Promise<AuthUser>;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const router = useRouter();
  const { addToast } = useToast();

  React.useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('accessToken');

    if (storedToken) {
      setAuthToken(storedToken);
    }

    if (storedUser && storedUser !== 'undefined') {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem('user');
      }
    }

    // Listen for unauthorized events from apiFetch
    const handleUnauthorized = () => {
      setUser(null);
      localStorage.removeItem('user');
      localStorage.removeItem('accessToken');
      setAuthToken(undefined);
      addToast('error', 'Session Expired', 'Please login again to continue.');
      router.push('/login');
    };

    window.addEventListener('scanrepeat_unauthorized', handleUnauthorized);

    // Attempt to refresh session on load
    (async () => {
      try {
        await refreshSession();
      } catch {
        // ignore
      } finally {
        setIsLoading(false);
      }
    })();

    return () => {
      window.removeEventListener('scanrepeat_unauthorized', handleUnauthorized);
    };
  }, []);

  const handleLoginSuccess = (data: { accessToken: string; user?: AuthUser }) => {
    if (data.user) {
      setUser(data.user);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    if (data.accessToken) {
      setAuthToken(data.accessToken);
      localStorage.setItem('accessToken', data.accessToken);
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await apiLogin({ email, password });
      handleLoginSuccess(response);
      const userName = response?.user?.name || email.split('@')[0] || 'User';
      addToast('success', 'Welcome back!', `Logged in as ${userName}`);
      router.push('/dashboard');
    } catch (err) {
      console.error("AuthContext Login Error:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, name?: string) => {
    setIsLoading(true);
    try {
      const response = await apiRegister({ email, password, name });
      handleLoginSuccess(response);
      addToast('success', 'Account created!', "Welcome to ScanRepeat. Let's build something great.");
      router.push('/dashboard');
    } catch (err) {
      console.error("AuthContext Signup Error:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await apiLogout();
    } finally {
      setUser(null);
      localStorage.removeItem('user');
      localStorage.removeItem('accessToken');
      setAuthToken(undefined);
      setIsLoading(false);
      router.push('/');
    }
  };

  const updateUser = (data: Partial<AuthUser>) => {
    const updated = { ...(user ?? {}), ...data } as AuthUser;
    setUser(updated);
    localStorage.setItem('user', JSON.stringify(updated));
  };

  const refreshSession = async () => {
    setIsLoading(true);
    try {
      const response = await apiRefresh();
      handleLoginSuccess(response);
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async (idToken: string) => {
    setIsLoading(true);
    try {
      const response = await apiLoginWithGoogle(idToken);
      handleLoginSuccess(response);
      const userName = response?.user?.name || 'User';
      addToast('success', 'Welcome back!', `Logged in as ${userName}`);
      router.push('/dashboard');
    } catch (err) {
      console.error("AuthContext Google Login Error:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProfile = async () => {
    try {
      const profile = await apiGetMe();
      setUser(profile);
      localStorage.setItem('user', JSON.stringify(profile));
      return profile;
    } catch (err) {
      console.error("AuthContext Fetch Profile Error:", err);
      throw err;
    }
  };

  const updateProfile = async (data: Partial<AuthUser>) => {
    try {
      const updated = await apiUpdateMe(data);
      setUser(updated);
      localStorage.setItem('user', JSON.stringify(updated));
      return updated;
    } catch (err) {
      console.error("AuthContext Update Profile Error:", err);
      throw err;
    }
  };

  const value = {
    user,
    isLoading,
    login,
    signup,
    logout,
    updateUser,
    refreshSession,
    loginWithGoogle,
    fetchProfile,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
