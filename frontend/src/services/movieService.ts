import apiClient from './apiClient';
import { ApiResponse } from '../types/api';
import { MovieListResponse, MovieDetail } from '../types/movie';

export const movieService = {
  /**
   * Fetch popular movies from the backend
   */
  async getPopular(page = 1): Promise<MovieListResponse> {
    const response = await apiClient.get<ApiResponse<MovieListResponse>>('/movies/popular', {
      params: { page },
    });
    return response.data.data!;
  },

  /**
   * Fetch trending movies from the backend
   */
  async getTrending(): Promise<MovieListResponse> {
    const response = await apiClient.get<ApiResponse<MovieListResponse>>('/movies/trending');
    return response.data.data!;
  },

  /**
   * Search movies by title
   */
  async search(query: string, page = 1): Promise<MovieListResponse> {
    const response = await apiClient.get<ApiResponse<MovieListResponse>>('/movies/search', {
      params: { q: query, page },
    });
    return response.data.data!;
  },

  /**
   * Fetch details of a single movie by TMDB ID
   */
  async getDetails(tmdbId: number): Promise<MovieDetail> {
    const response = await apiClient.get<ApiResponse<MovieDetail>>(`/movies/${tmdbId}`);
    return response.data.data!;
  },
};
