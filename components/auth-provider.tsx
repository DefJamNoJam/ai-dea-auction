// components/auth-provider.tsx
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getCurrentUser, fetchAuthSession, signOut, signInWithRedirect } from 'aws-amplify/auth';
import { Hub } from 'aws-amplify/utils';

// User 타입 정의
interface User {
    id: string;
    name: string;
    email: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkUser = async () => {
    try {
      const authUser = await getCurrentUser();
      const session = await fetchAuthSession();

      const email = session.tokens?.idToken?.payload.email as string || 'No email provided';
      const name = session.tokens?.idToken?.payload.name as string || authUser.username;

      setUser({
          id: authUser.userId,
          name: name,
          email: email,
      });
    } catch (error) {
      console.error("Not signed in:", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = Hub.listen('auth', ({ payload }) => {
      switch (payload.event) {
        case 'signedIn':
        case 'tokenRefresh': // 세션이 갱신될 때도 사용자 정보를 업데이트합니다.
          checkUser();
          break;
        case 'signedOut':
          setUser(null);
          break;
      }
    });

    checkUser(); // 페이지 로드 시 첫 사용자 확인

    return unsubscribe; // 컴포넌트가 사라질 때 리스너를 정리합니다.
  }, []);

  const login = () => {
    signInWithRedirect({ provider: 'Google' });
  };

  const logout = async () => {
    await signOut();
    setUser(null);
  };

  const value = { user, isLoading, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}