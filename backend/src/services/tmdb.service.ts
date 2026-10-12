import axios from 'axios';
import { ENV } from '../config/env.js';
import { MovieSummary, MovieDetail, TMDBMovieRaw, TMDBMovieDetailRaw } from '../types/movie.js';
import { AppError } from '../middlewares/errorHandler.js';

class TMDBService {
  private client = axios.create({
    baseURL: ENV.TMDB.BASE_URL,
    timeout: 10000,
  });

  private checkApiKey() {
    if (!ENV.TMDB.API_KEY || ENV.TMDB.API_KEY === 'your_tmdb_api_key_here') {
      throw new AppError(
        'TMDB_API_KEY is not configured in backend/.env. Please obtain an API key from https://www.themoviedb.org/settings/api and add it to your .env file.',
        500
      );
    }
  }

  private transformSummary(movie: TMDBMovieRaw): MovieSummary {
    return {
      tmdbId: movie.id,
      title: movie.title || movie.original_title,
      overview: movie.overview || '',
      posterPath: movie.poster_path ? `${ENV.TMDB.IMAGE_BASE_URL}/w500${movie.poster_path}` : null,
      backdropPath: movie.backdrop_path ? `${ENV.TMDB.IMAGE_BASE_URL}/original${movie.backdrop_path}` : null,
      releaseDate: movie.release_date || '',
      rating: movie.vote_average ? Math.round(movie.vote_average * 10) / 10 : 0,
    };
  }

  private transformDetail(movie: TMDBMovieDetailRaw): MovieDetail {
    return {
      tmdbId: movie.id,
      title: movie.title,
      overview: movie.overview || '',
      posterPath: movie.poster_path ? `${ENV.TMDB.IMAGE_BASE_URL}/w500${movie.poster_path}` : null,
      backdropPath: movie.backdrop_path ? `${ENV.TMDB.IMAGE_BASE_URL}/original${movie.backdrop_path}` : null,
      releaseDate: movie.release_date || '',
      rating: movie.vote_average ? Math.round(movie.vote_average * 10) / 10 : 0,
      runtime: movie.runtime ?? null,
      genres: (movie.genres || []).map(g => g.name),
      tagline: movie.tagline || null,
      status: movie.status,
    };
  }

  /**
   * Retrieve popular movies from TMDB
   */
  async getPopular(page = 1): Promise<{ movies: MovieSummary[]; page: number; totalPages: number }> {
    this.checkApiKey();
    const response = await this.client.get('/movie/popular', {
      params: {
        api_key: ENV.TMDB.API_KEY,
        page,
        language: 'en-US',
      },
    });

    const results: TMDBMovieRaw[] = response.data.results || [];
    return {
      movies: results.map(m => this.transformSummary(m)),
      page: response.data.page,
      totalPages: response.data.total_pages,
    };
  }

  /**
   * Retrieve trending movies from TMDB
   */
  async getTrending(timeWindow: 'day' | 'week' = 'day'): Promise<{ movies: MovieSummary[] }> {
    this.checkApiKey();
    const response = await this.client.get(`/trending/movie/${timeWindow}`, {
      params: {
        api_key: ENV.TMDB.API_KEY,
        language: 'en-US',
      },
    });

    const results: TMDBMovieRaw[] = response.data.results || [];
    return {
      movies: results.map(m => this.transformSummary(m)),
    };
  }

  /**
   * Search for movies by title
   */
  async search(query: string, page = 1): Promise<{ movies: MovieSummary[]; page: number; totalPages: number; totalResults: number }> {
    this.checkApiKey();
    const response = await this.client.get('/search/movie', {
      params: {
        api_key: ENV.TMDB.API_KEY,
        query,
        page,
        language: 'en-US',
        include_adult: false,
      },
    });

    const results: TMDBMovieRaw[] = response.data.results || [];
    return {
      movies: results.map(m => this.transformSummary(m)),
      page: response.data.page,
      totalPages: response.data.total_pages,
      totalResults: response.data.total_results,
    };
  }

  /**
   * Retrieve detailed information for a single movie
   */
  async getDetails(tmdbId: number): Promise<MovieDetail> {
    this.checkApiKey();
    const response = await this.client.get(`/movie/${tmdbId}`, {
      params: {
        api_key: ENV.TMDB.API_KEY,
        language: 'en-US',
      },
    });

    return this.transformDetail(response.data);
  }
}

export const tmdbService = new TMDBService();
