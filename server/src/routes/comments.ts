import { Router } from 'express';
import prisma from '../lib/prisma';
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

interface AuthenticatedRequest extends Request {
  user?: { id: string };
}

// JWT 토큰을 검증하는 미들웨어
const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET || 'your_default_secret', (err: any, user: any) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

const router = Router({ mergeParams: true });

// GET /api/ideas/:ideaId/comments - 특정 아이디어의 댓글 목록 조회
router.get('/', async (req, res) => {
  const { ideaId } = req.params;
  try {
    const comments = await prisma.comment.findMany({
      where: { ideaId },
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: { name: true, id: true },
        },
      },
    });
    res.json(comments);
  } catch (error) {
    console.error(`Failed to fetch comments for idea ${ideaId}:`, error);
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
});

// POST /api/ideas/:ideaId/comments - 특정 아이디어에 새 댓글 작성
router.post('/', authenticateToken, async (req: AuthenticatedRequest, res) => {
  const { ideaId } = req.params;
  const { content } = req.body;
  const authorId = req.user!.id; // authenticateToken을 통과했으므로 user는 항상 존재

  try {
    // --- ✨ 수정된 부분 시작 ✨ ---
    const newComment = await prisma.comment.create({
      data: {
        content,
        // authorId와 ideaId를 직접 할당하는 대신,
        // connect를 사용하여 기존 User 및 Idea 레코드와 연결합니다.
        author: {
          connect: { id: authorId }
        },
        idea: {
          connect: { id: ideaId }
        }
      }
    });
    res.status(201).json(newComment);
  } catch (error) {
    console.error(`Failed to create comment for idea ${ideaId}:`, error);
    res.status(500).json({ error: 'Failed to create comment' });
  }
});

export default router;