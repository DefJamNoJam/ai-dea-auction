// lambda-functions/placeBid/index.mjs
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const handler = async (event) => {
    try {
        const { id: ideaId } = event.pathParameters;
        const { amount } = JSON.parse(event.body);
        const bidderId = event.requestContext.authorizer.userId;

        const auction = await prisma.auction.findUnique({ where: { ideaId } });
        if (!auction) {
            return { statusCode: 404, body: JSON.stringify({ error: 'Auction not found' }) };
        }
        if (new Date() > auction.endTime) {
            return { statusCode: 400, body: JSON.stringify({ error: 'Auction has ended' }) };
        }
        const currentBid = auction.currentBid ?? (await prisma.idea.findUnique({ where: { id: ideaId } }))?.startingPrice ?? 0;
        if (amount <= (currentBid || 0)) {
            return { statusCode: 400, body: JSON.stringify({ error: 'Bid must be higher than the current bid' }) };
        }

        const [newBid, updatedAuction] = await prisma.$transaction([
            prisma.bid.create({ data: { amount, auctionId: auction.id, bidderId } }),
            prisma.auction.update({ where: { id: auction.id }, data: { currentBid: amount } }),
        ]);

        return {
            statusCode: 201,
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({ newBid, updatedAuction }),
        };
    } catch (error) {
        console.error('Bid placement error:', error);
        return { 
            statusCode: 500,
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({ error: 'Failed to place bid' }) 
        };
    }
};