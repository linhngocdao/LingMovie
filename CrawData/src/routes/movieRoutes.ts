import { Router } from 'express';
import * as MovieController from '../controllers/movieController';
import * as MovieDetailController from '../controllers/movieDetailController';

const router = Router();

// GET /api/movies - Get all movies with filter and search
router.get('/', MovieController.getMovies);

// GET /api/movies/filter - Filter movies with filters
router.get('/filter', MovieController.filterMoviesHandler);

// GET /api/movies/detail/:slug - Get movie detail
router.get('/detail/:slug', MovieController.getMovieDetail);

// POST /api/movies/crawl - Trigger crawl job manually
router.post('/crawl', MovieController.triggerCrawl);

router.post('/crawl-detail', MovieDetailController.triggerDetailCrawl);

export default router;
