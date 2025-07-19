import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { apiService } from '../services/api';
import { setToken, removeToken, isAuthenticated } from '../utils/auth';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (userData: {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    birthday: string;
  }) => Promise<boolean>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    if (!isAuthenticated()) {
      setLoading(false);
      return;
    }

    try {
      const response = await apiService.getCurrentUser();
      if (response.success && response.data) {
        setUser(response.data);
      } else {
        removeToken();
        setUser(null);
      }
    } catch (error) {
      removeToken();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await apiService.login({ email, password });
      if (response.success && response.data) {
        setToken(response.data.access_token);
        await refreshUser();
        toast.success('Welcome back!');
        return true;
      } else {
        toast.error(response.error || 'Login failed');
        return false;
      }
    } catch (error) {
      toast.error('Login failed');
      return false;
    }
  };

  const signup = async (userData: {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    birthday: string;
  }): Promise<boolean> => {
    try {
      const response = await apiService.signup(userData);
      if (response.success && response.data) {
        toast.success('Account created successfully! Please sign in.');
        return true;
      } else {
        toast.error(response.error || 'Signup failed');
        return false;
      }
    } catch (error) {
      toast.error('Signup failed');
      return false;
    }
  };

  const logout = () => {
    removeToken();
    setUser(null);
    toast.success('Goodbye!');
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const value: AuthContextType = {
    user,
    loading,
    login,
    signup,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
