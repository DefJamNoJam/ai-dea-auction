// lambda-functions/getAllIdeas/index.mjs

// 이 코드는 AWS Lambda Layer에 포함된 Prisma Client를 가져옵니다.
import { PrismaClient } from '@prisma/client';

// Prisma Client 인스턴스는 핸들러 함수 바깥에서 생성하는 것이 중요합니다.
// 이렇게 하면 Lambda 실행 환경이 유지되는 동안 데이터베이스 연결을 재사용하여 성능을 높일 수 있습니다.
const prisma = new PrismaClient();

// 이 handler 함수가 Lambda가 호출될 때마다 실행되는 메인 코드입니다.
// Express의 (req, res) => { ... } 부분이 이 handler로 대체됩니다.
export const handler = async (event) => {
    try {
        // 이 Prisma 쿼리는 server/src/routes/ideas.ts에 있던 코드와 완전히 동일합니다.
        const ideas = await prisma.idea.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                author: { select: { name: true } },
                _count: {
                    select: { comments: true, likedBy: true },
                },
            },
        });

        // Lambda 함수는 API Gateway가 이해할 수 있는 특정 형식으로 응답을 반환해야 합니다.
        return {
            // HTTP 상태 코드 (성공 시 200)
            statusCode: 200,
            // HTTP 헤더: CORS 문제를 방지하기 위해 반드시 포함해야 합니다.
            headers: { 
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*" // 모든 도메인에서의 요청을 허용
            },
            // 실제 데이터: 반드시 JSON.stringify()를 사용하여 문자열로 만들어야 합니다.
            body: JSON.stringify(ideas),
        };
    } catch (error) {
        console.error('Failed to fetch ideas:', error);
        // 에러 발생 시 500 상태 코드와 에러 메시지를 반환합니다.
        return {
            statusCode: 500,
            headers: { 
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify({ error: 'Failed to fetch ideas' }),
        };
    }
};