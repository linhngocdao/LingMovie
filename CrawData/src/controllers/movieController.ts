import { Request, Response } from 'express';
import movieService from '../services/movieService';

interface FilterOptions {
  year?: number;
  category?: string;
  country?: string;
  type?: string;
}

class MovieController {
  // Get all movies
  public async getMovies(req: Request, res: Response) {
    try {
      const { page = 1, limit = 24 } = req.query;
      const movies = await movieService.getMovies();

      const startIndex = (Number(page) - 1) * Number(limit);
      const endIndex = startIndex + Number(limit);
      const paginatedMovies = movies.slice(startIndex, endIndex);

      return res.status(200).json({
        status: true,
        total: movies.length,
        page: Number(page),
        limit: Number(limit),
        items: paginatedMovies
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: 'Internal server error'
      });
    }
  }

  // Get movie detail
  public async getMovieDetail(req: Request, res: Response) {
    try {
      const { slug } = req.params;
      const movie = await movieService.getMovieDetail(slug);

      return res.status(200).json({
        status: true,
        movie
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: 'Failed to get movie detail'
      });
    }
  }

  // Search movies với type checking
  public async searchMovies(req: Request, res: Response) {
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

      const movies = await movieService.crawlMovies();
      let filteredMovies : any = movies;

      if (search && typeof search === 'string') {
        const searchTerm = search.toLowerCase();
        filteredMovies = filteredMovies.filter((movie: any) =>
          movie.name.toLowerCase().includes(searchTerm) ||
          movie.origin_name.toLowerCase().includes(searchTerm)
        );
      }

      if (year && !isNaN(Number(year))) {
        filteredMovies = filteredMovies.filter((movie: any) => movie.year === Number(year));
      }

      if (category && typeof category === 'string') {
        filteredMovies = filteredMovies.filter((movie: any) =>
          movie.category?.some((cat: any) => cat.slug === category)
        );
      }

      if (country && typeof country === 'string') {
        filteredMovies = filteredMovies.filter((movie: any) =>
          movie.country?.some((c: any) => c.slug === country)
        );
      }

      if (type && typeof type === 'string') {
        filteredMovies = filteredMovies.filter((movie: any) => movie.type === type);
      }

      const startIndex = (Number(page) - 1) * Number(limit);
      const endIndex = startIndex + Number(limit);
      const paginatedMovies = filteredMovies.slice(startIndex, endIndex);

      return res.status(200).json({
        status: true,
        total: filteredMovies.length,
        page: Number(page),
        limit: Number(limit),
        items: paginatedMovies
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: 'Internal server error'
      });
    }
  }
}

// Export single instance
export default new MovieController();
