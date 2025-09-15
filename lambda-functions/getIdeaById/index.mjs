// lambda-functions/getIdeaById/index.mjs
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const handler = async (event) => {
    try {
        // Express에서는 req.params.id 로 경로 매개변수를 가져왔습니다.
        // Lambda에서는 event.pathParameters.id 로 가져옵니다. 이것이 가장 큰 차이점입니다.
        const { id } = event.pathParameters;

        const idea = await prisma.$transaction(async (tx) => {
            // ... (이하 로직은 server/src/routes/ideas.ts 와 동일합니다)
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
            return {
                statusCode: 404,
                headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
                body: JSON.stringify({ error: 'Idea not found' }),
            };
        }

        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify(idea),
        };
    } catch (error) {
        console.error('Failed to fetch idea:', error);
        return {
            statusCode: 500,
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({ error: 'Failed to fetch idea' }),
        };
    }
};