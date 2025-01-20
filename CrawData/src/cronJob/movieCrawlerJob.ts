import cron from 'node-cron';
import { crawlMovies } from '../services/movieService';

export const initCronJob = (): void => {
  // Chạy job vào 0h hàng ngày
  cron.schedule('0 0 * * *', async () => {
    console.log('Starting scheduled crawl job:', new Date().toISOString());
    try {
      await crawlMovies();
    } catch (error) {
      console.error('Scheduled crawl job failed:', error);
    }
  });
};

export const runManually = async (): Promise<void> => {
  await crawlMovies();
};
