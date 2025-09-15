// lambda-functions/registerUser/index.mjs
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export const handler = async (event) => {
    try {
        const { email, password, name } = JSON.parse(event.body);

        if (!email || !password || !name) {
            return {
                statusCode: 400,
                headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
                body: JSON.stringify({ error: '모든 필드를 입력해주세요.' }),
            };
        }
        // (이하 유효성 검사 로직은 생략... Express 코드와 동일)

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return {
                statusCode: 409,
                headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
                body: JSON.stringify({ error: '이미 사용 중인 이메일입니다.' }),
            };
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: { email, name, password: hashedPassword },
        });

        return {
            statusCode: 201,
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({ id: user.id, email: user.email, name: user.name }),
        };
    } catch (error) {
        console.error('Registration error:', error);
        return {
            statusCode: 500,
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({ error: '서버 오류가 발생했습니다.' }),
        };
    }
};