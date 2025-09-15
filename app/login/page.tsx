"use client";

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useLanguage } from '@/components/language-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/components/auth-provider';
import { Suspense } from 'react';
import Link from 'next/link';

function LoginComponent() {
  const [isLoginView, setIsLoginView] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const { t } = useLanguage();

  const handleGoogleSignIn = () => {
    setError("소셜 로그인은 AWS 마이그레이션 시 구현될 예정입니다.");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const endpoint = isLoginView ? 'login' : 'register';
    const body = isLoginView 
      ? JSON.stringify({ email, password })
      : JSON.stringify({ email, password, name });

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: body,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'An error occurred.');
      }

      if (isLoginView) {
        login(data.user, data.token);
        const returnTo = searchParams.get('returnTo');
        router.push(returnTo || '/');
      } else {
        alert('회원가입이 완료되었습니다! 로그인해주세요.');
        setIsLoginView(true);
        setPassword(''); // 비밀번호 필드 초기화
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">{isLoginView ? t('auth.welcomeBack') : t('auth.welcome')}</CardTitle>
          <CardDescription>
            {isLoginView ? t('auth.signInDesc') : t('auth.createAccountDesc')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button variant="outline" className="w-full" onClick={handleGoogleSignIn}>
              {t('auth.continueWithGoogle')}
            </Button>
            <div className="relative">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
              <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-muted-foreground">{t('auth.or')}</span></div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLoginView && (
                <div className="space-y-2">
                  <Label htmlFor="name">{t('auth.name')}</Label>
                  <Input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">{t('auth.email')}</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">{t('auth.password')}</Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Processing...' : (isLoginView ? t('auth.signIn') : t('auth.createAccount'))}
              </Button>
            </form>
          </div>

          <div className="mt-4 text-center text-sm">
            {isLoginView ? t('auth.dontHaveAccount') : t('auth.alreadyHaveAccount')}{' '}
            <button onClick={() => { setIsLoginView(!isLoginView); setError(null); }} className="underline text-primary">
              {isLoginView ? t('auth.signup') : t('auth.login')}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginComponent />
    </Suspense>
  );
}