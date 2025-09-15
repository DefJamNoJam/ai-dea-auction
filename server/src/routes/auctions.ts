import { Router } from 'express';
import prisma from '../lib/prisma';
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

interface AuthenticatedRequest extends Request {
  user?: { id: string; name?: string; email?: string };
}
const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);
  jwt.verify(token, process.env.JWT_SECRET || '', (err: any, user: any) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

const router = Router();


// --- ✨ 새로 추가된 부분: 활성 경매 목록 조회 API ---
// 중요: 동적 라우트인 /:id 보다 먼저 와야 합니다.
router.get('/active', async (req, res) => {
  try {
    const activeAuctionIdeas = await prisma.idea.findMany({
      where: {
        status: 'Auction', // 상태가 'Auction'인 아이디어만 조회
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        author: { // 아이디어 작성자 정보 포함
          select: { name: true },
        },
        auction: { // 경매 정보 포함
          select: { currentBid: true, endTime: true },
        },
        _count: { // 좋아요, 댓글 수 포함
          select: { likedBy: true, comments: true },
        }
      },
    });
    res.json(activeAuctionIdeas);
  } catch (error) {
    console.error('Failed to fetch active auctions:', error);
    res.status(500).json({ error: 'Failed to fetch active auctions' });
  }
});
// --- ✨ 추가된 부분 끝 ---


// GET /api/auctions/:id - 특정 경매 상세 정보 조회
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const auction = await prisma.auction.findUnique({
      where: { ideaId: id },
      include: {
        idea: {
          include: {
            author: { select: { name: true, id: true } },
          },
        },
        bids: {
          orderBy: { createdAt: 'desc' },
          include: {
            bidder: { select: { name: true } },
          },
        },
      },
    });
    if (!auction) {
      return res.status(404).json({ error: 'Auction not found for this idea' });
    }
    res.json(auction);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch auction details' });
  }
});

// POST /api/auctions/:id/bids - 새 입찰 제출
router.post('/:id/bids', authenticateToken, async (req, res) => {
  const { id: ideaId } = req.params;
  const { amount } = req.body;
  const bidderId = (req as AuthenticatedRequest).user!.id;

  try {
    const auction = await prisma.auction.findUnique({ where: { ideaId } });
    if (!auction) {
      return res.status(404).json({ error: 'Auction not found' });
    }
    if (new Date() > auction.endTime) {
      return res.status(400).json({ error: 'Auction has ended' });
    }
    const currentBid = auction.currentBid ?? (await prisma.idea.findUnique({ where: { id: ideaId } }))?.startingPrice ?? 0;
    if (amount <= (currentBid || 0)) {
      return res.status(400).json({ error: 'Bid must be higher than the current bid' });
    }

    const [newBid, updatedAuction] = await prisma.$transaction([
      prisma.bid.create({
        data: { amount, auctionId: auction.id, bidderId, },
      }),
      prisma.auction.update({
        where: { id: auction.id },
        data: { currentBid: amount },
      }),
    ]);

    const bidWithBidder = { ...newBid, bidder: { name: (req as AuthenticatedRequest).user!.name } };
    res.status(201).json({ newBid: bidWithBidder, updatedAuction });
  } catch (error) {
    console.error('Bid placement error:', error);
    res.status(500).json({ error: 'Failed to place bid' });
  }
});

// POST /api/auctions/:id/finalize - 경매 종료 및 거래/수수료 기록
router.post('/:id/finalize', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const { id: ideaId } = req.params;
  const currentUserId = (req as AuthenticatedRequest).user!.id;
  const COMMISSION_RATE = 0.10;

  try {
    const idea = await prisma.idea.findUnique({
      where: { id: ideaId },
      include: {
        auction: {
          include: {
            bids: {
              orderBy: { amount: 'desc' },
              take: 1
            }
          }
        }
      }
    });

    if (!idea) return res.status(404).json({ error: "Idea not found." });
    if (idea.authorId !== currentUserId) return res.status(403).json({ error: "Only the idea owner can finalize the auction." });
    if (!idea.auction) return res.status(404).json({ error: "Auction not found for this idea." });
    if (new Date() < idea.auction.endTime) return res.status(400).json({ error: "Auction has not ended yet." });
    if (idea.status === 'Sold') return res.status(400).json({ error: "This idea has already been sold." });
    
    const winningBid = idea.auction.bids[0];
    if (!winningBid) return res.status(400).json({ error: "No bids were placed for this auction." });

    const finalPrice = winningBid.amount;
    const commissionFee = finalPrice * COMMISSION_RATE;

    const transaction = await prisma.$transaction(async (tx) => {
      await tx.idea.update({
        where: { id: ideaId },
        data: { status: 'Sold' },
      });
      return tx.transaction.create({
        data: {
          finalPrice: finalPrice,
          ideaTitle: idea.title,
          sellerId: idea.authorId,
          buyerId: winningBid.bidderId,
          commissionFee: commissionFee,
        }
      });
    });
    res.status(201).json({ message: "Auction finalized successfully", transaction });
  } catch (error) {
    console.error('Auction finalization error:', error);
    res.status(500).json({ error: 'Failed to finalize auction' });
  }
});

export default router;