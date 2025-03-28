import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'react-toastify';
import api from '../services/api';

export interface RegisterData {
  email: string;
  password: string;
  name?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface User {
  id: number;
  email: string;
  name?: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  register: (data: RegisterData) => Promise<any>;
  login: (data: LoginData) => Promise<AuthResponse>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUserFromStorage = () => {
      try {
        const userStr = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        
        if (userStr) {
          setUser(JSON.parse(userStr));
        }
        
        if (token) {
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
      } catch (error) {
        console.error('Failed to load user from storage:', error);
        toast.error('Problem z załadowaniem danych użytkownika');
      } finally {
        setIsLoading(false);
      }
    };

    loadUserFromStorage();
  }, []);


  const setToken = (token: string): void => {
    localStorage.setItem('token', token);
  };

  const setUserData = (userData: User): void => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const register = async (data: RegisterData): Promise<any> => {
    try {
      const response = await api.post('/auth/register', data);
      toast.success('Konto zostało utworzone pomyślnie! Możesz się teraz zalogować.');
      return response.data;
    } catch (error: any) {
      console.error('Registration error:', error);
      const errorMessage = error.response?.data?.message || 'Błąd podczas rejestracji';
      toast.error(errorMessage);
      throw error;
    }
  };

  const login = async (data: LoginData): Promise<AuthResponse> => {
    try {
      const response = await api.post<AuthResponse>('/auth/login', data);
      
      setToken(response.data.access_token);
      
      api.defaults.headers.common['Authorization'] = `Bearer ${response.data.access_token}`;
      
      setUserData(response.data.user);
      toast.success(`Witaj, ${response.data.user.name || response.data.user.email}!`);
      return response.data;
    } catch (error: any) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.message || 'Nieprawidłowy email lub hasło';
      toast.error(errorMessage);
      throw error;
    }
  };

  const logout = (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    delete api.defaults.headers.common['Authorization'];
    setUser(null);
    toast.info('Wylogowano pomyślnie');
  };

  const isLoggedIn = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isLoggedIn,
        register,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};