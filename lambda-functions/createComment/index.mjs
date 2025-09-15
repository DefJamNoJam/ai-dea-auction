// lambda-functions/createComment/index.mjs
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const handler = async (event) => {
    try {
        const { id: ideaId } = event.pathParameters;
        const { content } = JSON.parse(event.body);
        const authorId = event.requestContext.authorizer.userId; // 인증된 사용자 ID

        if (!content || !content.trim()) {
            return {
                statusCode: 400,
                headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
                body: JSON.stringify({ error: 'Comment content cannot be empty' }),
            };
        }

        const newComment = await prisma.comment.create({
            data: {
                content: content.trim(),
                idea: { connect: { id: ideaId } },
                author: { connect: { id: authorId } },
            }
        });

        return {
            statusCode: 201,
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify(newComment),
        };
    } catch (error) {
        console.error(`Failed to create comment for idea ${event.pathParameters?.ideaId}:`, error);
        return {
            statusCode: 500,
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({ error: 'Failed to create comment' }),
        };
    }
};