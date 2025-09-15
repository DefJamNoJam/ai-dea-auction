// lambda-functions/deleteIdea/index.mjs
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const handler = async (event) => {
    try {
        // Authorizer를 통해 인증된 사용자의 ID를 가져옵니다.
        const userId = event.requestContext.authorizer.userId;
        // URL 경로에서 아이디어의 ID를 가져옵니다.
        const { id: ideaId } = event.pathParameters;

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

            // 관련된 데이터(좋아요, 댓글, 입찰, 경매)를 먼저 삭제합니다.
            await tx.like.deleteMany({ where: { ideaId } });
            await tx.comment.deleteMany({ where: { ideaId } });
            if (idea.auction) {
                await tx.bid.deleteMany({ where: { auctionId: idea.auction.id } });
                await tx.auction.delete({ where: { id: idea.auction.id } });
            }

            // 마지막으로 아이디어를 삭제합니다.
            await tx.idea.delete({ where: { id: ideaId } });
        });

        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({ message: 'Idea and all related data deleted successfully' }),
        };
    } catch (error) {
        console.error(`Failed to delete idea:`, error);
        const statusCode = error.status || 500;
        const message = error.message || 'Failed to delete idea';
        return {
            statusCode,
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({ error: message }),
        };
    }
};