import axios, { AxiosError } from 'axios';
import { MovieModel, IMovie } from '../models/Movie';

class MovieService {
  private readonly baseURL = 'https://ophim1.com';
  private isCrawling = false;

  // Lấy movies từ DB
  async getMovies(name: string): Promise<IMovie[]> {
    try {
      return await MovieModel.find({'name': {'$regex': name}}).lean();
    } catch (error) {
      console.error('❌ Lỗi khi lấy dữ liệu từ DB:', error);
      throw error;
    }
  }

  // Lưu movies vào DB
  private async saveMoviesToDB(movies: any[]): Promise<void> {
    try {
      const operations = movies.map(movie => ({
        updateOne: {
          filter: { slug: movie.slug },
          update: { $set: movie },
          upsert: true
        }
      }));

      await MovieModel.bulkWrite(operations);
      console.log(`✅ Đã lưu ${movies.length} phim vào database`);
    } catch (error) {
      console.error('❌ Lỗi khi lưu phim vào database:', error);
      throw error;
    }
  }

  // Crawl và lưu vào DB
  async crawlMovies(): Promise<void> {
    if (this.isCrawling) {
      console.log('Đang trong quá trình crawl...');
      return;
    }

    try {
      this.isCrawling = true;
      const movies: any[] = [];
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

          if (!response.data?.items || !response.data?.pagination) {
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

      await this.saveMoviesToDB(movies);
    } catch (error) {
      const errorMessage = error instanceof AxiosError
        ? `Failed to crawl movies: ${error.message} (${error.code})`
        : 'Failed to crawl movies';
      console.error(errorMessage);
      throw error;
    } finally {
      this.isCrawling = false;
    }
  }

  // Lấy chi tiết phim từ DB hoặc crawl mới
  async getMovieDetail(slug: string): Promise<IMovie | null> {
    try {
      let movie = await MovieModel.findOne({ slug }).lean();

      if (!movie) {
        const response = await axios.get(`${this.baseURL}/phim/${slug}`);
        movie = response.data.movie;
        await MovieModel.create(movie);
      }

      return movie;
    } catch (error) {
      console.error('❌ Lỗi khi lấy chi tiết phim:', error);
      throw error;
    }
  }
}

export default new MovieService();
