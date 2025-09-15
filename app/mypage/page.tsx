"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/auth-provider";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { User, Shield, Briefcase, LogOut, Trash2 } from "lucide-react"; // Trash2 아이콘 추가
import { Badge } from "@/components/ui/badge";

interface Idea {
  id: string;
  title: string;
  description: string;
  status: string;
}

export default function MyPage() {
  const router = useRouter();
  const { user, isLoading: isAuthLoading, logout, getAuthHeader } = useAuth();
  
  const [myIdeas, setMyIdeas] = useState<Idea[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const fetchUserData = useCallback(async () => {
    setIsLoadingData(true);
    try {
      const headers = getAuthHeader();
      if (!headers.Authorization) {
        throw new Error("No auth token found");
      }
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/ideas/me`, { headers });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          logout();
          router.push('/login?returnTo=/mypage');
        }
        throw new Error('Failed to fetch user data');
      }
      const ideas = await response.json();
      setMyIdeas(ideas);
    } catch (error) {
      console.error("Error fetching user data: ", error);
    } finally {
      setIsLoadingData(false);
    }
  }, [getAuthHeader, logout, router]);

  useEffect(() => {
    if (!isAuthLoading) {
      if (user) {
        fetchUserData();
      } else {
        router.push('/login?returnTo=/mypage');
      }
    }
  }, [user, isAuthLoading, router, fetchUserData]);
  
  // --- ✨ 1. 아이디어 삭제 핸들러 함수 추가 ---
  const handleDeleteIdea = async (ideaId: string, event: React.MouseEvent) => {
    event.preventDefault(); // 링크 이동 방지
    event.stopPropagation(); // 이벤트 버블링 방지

    // 사용자에게 정말 삭제할 것인지 확인받습니다.
    if (!window.confirm("정말로 이 아이디어를 삭제하시겠습니까? 관련된 모든 경매 및 댓글 정보가 영구적으로 삭제됩니다.")) {
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/ideas/${ideaId}`, {
        method: 'DELETE',
        headers: getAuthHeader(), // 인증 헤더 추가
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete idea');
      }

      // 삭제 성공 시, 화면에서도 해당 아이디어를 즉시 제거합니다.
      setMyIdeas(prevIdeas => prevIdeas.filter(idea => idea.id !== ideaId));
      alert("아이디어가 성공적으로 삭제되었습니다.");

    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : '삭제 중 오류가 발생했습니다.');
    }
  };
  // --- ✨ 함수 추가 끝 ---

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (isAuthLoading || (user && isLoadingData)) {
    return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Page</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Card>
              <CardHeader className="items-center text-center p-6">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src={`https://api.dicebear.com/8.x/initials/svg?seed=${user?.name || user?.email}`} />
                  <AvatarFallback>{(user?.name || user?.email || 'U')[0].toUpperCase()}</AvatarFallback>
                </Avatar>
                <CardTitle className="truncate w-full">{user?.name || 'User'}</CardTitle>
                <CardDescription className="truncate w-full">{user?.email}</CardDescription>
              </CardHeader>
              <CardContent>
                <Separator />
                <div className="mt-4 space-y-2">
                    <Link href="/mypage/settings" passHref>
                        <Button variant="ghost" className="w-full justify-start"><User className="mr-2 h-4 w-4" />Account Settings</Button>
                    </Link>
                    <Link href="/mypage/security" passHref>
                        <Button variant="ghost" className="w-full justify-start"><Shield className="mr-2 h-4 w-4" />Security</Button>
                    </Link>
                    <Link href="/mypage/billing" passHref>
                        <Button variant="ghost" className="w-full justify-start"><Briefcase className="mr-2 h-4 w-4" />Billing</Button>
                    </Link>
                  <Separator className="my-2" />
                   <Button variant="ghost" className="w-full justify-start text-red-600 hover:text-red-700" onClick={handleLogout}><LogOut className="mr-2 h-4 w-4" />Logout</Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="md:col-span-3 space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>My Submitted Ideas</CardTitle>
                <CardDescription>Ideas you have submitted for auction.</CardDescription>
              </CardHeader>
              <CardContent>
                {myIdeas.length > 0 ? (
                  <div className="space-y-4">
                    {/* --- ✨ 2. 아이디어 목록 렌더링 부분 수정 --- */}
                    {myIdeas.map(idea => (
                      <div key={idea.id} className="border p-4 rounded-lg flex items-center justify-between hover:bg-gray-100 transition-colors">
                        <Link href={`/ideas/${idea.id}`} className="flex-grow">
                          <div className="flex justify-between items-center">
                            <h3 className="font-semibold">{idea.title}</h3>
                            <Badge variant={idea.status === 'Auction' ? 'default' : 'secondary'}>{idea.status}</Badge>
                          </div>
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">{idea.description}</p>
                        </Link>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="ml-4 text-gray-500 hover:text-red-600 flex-shrink-0"
                          onClick={(e) => handleDeleteIdea(idea.id, e)}
                          aria-label={`Delete idea titled ${idea.title}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    {/* --- ✨ 수정 끝 --- */}
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    <p className="mt-4">You haven't submitted any ideas yet.</p>
                    <Button className="mt-4" onClick={() => router.push('/ideas/submit')}>Submit Your First Idea</Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>My Bids & Acquisitions</CardTitle>
                <CardDescription>Ideas you are currently bidding on or have acquired.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center text-gray-500 py-8">
                  <p>You have no active bids or acquired ideas.</p>
                  <Button className="mt-4" onClick={() => router.push('/browse')}>Browse Ideas</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}