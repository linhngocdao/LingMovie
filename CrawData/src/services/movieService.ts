import axios, { AxiosError } from 'axios';
import { MovieModel, IMovie } from '../models/Movie';
import { MovieDetailModel, IMovieDetail } from '../models/MovieDetail';
import { cacheManager } from '../utils/cache';
import { logger } from '../utils/logger';
import { isValidNumber, sanitizeString, validatePaginationParams } from '../utils/validation';

const baseURL = 'https://ophim1.com';
let isCrawling = false;

interface FilterOptions {
  search?: string;
  year?: number;
  category?: string;
  country?: string;
  type?: string;
  page: number;
  limit: number;
}

// Xây dựng query tìm kiếm
const buildSearchQuery = (search?: string): object => {
  if (!search?.trim()) return {};

  const searchRegex = new RegExp(search.trim(), 'i');
  return {
    $or: [
      { name: searchRegex },
      { origin_name: searchRegex }
    ]
  };
};

// Xây dựng query lọc
const buildFilterQuery = (options: FilterOptions): object => {
  const query: any = {};

  if (options.year && Number.isInteger(options.year)) {
    query.year = options.year;
  }

  if (options.type?.trim()) {
    query.type = options.type.trim();
  }

  if (options.category?.trim()) {
    query['category.slug'] = options.category.trim();
  }

  if (options.country?.trim()) {
    query['country.slug'] = options.country.trim();
  }

  return query;
};

// Tạo cache key
const generateCacheKey = (options: FilterOptions): string => {
  return `movies:filter:${JSON.stringify(options)}`;
};

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

// Hàm filter chính
export const filterMovies = async (options: FilterOptions): Promise<{
  movies: IMovie[];
  total: number;
}> => {
  try {
    const cacheKey = generateCacheKey(options);
    const cachedResult = await cacheManager.get(cacheKey);

    if (cachedResult) {
      logger.debug('Cache hit for movie filter', { cacheKey });
      return cachedResult;
    }

    const { page, limit } = validatePaginationParams(options.page, options.limit);

    const query = {
      ...buildSearchQuery(sanitizeString(options.search)),
      ...buildFilterQuery({
        ...options,
        year: isValidNumber(options.year) ? Number(options.year) : undefined,
        category: sanitizeString(options.category),
        country: sanitizeString(options.country),
        type: sanitizeString(options.type)
      })
    };

    // Thực hiện query song song
    const [total, movies] = await Promise.all([
      MovieModel.countDocuments(query),
      MovieModel.find(query)
        .select('name origin_name thumb_url year type slug poster_url status')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean()
    ]);

    const result = { movies, total };

    // Cache kết quả trong 5 phút
    await cacheManager.set(cacheKey, result, 300);
    logger.debug('Cache set for movie filter', { cacheKey });

    return result;

  } catch (error) {
    logger.error('Error filtering movies', error);
    throw error;
  }
};

// Lấy chi tiết phim từ bảng MovieDetail
export const getMovieDetail = async (slug: string): Promise<any> => {
  try {
    // Kiểm tra cache trong DB
    const cachedDetail = await MovieDetailModel.findOne({ 'movie.slug': slug }).lean();

    if (cachedDetail) {
      console.log(`✅ Lấy chi tiết phim từ cache: ${slug}`);
      return {
        status: true,
        msg: '',
        movie: cachedDetail.movie,
        episodes: cachedDetail.episodes
      };
    }

    // Nếu không có trong cache, gọi API
    console.log(`🔄 Gọi API để lấy chi tiết phim: ${slug}`);
    const response = await axios.get(`${baseURL}/phim/${slug}`);

    if (!response.data?.movie || !response.data?.episodes) {
      return {
        status: false,
        msg: 'Không tìm thấy thông tin phim',
        movie: null,
        episodes: []
      };
    }

    // Lưu vào cache
    await MovieDetailModel.create({
      movie: response.data.movie,
      episodes: response.data.episodes
    });

    console.log(`✅ Đã cache chi tiết phim: ${slug}`);

    // Trả về response giống hệt API gốc
    return {
      status: true,
      msg: '',
      movie: response.data.movie,
      episodes: response.data.episodes
    };

  } catch (error) {
    console.error(`❌ Lỗi khi lấy chi tiết phim ${slug}:`, error);
    return {
      status: false,
      msg: 'Có lỗi xảy ra khi lấy thông tin phim',
      movie: null,
      episodes: []
    };
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

// Thêm index cho các trường thường xuyên tìm kiếm
MovieModel.schema.index({ year: 1 });
MovieModel.schema.index({ type: 1 });
MovieModel.schema.index({ 'category.slug': 1 });
MovieModel.schema.index({ 'country.slug': 1 });
MovieModel.schema.index({ createdAt: -1 });
MovieModel.schema.index(
  { name: 'text', origin_name: 'text' },
  { weights: { name: 2, origin_name: 1 } }
);
