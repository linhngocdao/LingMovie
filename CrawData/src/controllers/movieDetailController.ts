import { Request, Response } from 'express';
import { processMovieDetails } from '../services/movieDetailService';

export const triggerDetailCrawl = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('🚀 Bắt đầu crawl chi tiết phim:', new Date().toISOString());
    await processMovieDetails();

    res.status(200).json({
      status: true,
      message: 'Đã hoàn thành job crawl chi tiết phim'
    });
  } catch (error) {
    console.error('❌ Lỗi khi crawl chi tiết phim:', error);
    res.status(500).json({
      status: false,
      message: 'Không thể hoàn thành job crawl chi tiết phim'
    });
  }
};
