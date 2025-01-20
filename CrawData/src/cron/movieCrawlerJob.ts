import cron from 'node-cron';
import MovieService from '../services/movieService';

class MovieCrawlerJob {
  // Chạy job vào 0h và 12h hàng ngày
  private readonly schedule = '0 0,12 * * *';
  // Biến để theo dõi trạng thái job
  private isRunning = false;
  constructor() {
    this.initJob();
  }

  private async crawlMovies(): Promise<void> {
    if (this.isRunning) {
      console.log('Crawl job is already running');
      return;
    }

    try {
      this.isRunning = true;
      console.log('Start crawling movies:', new Date().toISOString());
      await MovieService.crawlMovies();
      console.log('Finished crawling movies:', new Date().toISOString());
    } catch (error) {
      console.error('Error in crawl job:', error);
    } finally {
      this.isRunning = false;
    }
  }

  public initJob(): void {
    // Khởi tạo cron job
    cron.schedule(this.schedule, () => {
      this.crawlMovies();
    });

    // Chạy lần đầu khi khởi động server
    this.crawlMovies();
  }

  // Method để chạy job thủ công nếu cần
  public async runManually(): Promise<void> {
    await this.crawlMovies();
  }
}

export default new MovieCrawlerJob();
