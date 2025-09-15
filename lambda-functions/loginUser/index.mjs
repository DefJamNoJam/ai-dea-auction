// lambda-functions/loginUser/index.mjs
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export const handler = async (event) => {
    try {
        const { email, password } = JSON.parse(event.body);

        if (!email || !password) {
            return {
                statusCode: 400,
                headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
                body: JSON.stringify({ error: '이메일과 비밀번호를 입력해주세요.' }),
            };
        }

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return {
                statusCode: 401,
                headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
                body: JSON.stringify({ error: '이메일 또는 비밀번호가 올바르지 않습니다.' }),
            };
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return {
                statusCode: 401,
                headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
                body: JSON.stringify({ error: '이메일 또는 비밀번호가 올바르지 않습니다.' }),
            };
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, name: user.name },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({
                token,
                user: { id: user.id, email: user.email, name: user.name }
            }),
        };
    } catch (error) {
        console.error('Login error:', error);
        return {
            statusCode: 500,
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({ error: '서버 오류가 발생했습니다.' }),
        };
    }
};