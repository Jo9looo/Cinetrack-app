import { Router } from 'express';
import { movieRouter } from './movie.routes.js';
import { watchlistRouter } from './watchlist.routes.js';

export const apiRouter = Router();

// Health check endpoint
apiRouter.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'CineTrack API is online and healthy.',
    timestamp: new Date().toISOString(),
  });
});

// Mount resource routers
apiRouter.use('/movies', movieRouter);
apiRouter.use('/watchlist', watchlistRouter);
