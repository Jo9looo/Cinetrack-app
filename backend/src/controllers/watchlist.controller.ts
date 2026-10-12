import { Request, Response, NextFunction } from 'express';
import { watchlistService } from '../services/watchlist.service.js';
import { WatchlistStatus, WATCHLIST_STATUSES } from '../types/watchlist.js';
import { AppError } from '../middlewares/errorHandler.js';

export class WatchlistController {
  /**
   * GET /api/watchlist
   * Retrieve watchlist items, optionally filtered by ?status=
   */
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const statusQuery = req.query.status as string | undefined;
      let statusFilter: WatchlistStatus | undefined;

      if (statusQuery) {
        if (!WATCHLIST_STATUSES.includes(statusQuery as WatchlistStatus)) {
          throw new AppError(
            `Invalid status query parameter. Allowed values: ${WATCHLIST_STATUSES.join(', ')}`,
            400
          );
        }
        statusFilter = statusQuery as WatchlistStatus;
      }

      const items = await watchlistService.getAll(statusFilter);

      return res.status(200).json({
        success: true,
        message: 'Watchlist retrieved successfully',
        data: items,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/watchlist/stats
   * Retrieve live statistics grouped by status
   */
  async getStats(_req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await watchlistService.getStats();

      return res.status(200).json({
        success: true,
        message: 'Watchlist statistics retrieved successfully',
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/watchlist/check/:tmdbId
   * Quick check whether a movie is already in the watchlist
   */
  async checkByTmdbId(req: Request, res: Response, next: NextFunction) {
    try {
      const rawTmdbId = Array.isArray(req.params.tmdbId) ? req.params.tmdbId[0] : req.params.tmdbId;
      const tmdbId = parseInt(rawTmdbId as string, 10);
      if (isNaN(tmdbId) || tmdbId <= 0) {
        throw new AppError('Invalid TMDB movie ID', 400);
      }

      const item = await watchlistService.getByTmdbId(tmdbId);

      return res.status(200).json({
        success: true,
        data: {
          isWatchlisted: !!item,
          watchlistItem: item || null,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/watchlist
   * Add a movie to the watchlist
   */
  async add(req: Request, res: Response, next: NextFunction) {
    try {
      const { tmdbId, title, posterPath, releaseDate, rating, status } = req.body;

      const created = await watchlistService.add({
        tmdbId,
        title,
        posterPath,
        releaseDate,
        rating,
        status,
      });

      return res.status(201).json({
        success: true,
        message: `"${title}" has been added to your watchlist.`,
        data: created,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/watchlist/:id
   * Update viewing status of an existing movie
   */
  async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const id = parseInt(rawId as string, 10);
      if (isNaN(id) || id <= 0) {
        throw new AppError('Invalid watchlist item ID.', 400);
      }

      const { status } = req.body;
      if (!status || !WATCHLIST_STATUSES.includes(status)) {
        throw new AppError(
          `Invalid status. Status must be one of: ${WATCHLIST_STATUSES.join(', ')}`,
          400
        );
      }

      const updated = await watchlistService.updateStatus(id, status);

      return res.status(200).json({
        success: true,
        message: `Status updated to "${status}".`,
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/watchlist/:id
   * Remove a movie from the watchlist
   */
  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const id = parseInt(rawId as string, 10);
      if (isNaN(id) || id <= 0) {
        throw new AppError('Invalid watchlist item ID.', 400);
      }

      await watchlistService.remove(id);

      return res.status(200).json({
        success: true,
        message: 'Movie removed from watchlist.',
      });
    } catch (error) {
      next(error);
    }
  }
}

export const watchlistController = new WatchlistController();
