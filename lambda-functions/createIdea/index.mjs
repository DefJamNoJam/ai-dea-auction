// lambda-functions/createIdea/index.mjs
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const handler = async (event) => {
    try {
        // API Gateway Lambda Authorizer가 JWT 토큰을 검증하고,
        // 토큰에 담겨있던 사용자 정보를 event.requestContext.authorizer 객체로 전달해줍니다.
        // Express의 authenticateToken 미들웨어와 동일한 역할을 합니다.
        const authorId = event.requestContext.authorizer.userId;

        // 프론트엔드에서 보낸 데이터(body)는 문자열이므로 JSON.parse()를 해줘야 합니다.
        const body = JSON.parse(event.body);

        // 이하는 server/src/routes/ideas.ts의 POST 로직과 거의 동일합니다.
        const {
            title, description, category, tags,
            startingPrice, auctionDuration,
            technicalDetails, marketPotential, competitiveAdvantage, implementationPlan,
        } = body;

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

        return {
            statusCode: 201, // 201 Created
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify(newIdea),
        };
    } catch (error) {
        console.error('Failed to create idea with auction:', error);
        return {
            statusCode: 500,
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({ error: 'Failed to create idea' }),
        };
    }
};