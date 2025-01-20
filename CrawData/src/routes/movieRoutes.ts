import { Router, Request, Response } from 'express';
import MovieController from '../controllers/movieController';
// import MovieCrawlerJob from '../cron/movieCrawlerJob';

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

// POST /api/movies/crawl - Trigger crawl job manually
// router.post('/crawl', async (req: Request, res: Response) => {
//   try {
//     await MovieCrawlerJob.runManually();
//     res.status(200).json({
//       status: true,
//       message: 'Crawl job triggered successfully'
//     });
//   } catch (error) {
//     res.status(500).json({
//       status: false,
//       message: 'Failed to trigger crawl job'
//     });
//   }
// });

export default router;
