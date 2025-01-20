import axios, { AxiosError } from 'axios';
import { Movie } from '../models/Movie';

class MovieService {
  private readonly baseURL = 'https://ophim1.com';
  private readonly cache: Map<string, { data: Movie[], timestamp: number }> = new Map();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 phút
  private tempCache: Movie[] | null = null; // Cache tạm thời khi đang crawl
  private isCrawling = false; // Flag để kiểm tra trạng thái crawl

  private getCachedData(): Movie[] | null {
    const cachedData = this.cache.get('movies');

    // Nếu có cache, luôn trả về cache cũ trước
    if (cachedData) {
      // Kiểm tra thời gian cache
      if (Date.now() - cachedData.timestamp < this.CACHE_DURATION) {
        return cachedData.data;
      }
      // Nếu cache hết hạn, vẫn giữ lại data cũ
      return cachedData.data;
    }
    return null;
  }

  // Method để cập nhật cache chính
  private updateMainCache(movies: Movie[]): void {
    this.cache.set('movies', {
      data: movies,
      timestamp: Date.now()
    });
    this.tempCache = null;
    this.isCrawling = false;
  }

  // Thêm method để xóa cache
  public clearCache(): void {
    this.cache.clear();
    console.log('Cache cleared at:', new Date().toISOString());
  }

  async crawlMovies(isCronJob = false): Promise<Movie[]> {
    // Lấy cache hiện tại
    const cachedData = this.getCachedData();

    // Nếu không phải cron job và có cache, trả về cache
    if (!isCronJob && cachedData) {
      // Kiểm tra xem cache có cần refresh không
      const cacheTime = this.cache.get('movies')?.timestamp || 0;
      if (Date.now() - cacheTime >= this.CACHE_DURATION) {
        // Trigger crawl mới trong background
        this.crawlMoviesInBackground();
      }
      return cachedData;
    }

    // Nếu đang crawl, trả về temp cache hoặc cache cũ
    if (this.isCrawling) {
      return this.tempCache || this.cache.get('movies')?.data || [];
    }

    try {
      this.isCrawling = true;

      // Lưu cache hiện tại vào temp cache
      const currentCache = this.cache.get('movies');
      if (currentCache) {
        this.tempCache = currentCache.data;
      }

      const movies: Movie[] = [];
      let currentPage = 1;
      let hasNextPage = true;
      let retryCount = 0;
      const maxRetries = 3;

      while (hasNextPage) {
        try {
          const response = await axios.get(`${this.baseURL}/danh-sach/phim-moi-cap-nhat`, {
            params: { page: currentPage },
            timeout: 5000
          });

          if (!response.data || !response.data.items || !response.data.pagination) {
            throw new Error('Invalid response data structure');
          }

          const { items, pagination } = response.data;
          movies.push(...items);
          hasNextPage = currentPage < pagination.totalPages;
          currentPage++;

          console.log(`Crawled page ${currentPage-1}/${pagination.totalPages}`);
        } catch (error) {
          if (retryCount < maxRetries) {
            retryCount++;
            console.log(`Retry attempt ${retryCount} for page ${currentPage}`);
            await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
            continue;
          }
          throw error;
        }
      }

      // Cập nhật cache chính với dữ liệu mới
      this.updateMainCache(movies);
      return movies;

    } catch (error) {
      this.isCrawling = false;
      // Nếu có lỗi, giữ lại cache cũ
      if (this.tempCache) {
        this.cache.set('movies', {
          data: this.tempCache,
          timestamp: Date.now()
        });
      }

      const errorMessage = error instanceof AxiosError
        ? `Failed to crawl movies: ${error.message} (${error.code})`
        : 'Failed to crawl movies';
      console.error(errorMessage);

      // Trả về temp cache nếu có lỗi
      return this.tempCache || [];
    }
  }

  private async crawlMoviesInBackground(): Promise<void> {
    try {
      const movies = await this.crawlMovies(true);
      this.updateMainCache(movies);
    } catch (error) {
      console.error('Background crawl failed:', error);
    }
  }

  async getMovieDetail(slug: string): Promise<Movie> {
    try {
      const response = await axios.get(`${this.baseURL}/phim/${slug}`);
      return response.data.movie;
    } catch (error) {
      throw new Error('Failed to get movie detail');
    }
  }
}

export default new MovieService();
