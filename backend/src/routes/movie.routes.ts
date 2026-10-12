import { Router } from 'express';
import { movieController } from '../controllers/movie.controller.js';

export const movieRouter = Router();

// Retrieve popular movies from TMDB
movieRouter.get('/popular', (req, res, next) => movieController.getPopular(req, res, next));

// Retrieve daily trending movies from TMDB
movieRouter.get('/trending', (req, res, next) => movieController.getTrending(req, res, next));

// Search movies by title with ?q=title
movieRouter.get('/search', (req, res, next) => movieController.search(req, res, next));

// Retrieve detailed movie info by TMDB ID
movieRouter.get('/:tmdbId', (req, res, next) => movieController.getDetails(req, res, next));
