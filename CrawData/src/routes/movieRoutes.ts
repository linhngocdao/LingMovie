import { Router, Request, Response } from 'express';
import MovieController from '../controllers/movieController';

const router = Router();

// GET /api/movies - Get all movies with filter and search
router.get('/', async (req: Request, res: Response) => {
  await MovieController.getMovies(req, res);
});

// GET /api/movies/search - Search movies with filters
router.get('/search', async (req: Request, res: Response) => {
  await MovieController.searchMovies(req, res);
});

// GET /api/movies/:slug - Get movie detail
router.get('/:slug', async (req: Request, res: Response) => {
  await MovieController.getMovieDetail(req, res);
});

export default router;
