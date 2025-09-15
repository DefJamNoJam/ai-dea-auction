"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useRouter } from 'next/navigation';

// 자체 백엔드에서 사용하는 User 타입
interface User {
  id: string;
  name: string | null;
  email: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (userData: User, token: string) => void;
  logout: () => void;
  getAuthHeader: () => { Authorization?: string };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // 페이지 로드 시 localStorage에서 토큰과 사용자 정보를 가져옵니다.
    try {
      const storedToken = localStorage.getItem('authToken');
      const storedUser = localStorage.getItem('user');

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse auth data from localStorage", error);
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    }
    setIsLoading(false);
  }, []);

  const login = (userData: User, newToken: string) => {
    localStorage.setItem('authToken', newToken);
    localStorage.setItem('user', JSON.stringify(userData));
    setToken(newToken);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    // 로그아웃 후 홈으로 이동하고 페이지를 새로고침하여 상태를 확실히 반영
    router.push('/');
    router.refresh();
  };

  const getAuthHeader = useCallback(() => {
    // 현재 상태의 토큰 대신 localStorage에서 직접 가져와 최신성을 보장
    const currentToken = localStorage.getItem('authToken');
    if (!currentToken) return {};
    return { 'Authorization': `Bearer ${currentToken}` };
  }, []);

  const value = { user, token, isLoading, login, logout, getAuthHeader };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}