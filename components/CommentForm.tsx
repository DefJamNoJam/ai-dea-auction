"use client";

import { useState } from 'react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { useAuth } from '@/components/auth-provider';
import { useRouter } from 'next/navigation';
import { post } from 'aws-amplify/api';

interface CommentFormProps {
  ideaId: string;
  onCommentAdded: () => void;
}

export function CommentForm({ ideaId, onCommentAdded }: CommentFormProps) {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !user) return;

    setIsSubmitting(true);
    try {
      const restOperation = post({
        apiName: "apigw",
        path: `/ideas/${ideaId}/comments`,
        options: {
          body: {
            content: content.trim()
          }
        }
      });
      await restOperation.response;
      
      setContent('');
      onCommentAdded(); // 댓글 목록 새로고침
    } catch (error) {
      console.error('Error adding comment:', error);
      alert('댓글 작성에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="text-center py-4 border rounded-lg">
        <p className="text-muted-foreground mb-2">댓글을 작성하려면 로그인이 필요합니다.</p>
        <Button onClick={() => router.push(`/login?returnTo=/ideas/${ideaId}`)}>
          로그인 페이지로 이동
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="댓글을 작성하세요..."
        rows={3}
        required
        className="resize-none"
      />
      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting || !content.trim()}>
          {isSubmitting ? '작성 중...' : '댓글 작성'}
        </Button>
      </div>
    </form>
  );
}