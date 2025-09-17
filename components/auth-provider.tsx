"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Amplify } from 'aws-amplify';
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

  // 사용자 정보를 가져오는 함수
  const checkUser = async () => {
    try {
      const authUser = await getCurrentUser();
      const session = await fetchAuthSession();
      
      const email = session.tokens?.idToken?.payload.email as string || 'No email';
      const name = session.tokens?.idToken?.payload.name as string || authUser.username;

      setUser({
          id: authUser.userId,
          name: name,
          email: email,
      });
    } catch (error) {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Amplify Hub를 사용하여 인증 이벤트를 감지합니다.
    const unsubscribe = Hub.listen('auth', ({ payload }) => {
      switch (payload.event) {
        case 'signedIn':
          // 로그인 성공 시 사용자 정보를 다시 확인합니다.
          checkUser();
          break;
        case 'signedOut':
          // 로그아웃 시 사용자 정보를 null로 설정합니다.
          setUser(null);
          break;
      }
    });

    // 컴포넌트가 처음 로드될 때 사용자 상태를 확인합니다.
    checkUser();

    // 컴포넌트가 언마운트될 때 리스너를 정리합니다.
    return unsubscribe;
  }, []);

  const login = () => {
    signInWithRedirect({ provider: 'Google' });
  };

  const logout = async () => {
    await signOut();
    setUser(null); // 즉시 UI 업데이트
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