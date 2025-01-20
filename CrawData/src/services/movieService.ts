import axios, { AxiosError } from 'axios';
import { MovieModel, IMovie } from '../models/Movie';

const baseURL = 'https://ophim1.com';
let isCrawling = false;

// Lấy danh sách phim với phân trang
export const getMovies = async (page: number, limit: number): Promise<{ movies: IMovie[], total: number }> => {
  try {
    const total = await MovieModel.countDocuments();
    const movies = await MovieModel.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return { movies, total };
  } catch (error) {
    console.error('❌ Lỗi khi lấy danh sách phim:', error);
    throw error;
  }
};

// Lọc và tìm kiếm phim
export const filterMovies = async (options: {
  search?: string,
  year?: number,
  category?: string,
  country?: string,
  type?: string,
  page: number,
  limit: number
}): Promise<{ movies: IMovie[], total: number }> => {
  try {
    const { search, year, category, country, type, page, limit } = options;
    let query: any = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { origin_name: { $regex: search, $options: 'i' } }
      ];
    }

    if (year) query.year = year;
    if (type) query.type = type;
    if (category) query['category.slug'] = category;
    if (country) query['country.slug'] = country;

    const total = await MovieModel.countDocuments(query);
    const movies = await MovieModel.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return { movies, total };
  } catch (error) {
    console.error('❌ Lỗi khi lọc phim:', error);
    throw error;
  }
};

// Lấy chi tiết phim
export const getMovieDetail = async (slug: string): Promise<IMovie | null> => {
  try {
    return await MovieModel.findOne({ slug }).lean();
  } catch (error) {
    console.error('❌ Lỗi khi lấy chi tiết phim:', error);
    throw error;
  }
};

// Lưu movies vào DB
const saveMoviesToDB = async (movies: any[]): Promise<void> => {
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
};

// Crawl movies
export const crawlMovies = async (): Promise<void> => {
  if (isCrawling) {
    console.log('Đang trong quá trình crawl...');
    return;
  }

  try {
    isCrawling = true;
    const movies: any[] = [];
    let currentPage = 1;
    let hasNextPage = true;
    let retryCount = 0;
    const maxRetries = 3;

    while (hasNextPage) {
      try {
        const response = await axios.get(`${baseURL}/danh-sach/phim-moi-cap-nhat`, {
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

    await saveMoviesToDB(movies);
  } catch (error) {
    const errorMessage = error instanceof AxiosError
      ? `Failed to crawl movies: ${error.message} (${error.code})`
      : 'Failed to crawl movies';
    console.error(errorMessage);
    throw error;
  } finally {
    isCrawling = false;
  }
};
