// lambda-functions/deleteComment/index.mjs
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const handler = async (event) => {
    try {
        const userId = event.requestContext.authorizer.userId;
        const { commentId } = event.pathParameters;

        const comment = await prisma.comment.findUnique({
            where: { id: commentId },
            select: { authorId: true }
        });

        if (!comment) {
            throw { status: 404, message: 'Comment not found' };
        }

        if (comment.authorId !== userId) {
            throw { status: 403, message: 'You are not authorized to delete this comment' };
        }

        await prisma.comment.delete({ where: { id: commentId } });

        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({ message: 'Comment deleted successfully' }),
        };
    } catch (error) {
        console.error(`Failed to delete comment:`, error);
        const statusCode = error.status || 500;
        const message = error.message || 'Failed to delete comment';
        return {
            statusCode,
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({ error: message }),
        };
    }
};