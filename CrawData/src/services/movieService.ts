import axios, { AxiosError } from 'axios';
import { Movie } from '../models/Movie';

class MovieService {
  private readonly baseURL = 'https://ophim1.com';
  private readonly cache: Map<string, { data: Movie[], timestamp: number }> = new Map();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 phút

  private isCacheValid(timestamp: number): boolean {
    return Date.now() - timestamp < this.CACHE_DURATION;
  }

  async crawlMovies(): Promise<Movie[]> {
    try {
      const cachedData = this.cache.get('movies');
      if (cachedData && this.isCacheValid(cachedData.timestamp)) {
        console.log('Returning cached movies data');
        return cachedData.data;
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
            timeout: 5000, // Timeout 5s
          });

          if (!response.data || !response.data.items || !response.data.pagination) {
            throw new Error('Invalid response data structure');
          }

          const { items, pagination } = response.data;

          if (Array.isArray(items)) {
            movies.push(...items);
            hasNextPage = currentPage < pagination.totalPages;
            currentPage++;
            console.log(`Fetched page ${currentPage-1}/${pagination.totalPages}`);
          } else {
            throw new Error('Items is not an array');
          }
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

      this.cache.set('movies', { data: movies, timestamp: Date.now() });
      return movies;
    } catch (error) {
      const errorMessage = error instanceof AxiosError
        ? `Failed to crawl movies: ${error.message} (${error.code})`
        : 'Failed to crawl movies';
      console.error(errorMessage);
      throw new Error(errorMessage);
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
