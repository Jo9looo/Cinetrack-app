import { Request, Response, NextFunction } from 'express';
import axios from 'axios';
import { ENV } from '../config/env.js';

export class AppError extends Error {
  public statusCode: number;

  constructor(message: string, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

/**
 * Centralized error-handling middleware for Express.
 * Converts internal, database, and external API errors into consistent JSON responses.
 */
export function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  console.error('[Error Details]:', err.message || err);

  // 1. Handled Application Errors
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  // 2. MySQL / MariaDB specific errors
  if (err.code) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({
        success: false,
        message: 'This movie is already in your watchlist.',
      });
    }

    if (
      err.code === 'ECONNREFUSED' ||
      err.code === 'ER_ACCESS_DENIED_ERROR' ||
      err.code === 'ER_BAD_DB_ERROR' ||
      err.code === 'PROTOCOL_CONNECTION_LOST'
    ) {
      return res.status(503).json({
        success: false,
        message: 'Database connection failed. Please ensure MySQL/MariaDB is running and cinetrack_db is created.',
      });
    }
  }

  // 3. TMDB Axios HTTP errors
  if (axios.isAxiosError(err)) {
    if (err.response?.status === 401) {
      return res.status(500).json({
        success: false,
        message: 'Invalid or missing TMDB API key. Please check TMDB_API_KEY in backend/.env',
      });
    }
    if (err.response?.status === 404) {
      return res.status(404).json({
        success: false,
        message: 'Requested movie was not found on TMDB.',
      });
    }
    return res.status(err.response?.status || 502).json({
      success: false,
      message: err.response?.data?.status_message || 'External TMDB API request failed.',
    });
  }

  // 4. Default Internal Server Error
  return res.status(500).json({
    success: false,
    message: ENV.NODE_ENV === 'production' ? 'An unexpected internal server error occurred.' : (err.message || 'Internal server error'),
  });
}
