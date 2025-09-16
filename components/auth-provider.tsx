"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Amplify } from 'aws-amplify';
import { getCurrentUser, fetchAuthSession, signOut, signInWithRedirect } from 'aws-amplify/auth';

// Cognito에서 오는 사용자 정보 타입 정의
interface AuthUser {
  userId: string;
  username: string;
  signInDetails?: {
    loginId?: string;
  };
}

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
    setIsLoading(true);
    try {
      const authUser: AuthUser = await getCurrentUser();
      const session = await fetchAuthSession();
      
      // 소셜 로그인 사용자는 username이 고유 ID가 되고, 이메일은 속성에 있음
      const email = session.tokens?.idToken?.payload.email as string || authUser.signInDetails?.loginId || 'No email';
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
    checkUser();
  }, []);

  const login = () => {
    // Google 로그인 페이지로 리디렉션
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