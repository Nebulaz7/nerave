import React, { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from 'react';
import axios from 'axios';

/* ---- Types ---- */
export type UserRole = 'CLIENT' | 'CONTRACTOR';

export interface AuthUser {
  userId: string;
  email: string;
  businessName: string;
  role: UserRole;
  apiKey: string;
  accessToken: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, businessName: string, role: UserRole) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

const API_URL = import.meta.env.VITE_NERAVE_API_URL || 'https://nerave.onrender.com';

const AuthContext = createContext<AuthContextValue | null>(null);

/* ---- Helpers ---- */
function loadUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem('nerave_demo_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveUser(user: AuthUser) {
  localStorage.setItem('nerave_demo_user', JSON.stringify(user));
}

function clearUser() {
  localStorage.removeItem('nerave_demo_user');
}

/* ---- Provider ---- */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(loadUser);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.post(`${API_URL}/auth/login`, { email, password });

      // Fetch user profile to get businessName — we store what the server returns
      const authUser: AuthUser = {
        userId: data.userId,
        email,
        businessName: email.split('@')[0], // fallback
        role: data.role,
        apiKey: data.apiKey,
        accessToken: data.accessToken,
      };
      saveUser(authUser);
      setUser(authUser);
    } catch (err: unknown) {
      const msg = axios.isAxiosError(err)
        ? err.response?.data?.message || err.message
        : 'Login failed';
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (email: string, password: string, businessName: string, role: UserRole) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.post(`${API_URL}/auth/register`, {
        email,
        password,
        businessName,
        role,
      });

      // Auto-login after registration
      const loginResp = await axios.post(`${API_URL}/auth/login`, { email, password });

      const authUser: AuthUser = {
        userId: data.userId,
        email,
        businessName,
        role,
        apiKey: data.apiKey,
        accessToken: loginResp.data.accessToken,
      };
      saveUser(authUser);
      setUser(authUser);
    } catch (err: unknown) {
      const msg = axios.isAxiosError(err)
        ? err.response?.data?.message || err.message
        : 'Registration failed';
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    clearUser();
    setUser(null);
    setError(null);
  }, []);

  const clearError = useCallback(() => setError(null), []);

  const value = useMemo(() => ({
    user, loading, error, login, register, logout, clearError,
  }), [user, loading, error, login, register, logout, clearError]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
