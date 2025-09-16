"use client";

import { useEffect, useState, useCallback } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Button } from './ui/button';
import { useAuth } from '@/components/auth-provider';
import { get, del } from 'aws-amplify/api'; // Amplify API 함수 import

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  author: {
    name: string | null;
    id: string;
  };
}

interface CommentListProps {
  ideaId: string;
}

export function CommentList({ ideaId }: CommentListProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, isLoading: isAuthLoading } = useAuth(); // getAuthHeader 제거

  const fetchComments = useCallback(async () => {
    if (isAuthLoading) return;
    setIsLoading(true);
    setError(null);
    try {
      // fetch 대신 Amplify get 사용
      const restOperation = get({
        apiName: "apigw",
        path: `/ideas/${ideaId}/comments`
      });
      const response = await restOperation.response;
      const data = (await response.body.json()) as unknown as Comment[];
      setComments(data);
    } catch (error) {
      console.error('Error fetching comments:', error);
      setError('댓글을 불러오는 데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [ideaId, isAuthLoading]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleDelete = async (commentId: string) => {
    if (!window.confirm("정말로 이 댓글을 삭제하시겠습니까?")) return;

    try {
      // fetch와 getAuthHeader 대신 Amplify del 사용
      const restOperation = del({
        apiName: "apigw",
        path: `/ideas/${ideaId}/comments/${commentId}`
      });
      await restOperation.response;
      
      setComments(prevComments => prevComments.filter(comment => comment.id !== commentId));

    } catch (error) {
      console.error("Error deleting comment:", error);
      const anyError = error as any;
      // API Gateway에서 오는 에러 메시지를 표시
      const errorMessage = anyError.response?.body ? (await anyError.response.body.json()).error : '삭제 중 오류가 발생했습니다.';
      alert(errorMessage);
    }
  };

  if (isLoading) {
    return <div className="text-center py-4 text-muted-foreground">댓글 로딩 중...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-4">
        <div className="text-red-600 mb-2">{error}</div>
        <Button variant="outline" size="sm" onClick={fetchComments}>
          다시 시도
        </Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {comments.length === 0 ? (
         <div className="text-center py-4 text-muted-foreground">댓글이 없습니다. 첫 댓글을 작성해보세요!</div>
      ) : (
        comments.map((comment) => (
          <div key={comment.id} className="border rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div>
                <div className="font-medium">
                  {comment.author.name || '익명'}
                </div>
                <div className="text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true, locale: ko })}
                </div>
              </div>
              {user?.id === comment.author.id && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive/90"
                  onClick={() => handleDelete(comment.id)}
                >
                  삭제
                </Button>
              )}
            </div>
            <div className="mt-2 whitespace-pre-line">{comment.content}</div>
          </div>
        ))
      )}
    </div>
  );
}