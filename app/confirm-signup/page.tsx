"use client";

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { confirmSignUp, resendSignUpCode } from 'aws-amplify/auth';

function ConfirmSignUpComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';

  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Email is missing. Please go back to sign up.");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const { isSignUpComplete } = await confirmSignUp({
        username: email,
        confirmationCode: code,
      });
      if (isSignUpComplete) {
        alert("Account confirmed successfully! Please log in.");
        router.push('/login');
      }
    } catch (err: any) {
      setError(err.message || 'Confirmation failed. Please check the code and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
      if (!email) {
        setError("Email is missing. Cannot resend code.");
        return;
      }
      try {
          await resendSignUpCode({ username: email });
          alert(`A new confirmation code has been sent to ${email}`);
      } catch (err) {
          console.error(err);
          alert('Failed to resend code. Please try again shortly.');
      }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Confirm your account</CardTitle>
          <CardDescription>
            We've sent a confirmation code to <strong>{email || 'your email'}</strong>. Please enter it below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="code">Confirmation Code</Label>
              <Input id="code" type="text" value={code} onChange={(e) => setCode(e.target.value)} required />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Confirming...' : 'Confirm Account'}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Didn't receive a code?{' '}
            <button onClick={handleResendCode} className="underline text-primary">
              Resend code
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function ConfirmSignUpPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ConfirmSignUpComponent />
        </Suspense>
    )
}