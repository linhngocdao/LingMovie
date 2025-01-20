import { Router } from 'express';
import * as MovieController from '../controllers/movieController';

const router = Router();

// GET /api/movies - Get all movies with filter and search
router.get('/', MovieController.getMovies);

// GET /api/movies/filter - Filter movies with filters
router.get('/filter', MovieController.filterMovies);

// GET /api/movies/:slug - Get movie detail
router.get('/:slug', MovieController.getMovieDetail);

// POST /api/movies/crawl - Trigger crawl job manually
router.post('/crawl', MovieController.triggerCrawl);

export default router;
