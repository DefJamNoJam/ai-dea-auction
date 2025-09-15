// lambda-functions/toggleIdeaLike/index.mjs
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const handler = async (event) => {
    try {
        const userId = event.requestContext.authorizer.userId;
        const { id: ideaId } = event.pathParameters;

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
                _count: { select: { comments: true } },
            },
        });

        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify(updatedIdea),
        };
    } catch (error) {
        console.error(`Failed to toggle like for idea:`, error);
        return {
            statusCode: 500,
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({ error: 'Failed to toggle like' }),
        };
    }
};