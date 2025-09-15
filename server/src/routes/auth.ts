import { Router } from 'express';
import prisma from '../lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = Router();

// POST /api/auth/register - 회원가입
router.post('/register', async (req, res) => {
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ error: '모든 필드를 입력해주세요.' });
  }
  if (password.length < 8) {
    return res.status(400).json({ error: '비밀번호는 8자 이상이어야 합니다.' });
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: '이미 사용 중인 이메일입니다.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    });

    res.status(201).json({
      id: user.id,
      email: user.email,
      name: user.name,
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

// POST /api/auth/login - 로그인
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: '이메일과 비밀번호를 입력해주세요.' });
    }

    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(401).json({ error: '이메일 또는 비밀번호가 올바르지 않습니다.' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: '이메일 또는 비밀번호가 올바르지 않습니다.' });
        }
        
        // --- ✨ 수정된 부분: JWT_SECRET을 process.env에서 가져오도록 변경 ---
        const token = jwt.sign(
            { id: user.id, email: user.email, name: user.name }, 
            process.env.JWT_SECRET as string, // .env 파일에 추가한 비밀 키 사용
            { expiresIn: '7d' }
        );

        res.status(200).json({
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: '서버 오류가 발생했습니다.' });
    }
});


export default router;