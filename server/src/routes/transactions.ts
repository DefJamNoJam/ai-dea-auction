import { Router } from 'express';
import prisma from '../lib/prisma';

const router = Router();

// GET /api/transactions - 모든 거래 내역 조회
router.get('/', async (req, res) => {
  try {
    // Prisma를 사용해 모든 Transaction을 찾습니다.
    // 'include'를 사용하여 관련된 판매자(seller)와 구매자(buyer)의 정보도 함께 가져옵니다.
    const transactions = await prisma.transaction.findMany({
      include: {
        seller: {
          select: { name: true, email: true }, // 필요한 사용자 정보만 선택적으로 가져옵니다.
        },
        buyer: {
          select: { name: true, email: true },
        },
      },
      orderBy: {
        createdAt: 'desc', // 최신순으로 정렬
      },
    });

    res.status(200).json(transactions);
  } catch (error) {
    console.error('Failed to fetch transactions:', error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

export default router;