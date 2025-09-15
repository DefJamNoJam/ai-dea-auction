// server/src/index.ts

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Pool } from 'pg';
import ideaRoutes from './routes/ideas';
import authRoutes from './routes/auth';
import transactionRoutes from './routes/transactions';
import commentsRoutes from './routes/comments';
import auctionsRoutes from './routes/auctions';

dotenv.config();

const app = express();
const port = process.env.SERVER_PORT || 4000;

app.use(cors());
app.use(express.json());

const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432', 10),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// API 라우터들을 등록합니다.
app.use('/api/auth', authRoutes);
app.use('/api/ideas', ideaRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/ideas/:ideaId/comments', commentsRoutes);
// --- 2. '/api/auctions' 경로로 오는 요청은 auctionsRoutes가 처리하도록 등록합니다. ---
app.use('/api/auctions', auctionsRoutes);

app.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({
      message: 'API server is running!',
      db_connection: 'successful',
      db_time: result.rows[0].now,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: 'API server is running, but DB connection failed.',
      error: err instanceof Error ? err.message : String(err),
    });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});