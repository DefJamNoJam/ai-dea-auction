"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { get } from 'aws-amplify/api';

// 타입을 간단하게 정의합니다.
interface Idea {
  id: string;
  title: string;
  status: string;
  views: number | null;
  likes: number | null;
  _count?: { comments: number };
}

export default function MyPage() {
  const router = useRouter();
  const { user, isLoading: isAuthLoading, logout } = useAuth();

  const [myIdeas, setMyIdeas] = useState<Idea[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    if (isAuthLoading) return;
    if (!user) {
      router.replace("/login");
      return;
    }

    const fetchMyIdeas = async () => {
      setIsLoadingData(true);
      try {
        const restOperation = get({
          apiName: "apigw",
          path: "/ideas/me"
        });
        const response = await restOperation.response;
        const data = await response.body.json() as unknown as Idea[];
        setMyIdeas(data);
      } catch (error) {
        console.error("Failed to fetch my ideas:", error);
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchMyIdeas();
  }, [user, isAuthLoading, router]);

  if (isAuthLoading || isLoadingData) {
    return <div className="text-center p-20">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
        <h1 className="text-3xl font-bold mb-6">My Page</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>My Ideas</CardTitle>
                    <CardDescription>You have submitted {myIdeas.length} ideas.</CardDescription>
                </CardHeader>
                <CardContent>
                    {myIdeas.map(idea => (
                        <div key={idea.id} className="mb-2 p-2 border rounded">
                           <Link href={`/ideas/${idea.id}`} className="font-semibold text-blue-600 hover:underline">{idea.title}</Link>
                           <p className="text-sm text-gray-500">Status: {idea.status}</p>
                        </div>
                    ))}
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle>Account Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    <p><strong>Email:</strong> {user?.email}</p>
                    <p><strong>Name:</strong> {user?.name}</p>
                    <Button variant="outline" size="sm" onClick={() => router.push('/mypage/settings')}>Edit Profile</Button>
                    <Button variant="outline" size="sm" onClick={() => router.push('/mypage/security')}>Change Password</Button>
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle>Billing</CardTitle>
                </CardHeader>
                <CardContent>
                    <Button variant="outline" size="sm" onClick={() => router.push('/mypage/billing')}>Manage Billing</Button>
                     <Button variant="destructive" size="sm" onClick={logout} className="mt-4">Logout</Button>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}