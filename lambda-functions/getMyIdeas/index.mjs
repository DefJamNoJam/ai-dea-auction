// lambda-functions/getMyIdeas/index.mjs
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const handler = async (event) => {
    try {
        // 이 요청은 인증이 필요하므로, Lambda Authorizer가 검증 후 전달해준 사용자 ID를 사용합니다.
        const userId = event.requestContext.authorizer.userId;

        const userIdeas = await prisma.idea.findMany({
            where: { authorId: userId },
            orderBy: { createdAt: 'desc' },
        });

        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify(userIdeas),
        };
    } catch (error) {
        console.error('Failed to fetch user ideas:', error);
        return {
            statusCode: 500,
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({ error: 'Failed to fetch user ideas' }),
        };
    }
};