// lambda-functions/getComments/index.mjs
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const handler = async (event) => {
    try {
        const { ideaId } = event.pathParameters;

        const comments = await prisma.comment.findMany({
            where: { ideaId },
            orderBy: { createdAt: 'desc' },
            include: {
                author: {
                    select: { name: true, id: true },
                },
            },
        });

        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify(comments),
        };
    } catch (error) {
        console.error(`Failed to fetch comments for idea ${event.pathParameters?.ideaId}:`, error);
        return {
            statusCode: 500,
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({ error: 'Failed to fetch comments' }),
        };
    }
};