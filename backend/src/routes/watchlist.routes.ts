import { Router } from 'express';
import { watchlistController } from '../controllers/watchlist.controller.js';
import { validateBody } from '../middlewares/validateRequest.js';
import { createWatchlistSchema, updateWatchlistSchema } from '../validators/watchlist.validator.js';

export const watchlistRouter = Router();

// Retrieve all watchlist movies (supports ?status= filter)
watchlistRouter.get('/', (req, res, next) => watchlistController.getAll(req, res, next));

// Retrieve aggregated watchlist statistics
watchlistRouter.get('/stats', (req, res, next) => watchlistController.getStats(req, res, next));

// Check if a specific TMDB movie is already saved
watchlistRouter.get('/check/:tmdbId', (req, res, next) => watchlistController.checkByTmdbId(req, res, next));

// Add a new movie to watchlist
watchlistRouter.post('/', validateBody(createWatchlistSchema), (req, res, next) =>
  watchlistController.add(req, res, next)
);

// Update status of a watchlist movie
watchlistRouter.patch('/:id', validateBody(updateWatchlistSchema), (req, res, next) =>
  watchlistController.updateStatus(req, res, next)
);

// Remove a movie from watchlist
watchlistRouter.delete('/:id', (req, res, next) =>
  watchlistController.remove(req, res, next)
);
