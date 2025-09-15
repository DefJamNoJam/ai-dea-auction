"use client";

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CommentForm } from '@/components/CommentForm';
import { CommentList } from '@/components/CommentList';
import { Heart, Eye } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

// API 응답에 맞는 타입 정의
interface Author {
  id: string;
  name: string | null;
}

interface LikedBy {
  userId: string;
}

interface Counts {
  comments: number;
}

interface Idea {
  id: string;
  title: string;
  description: string;
  category: string | null;
  tags: string[];
  status: string;
  views: number | null;
  likes: number;
  author: Author | null;
  likedBy: LikedBy[];
  _count: Counts | null;
  technicalDetails?: string;
  marketPotential?: string;
  competitiveAdvantage?: string;
  implementationPlan?: string;
  createdAt: string;
  updatedAt: string;
}

export default function IdeaDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, getAuthHeader } = useAuth();
  const [idea, setIdea] = useState<Idea | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // ✨ 1. 댓글 목록을 새로고침하기 위한 상태(트리거)를 추가합니다.
  const [commentUpdateTrigger, setCommentUpdateTrigger] = useState(0);

  const ideaId = params.id as string;

  const fetchIdea = useCallback(async () => {
    // fetchIdea 함수를 useCallback으로 감싸 불필요한 재실행을 방지합니다.
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/ideas/${ideaId}`);
      if (!response.ok) {
        throw new Error('Idea not found');
      }
      const data = await response.json();
      setIdea(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [ideaId]);

  useEffect(() => {
    if (ideaId) {
      fetchIdea();
    }
  }, [ideaId, fetchIdea]);
  
  const handleLike = async () => {
    if (!user) {
      router.push(`/login?returnTo=/ideas/${ideaId}`);
      return;
    }
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/ideas/${ideaId}/toggle-like`, {
        method: 'POST',
        headers: getAuthHeader(),
      });
      if (!response.ok) {
        throw new Error('Failed to update like status');
      }
      const updatedIdea = await response.json();
      setIdea(updatedIdea);
    } catch (error) {
      console.error("Failed to toggle like:", error);
    }
  };

  // ✨ 2. 댓글이 추가되었을 때 호출될 함수를 만듭니다.
  // 이 함수는 트리거 상태를 변경하고, 아이디어 정보(댓글 수)를 다시 불러옵니다.
  const handleCommentAdded = () => {
    setCommentUpdateTrigger(prev => prev + 1); // CommentList를 새로고침하기 위한 키 변경
    fetchIdea(); // 댓글 수를 업데이트하기 위해 아이디어 정보 다시 로드
  };

  if (isLoading) {
    return <div className="p-8 text-center">Loading idea details...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-600">Error: {error}</div>;
  }

  if (!idea) {
    return <div className="p-8 text-center">Idea could not be found.</div>;
  }

  const isLiked = user ? idea.likedBy.some(like => like.userId === user.id) : false;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
            <span>{idea.category || 'Uncategorized'}</span>
            <span>&middot;</span>
            <span>By {idea.author?.name || 'Unknown Author'}</span>
          </div>
          <h1 className="text-4xl font-bold mb-3">{idea.title}</h1>
          <div className="flex items-center space-x-4 text-gray-600">
            <div className="flex items-center space-x-1">
              <Eye size={16} />
              <span>{idea.views ?? 0} views</span>
            </div>
            <div className="flex items-center space-x-1">
              <Heart size={16} className={isLiked ? "text-red-500 fill-current" : ""} />
              <span>{idea.likes} likes</span>
            </div>
          </div>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            <p className="text-lg leading-relaxed">{idea.description}</p>
            
            {idea.technicalDetails && <InfoCard title="Technical Details" content={idea.technicalDetails} />}
            {idea.marketPotential && <InfoCard title="Market Potential" content={idea.marketPotential} />}
            {idea.competitiveAdvantage && <InfoCard title="Competitive Advantage" content={idea.competitiveAdvantage} />}
            {idea.implementationPlan && <InfoCard title="Implementation Plan" content={idea.implementationPlan} />}

            <Separator />
            
            <section>
              <h2 className="text-2xl font-bold mb-4">Comments ({idea._count?.comments ?? 0})</h2>
              {/* ✨ 3. CommentForm에 onCommentAdded prop으로 함수를 전달합니다. */}
              <CommentForm ideaId={idea.id} onCommentAdded={handleCommentAdded} />
              <div className="mt-6">
                {/* ✨ 4. CommentList에 key prop을 전달하여 트리거가 변경될 때마다 강제로 새로고침되게 합니다. */}
                <CommentList ideaId={idea.id} key={commentUpdateTrigger} />
              </div>
            </section>
          </div>

          <aside className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Auction Status</CardTitle>
                <Badge variant="default">{idea.status}</Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full" onClick={() => router.push(`/auctions/${idea.id}`)}>Join Auction</Button>
                <Button className="w-full" variant={isLiked ? "secondary" : "outline"} onClick={handleLike}>
                  <Heart className="mr-2 h-4 w-4" />
                  {isLiked ? 'Unlike' : 'Like'}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Meta Information</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2 text-gray-600">
                <p><strong>Created:</strong> {new Date(idea.createdAt).toLocaleString()}</p>
                <p><strong>Last Updated:</strong> {new Date(idea.updatedAt).toLocaleString()}</p>
                <div className="pt-2">
                  {idea.tags.map(tag => <Badge key={tag} variant="outline" className="mr-1 mb-1">{tag}</Badge>)}
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
}

const InfoCard = ({ title, content }: { title: string, content: string }) => (
  <section>
    <h2 className="text-2xl font-bold border-b pb-2 mb-4">{title}</h2>
    <p className="text-base whitespace-pre-wrap">{content}</p>
  </section>
);