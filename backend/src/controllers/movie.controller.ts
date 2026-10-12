import { Request, Response, NextFunction } from 'express';
import { tmdbService } from '../services/tmdb.service.js';
import { AppError } from '../middlewares/errorHandler.js';

export class MovieController {
  /**
   * GET /api/movies/popular
   * Retrieve popular movies from TMDB
   */
  async getPopular(req: Request, res: Response, next: NextFunction) {
    try {
      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const data = await tmdbService.getPopular(page);

      return res.status(200).json({
        success: true,
        message: 'Popular movies retrieved successfully',
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/movies/trending
   * Retrieve daily trending movies from TMDB
   */
  async getTrending(_req: Request, res: Response, next: NextFunction) {
    try {
      const data = await tmdbService.getTrending('day');

      return res.status(200).json({
        success: true,
        message: 'Trending movies retrieved successfully',
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/movies/search?q=title
   * Search movies by title with validation
   */
  async search(req: Request, res: Response, next: NextFunction) {
    try {
      const query = (req.query.q as string)?.trim();
      if (!query) {
        throw new AppError('Query parameter "q" is required for movie search.', 400);
      }

      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const data = await tmdbService.search(query, page);

      return res.status(200).json({
        success: true,
        message: `Search results for "${query}"`,
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/movies/:tmdbId
   * Retrieve full details of a specific movie
   */
  async getDetails(req: Request, res: Response, next: NextFunction) {
    try {
      const rawId = Array.isArray(req.params.tmdbId) ? req.params.tmdbId[0] : req.params.tmdbId;
      const tmdbId = parseInt(rawId as string, 10);
      if (isNaN(tmdbId) || tmdbId <= 0) {
        throw new AppError('Invalid movie ID parameter. Must be a positive integer.', 400);
      }

      const data = await tmdbService.getDetails(tmdbId);

      return res.status(200).json({
        success: true,
        message: 'Movie details retrieved successfully',
        data,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const movieController = new MovieController();
