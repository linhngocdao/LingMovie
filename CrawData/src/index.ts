import dotenv from 'dotenv';
import express, { Express } from 'express';
import movieRoutes from './routes/movieRoutes';
import './cron/movieCrawlerJob';
import connectDatabase from './config/database';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.use(express.json());
app.use('/api/movies', movieRoutes);
app.get('/', (req, res) => {
  res.json({
    status: true,
    message: 'Movie API is running',
    documentation: '/api/docs',
    version: '1.0.0'
  });
});



// Kết nối database trước khi khởi động server
const startServer = async () => {
  try {
    await import('./cron/movieCrawlerJob');
    await connectDatabase();

    app.listen(port, () => {
      console.log(`⚡️[server]: Server đang chạy tại http://localhost:${port}`);
    });
  } catch (error) {
    console.error('❌ Lỗi khởi động server:', error);
    process.exit(1);
  }
};

startServer();
export default app;
