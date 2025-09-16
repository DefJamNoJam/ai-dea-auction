"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThumbsUp, Eye, MessageSquare } from "lucide-react";
import { get, post } from 'aws-amplify/api'; // Amplify API 함수 import
import { CommentList } from "@/components/CommentList";
import { CommentForm } from "@/components/CommentForm";

// 타입 정의
interface Idea {
    id: string;
    title: string;
    description: string;
    category: string | null;
    tags: string[];
    status: string;
    views: number | null;
    likes: number | null;
    author: { name: string | null; id: string; };
    likedBy: { userId: string }[];
    _count: { comments: number };
    technicalDetails?: string;
    marketPotential?: string;
    competitiveAdvantage?: string;
    implementationPlan?: string;
}

export default function IdeaDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { user } = useAuth(); // getAuthHeader 제거
    const ideaId = params.id as string;

    const [idea, setIdea] = useState<Idea | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [commentCount, setCommentCount] = useState(0);

    const fetchIdea = async () => {
        if (!ideaId) return;
        setIsLoading(true);
        try {
            // fetch 대신 Amplify get 사용
            const restOperation = get({
                apiName: "apigw",
                path: `/ideas/${ideaId}`
            });
            const response = await restOperation.response;
            const data = await response.body.json();
            setIdea(data);
            setCommentCount(data._count?.comments || 0);
        } catch (err) {
            setError("Failed to fetch idea details.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchIdea();
    }, [ideaId]);

    const handleToggleLike = async () => {
        if (!user) {
            router.push(`/login?returnTo=/ideas/${ideaId}`);
            return;
        }
        if (!idea) return;

        // 낙관적 UI 업데이트
        const originalLikedBy = idea.likedBy;
        const originalLikes = idea.likes;
        const isLiked = originalLikedBy.some(like => like.userId === user.id);

        const newLikedBy = isLiked
            ? originalLikedBy.filter(like => like.userId !== user.id)
            : [...originalLikedBy, { userId: user.id }];
        
        const newLikes = (originalLikes ?? 0) + (isLiked ? -1 : 1);
        
        setIdea({ ...idea, likedBy: newLikedBy, likes: newLikes });
        
        try {
            // fetch/getAuthHeader 대신 Amplify post 사용
            const restOperation = post({
                apiName: "apigw",
                path: `/ideas/${ideaId}/toggle-like`
            });
            await restOperation.response;
        } catch (err) {
            console.error("Failed to toggle like:", err);
            setError("Failed to update like status.");
            // 오류 발생 시 원래 상태로 복구
            setIdea({ ...idea, likedBy: originalLikedBy, likes: originalLikes });
        }
    };

    if (isLoading) return <div className="text-center p-20">Loading idea...</div>;
    if (error) return <div className="text-center p-20 text-red-600">{error}</div>;
    if (!idea) return <div className="text-center p-20">Idea not found.</div>;
    
    const isLiked = user ? idea.likedBy.some(like => like.userId === user.id) : false;

    return (
        <div className="container mx-auto p-4 md:p-8">
            <Card>
                <CardHeader>
                    {idea.category && <Badge variant="secondary" className="mb-2">{idea.category}</Badge>}
                    <CardTitle className="text-3xl font-extrabold tracking-tight">{idea.title}</CardTitle>
                    <CardDescription>Posted by {idea.author.name || 'Anonymous'}</CardDescription>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground pt-2">
                        <div className="flex items-center gap-1"><Eye className="h-4 w-4" /><span>{idea.views ?? 0} Views</span></div>
                        <div className="flex items-center gap-1"><ThumbsUp className="h-4 w-4" /><span>{idea.likes ?? 0} Likes</span></div>
                        <div className="flex items-center gap-1"><MessageSquare className="h-4 w-4" /><span>{commentCount} Comments</span></div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    <p className="text-lg leading-relaxed">{idea.description}</p>
                    
                    {idea.technicalDetails && (
                        <div>
                            <h3 className="font-semibold text-lg mb-2">Technical Details</h3>
                            <p className="text-muted-foreground whitespace-pre-wrap">{idea.technicalDetails}</p>
                        </div>
                    )}
                    {idea.marketPotential && (
                         <div>
                            <h3 className="font-semibold text-lg mb-2">Market Potential</h3>
                            <p className="text-muted-foreground whitespace-pre-wrap">{idea.marketPotential}</p>
                        </div>
                    )}

                    <div className="flex items-center space-x-2">
                        <Button onClick={handleToggleLike} variant={isLiked ? "default" : "outline"}>
                            <ThumbsUp className={`h-4 w-4 mr-2 ${isLiked ? "" : "text-primary"}`} />
                            {isLiked ? 'Liked' : 'Like'}
                        </Button>
                        {idea.status === 'Auction' && (
                             <Button onClick={() => router.push(`/auctions/${idea.id}`)}>
                                Join Auction
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>

            <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4">{commentCount} Comments</h2>
                <CommentForm ideaId={ideaId} onCommentAdded={() => {
                    fetchIdea(); // 댓글 추가 후 아이디어 정보(댓글 수) 다시 로드
                }} />
                <div className="mt-6">
                    <CommentList ideaId={ideaId} />
                </div>
            </div>
        </div>
    );
}