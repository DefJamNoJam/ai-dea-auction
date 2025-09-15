"use client";

import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const { login, user, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        // 로딩이 끝났고, 사용자가 로그인되어 있다면 홈페이지로 리디렉션
        if (!isLoading && user) {
            router.push('/');
        }
    }, [user, isLoading, router]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <Card className="w-full max-w-sm">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl">Login</CardTitle>
                    <CardDescription>
                        Sign in to continue to AI-dea Auction
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button onClick={login} className="w-full">
                        Sign in with Google
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}