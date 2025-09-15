// server/src/routes/ideas.ts (Like 기능의 _count 버그까지 수정한 최종 버전)

import { Router } from 'express';
import prisma from '../lib/prisma';
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

interface AuthenticatedRequest extends Request {
  user?: { id: string; name?: string; email?: string };
}

const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.sendStatus(401);
  const token = authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);
  
  jwt.verify(token, process.env.JWT_SECRET || 'your_default_secret', (err: any, user: any) => {
    if (err) {
      console.error('[AUTH] Failed: Token verification error.', err.message);
      return res.sendStatus(403);
    }
    req.user = user;
    next();
  });
};

const router = Router();

// (다른 라우트 핸들러는 이전과 동일)
// ...
router.get('/', async (_req: Request, res: Response) => {
  try {
    const ideas = await prisma.idea.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        author: { select: { name: true } },
        _count: {
          select: { comments: true, likedBy: true },
        },
      },
    });
    res.json(ideas);
  } catch (error) {
    console.error('Failed to fetch ideas:', error);
    res.status(500).json({ error: 'Failed to fetch ideas' });
  }
});
router.get('/me', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userIdeas = await prisma.idea.findMany({
      where: { authorId: req.user!.id },
      orderBy: { createdAt: 'desc' },
    });
    res.json(userIdeas);
  } catch (error) {
    console.error('Failed to fetch user ideas:', error);
    res.status(500).json({ error: 'Failed to fetch user ideas' });
  }
});
router.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const idea = await prisma.$transaction(async (tx) => {
      const existingIdea = await tx.idea.findUnique({ where: { id } });
      if (!existingIdea) return null;
      await tx.idea.update({
        where: { id },
        data: { views: { increment: 1 } },
      });
      return tx.idea.findUnique({
        where: { id },
        include: {
          author: { select: { name: true, id: true } },
          likedBy: { select: { userId: true } },
          _count: { select: { comments: true } },
        },
      });
    });
    if (!idea) {
      return res.status(404).json({ error: 'Idea not found' });
    }
    res.json(idea);
  } catch (error) {
    console.error(`Failed to fetch idea ${id}:`, error);
    res.status(500).json({ error: 'Failed to fetch idea' });
  }
});
router.post('/', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const {
        title, description, category, tags,
        startingPrice, auctionDuration,
        technicalDetails, marketPotential, competitiveAdvantage, implementationPlan,
    } = req.body;
    const authorId = req.user!.id;
    const durationDays = parseInt(auctionDuration) || 7;
    const startTime = new Date();
    const endTime = new Date(startTime.getTime() + durationDays * 24 * 60 * 60 * 1000);
    const startPrice = parseFloat(startingPrice) || 0;
    const newIdea = await prisma.idea.create({
      data: {
        title, description, category, tags, status: "Auction", authorId,
        startingPrice: startPrice, auctionDuration: durationDays,
        technicalDetails, marketPotential, competitiveAdvantage, implementationPlan,
        auction: {
          create: { startTime, endTime, currentBid: startPrice },
        },
      },
      include: { auction: true },
    });
    res.status(201).json(newIdea);
  } catch (error) {
    console.error('Failed to create idea with auction:', error);
    res.status(500).json({ error: 'Failed to create idea' });
  }
});

// POST /api/ideas/:id/toggle-like - 좋아요 토글
router.post('/:id/toggle-like', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const { id: ideaId } = req.params;
  const userId = req.user!.id;
  try {
    const existingLike = await prisma.like.findUnique({
      where: { userId_ideaId: { userId, ideaId } },
    });
    await prisma.$transaction(async (tx) => {
      if (existingLike) {
        await tx.like.delete({ where: { userId_ideaId: { userId, ideaId } } });
        await tx.idea.update({ where: { id: ideaId }, data: { likes: { decrement: 1 } } });
      } else {
        await tx.like.create({ data: { userId, ideaId } });
        await tx.idea.update({ where: { id: ideaId }, data: { likes: { increment: 1 } } });
      }
    });
    
    const updatedIdea = await prisma.idea.findUnique({
      where: { id: ideaId },
      include: {
        author: { select: { name: true, id: true } },
        likedBy: { select: { userId: true } },
        // --- ✨ 수정된 부분: _count 정보를 응답에 포함시킵니다 ---
        _count: { select: { comments: true } },
      },
    });
    res.json(updatedIdea);
  } catch (error) {
    console.error(`Failed to toggle like for idea ${ideaId}:`, error);
    res.status(500).json({ error: 'Failed to toggle like' });
  }
});

router.delete('/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const { id: ideaId } = req.params;
  const userId = req.user!.id;
  try {
    await prisma.$transaction(async (tx) => {
      const idea = await tx.idea.findUnique({
        where: { id: ideaId },
        select: { authorId: true, auction: { select: { id: true } } },
      });
      if (!idea) {
        throw { status: 404, message: 'Idea not found' };
      }
      if (idea.authorId !== userId) {
        throw { status: 403, message: 'You are not authorized to delete this idea' };
      }
      await tx.like.deleteMany({ where: { ideaId } });
      await tx.comment.deleteMany({ where: { ideaId } });
      if (idea.auction) {
        await tx.bid.deleteMany({ where: { auctionId: idea.auction.id } });
        await tx.auction.delete({ where: { id: idea.auction.id } });
      }
      await tx.idea.delete({ where: { id: ideaId } });
    });
    res.status(200).json({ message: 'Idea and all related data deleted successfully' });
  } catch (error: any) {
    console.error(`Failed to delete idea ${ideaId}:`, error);
    if (error.status) {
      res.status(error.status).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Failed to delete idea' });
    }
  }
});

export default router;