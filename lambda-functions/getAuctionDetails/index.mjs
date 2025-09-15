import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const handler = async (event) => {
    try {
        // API Gateway 경로의 {id}는 idea의 ID를 의미합니다.
        const { id: ideaId } = event.pathParameters;

        // Prisma 스키마에 따라 ideaId를 통해 연결된 Auction 정보를 찾습니다.
        const auction = await prisma.auction.findUnique({
            where: { ideaId: ideaId },
            include: {
                idea: { // 아이디어 기본 정보 포함
                    include: {
                        author: { select: { name: true, id: true } }, // 아이디어 작성자 정보
                    },
                },
                bids: { // 모든 입찰 내역 포함
                    orderBy: { createdAt: 'desc' }, // 최신순으로 정렬
                    include: {
                        bidder: { select: { name: true } }, // 입찰자 이름
                    },
                },
            },
        });

        if (!auction) {
            return {
                statusCode: 404,
                headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
                body: JSON.stringify({ error: 'Auction not found for this idea' }),
            };
        }

        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify(auction),
        };
    } catch (error) {
        console.error('Failed to fetch auction details:', error);
        return {
            statusCode: 500,
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({ error: 'Failed to fetch auction details' }),
        };
    }
};