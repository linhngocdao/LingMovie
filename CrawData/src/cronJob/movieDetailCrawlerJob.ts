import cron from 'node-cron';
import { processMovieDetails } from '../services/movieDetailService';

class MovieDetailCrawlerJob {
  private readonly schedule = '0 2 * * *'; // Chạy lúc 2h sáng
  private isRunning = false;

  constructor() {
    this.initJob();
  }

  private async crawlMovieDetails(): Promise<void> {
    if (this.isRunning) {
      console.log('Movie detail job đang chạy...');
      return;
    }

    try {
      this.isRunning = true;
      console.log('Bắt đầu cập nhật chi tiết phim:', new Date().toISOString());
      await processMovieDetails();
      console.log('Hoàn thành cập nhật chi tiết phim:', new Date().toISOString());
    } catch (error) {
      console.error('Lỗi khi cập nhật chi tiết phim:', error);
    } finally {
      this.isRunning = false;
    }
  }

  public initJob(): void {
    cron.schedule(this.schedule, () => {
      this.crawlMovieDetails();
    });
  }

  public async runManually(): Promise<void> {
    await this.crawlMovieDetails();
  }
}

export default new MovieDetailCrawlerJob();
