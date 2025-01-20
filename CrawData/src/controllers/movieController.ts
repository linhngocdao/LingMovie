import { Request, Response } from 'express';
import * as movieService from '../services/movieService';

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

export const filterMovies = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      search,
      year,
      category,
      country,
      type,
      page = 1,
      limit = 24
    } = req.query;

    const { movies, total } = await movieService.filterMovies({
      search: search as string,
      year: year ? Number(year) : undefined,
      category: category as string,
      country: country as string,
      type: type as string,
      page: Number(page),
      limit: Number(limit)
    });

    res.status(200).json(createPaginatedResponse(movies, total, Number(page), Number(limit)));
  } catch (error) {
    res.status(500).json(handleError(error));
  }
};

export const getMovieDetail = async (req: Request, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;
    const movie = await movieService.getMovieDetail(slug);

    if (!movie) {
      res.status(404).json({
        status: false,
        message: 'Movie not found'
      });
      return;
    }

    res.status(200).json({
      status: true,
      movie
    });
  } catch (error) {
    res.status(500).json(handleError(error));
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
