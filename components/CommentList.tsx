"use client";

import { useEffect, useState, useCallback } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Button } from './ui/button';
import { useAuth } from '@/components/auth-provider';

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
  const { user, getAuthHeader, isLoading: isAuthLoading } = useAuth();

  const fetchComments = useCallback(async () => {
    if (isAuthLoading) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/ideas/${ideaId}/comments`);
      if (!response.ok) {
        throw new Error('Failed to fetch comments');
      }
      const data = await response.json();
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

  // ✨ --- 수정된 부분 시작 --- ✨
  const handleDelete = async (commentId: string) => {
    if (!window.confirm("정말로 이 댓글을 삭제하시겠습니까?")) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/ideas/${ideaId}/comments/${commentId}`, {
        method: 'DELETE',
        headers: getAuthHeader(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete comment');
      }
      
      // 삭제 성공 시 화면에서 바로 제거하여 새로고침 효과를 줍니다.
      setComments(prevComments => prevComments.filter(comment => comment.id !== commentId));

    } catch (error) {
      console.error("Error deleting comment:", error);
      alert(error instanceof Error ? error.message : '삭제 중 오류가 발생했습니다.');
    }
  };
  // ✨ --- 수정된 부분 끝 --- ✨

  if (isLoading) {
    return <div className="text-center py-4 text-muted-foreground">댓글 로딩 중...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-4">
        <div className="text-red-600 mb-2">{error}</div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={fetchComments}
        >
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
                  {formatDistanceToNow(new Date(comment.createdAt), { 
                    addSuffix: true,
                    locale: ko 
                  })}
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