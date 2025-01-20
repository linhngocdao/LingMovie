import { Request, Response } from 'express';
import * as movieService from '../services/movieService';
import { filterMovies } from '../services/movieService';
import { logger } from '../utils/logger';
import { createErrorResponse } from '../utils/response';

interface FilterOptions {
  year?: number;
  category?: string;
  country?: string;
  type?: string;
}

interface PaginationParams {
  page: number;
  limit: number;
}

interface MovieResponse {
  status: boolean;
  total?: number;
  page?: number;
  limit?: number;
  items?: any[];
  message?: string;
  movie?: any;
}

const createPaginatedResponse = (data: any[], total: number, page: number, limit: number): MovieResponse => ({
  status: true,
  total,
  page,
  limit,
  items: data
});

const handleError = (error: any): MovieResponse => {
  console.error('Error:', error);
  return {
    status: false,
    message: 'Internal server error'
  };
};

export const getMovies = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 24;

    const { movies, total } = await movieService.getMovies(page, limit);
    res.status(200).json(createPaginatedResponse(movies, total, page, limit));
  } catch (error) {
    res.status(500).json(handleError(error));
  }
};

export const filterMoviesHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const options = {
      search: req.query.search as string,
      year: req.query.year ? Number(req.query.year) : undefined,
      category: req.query.category as string,
      country: req.query.country as string,
      type: req.query.type as string,
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 24
    };

    logger.debug('Filtering movies with options', options);

    const { movies, total } = await filterMovies(options);

    res.json(createPaginatedResponse(movies, total, options.page, options.limit));
  } catch (error) {
    logger.error('Controller error while filtering movies', error);
    res.status(500).json(createErrorResponse('Lỗi server khi lọc phim'));
  }
};

export const getMovieDetail = async (req: Request, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;
    const result = await movieService.getMovieDetail(slug);

    // Trả về kết quả với status code phù hợp
    res.status(result.status ? 200 : 404).json(result);

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      status: false,
      msg: 'Lỗi server',
      movie: null,
      episodes: []
    });
  }
};

export const triggerCrawl = async (req: Request, res: Response): Promise<void> => {
  try {
    await movieService.crawlMovies();
    res.status(200).json({
      status: true,
      message: 'Crawl job started successfully'
    });
  } catch (error) {
    res.status(500).json(handleError(error));
  }
};
