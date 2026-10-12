import apiClient from './apiClient';
import { ApiResponse } from '../types/api';
import {
  WatchlistItem,
  WatchlistStatus,
  CreateWatchlistDTO,
  WatchlistStats,
} from '../types/watchlist';

export const watchlistService = {
  /**
   * Fetch all movies from watchlist, optionally filtered by status
   */
  async getAll(status?: WatchlistStatus): Promise<WatchlistItem[]> {
    const response = await apiClient.get<ApiResponse<WatchlistItem[]>>('/watchlist', {
      params: status ? { status } : {},
    });
    return response.data.data || [];
  },

  /**
   * Fetch watchlist aggregated statistics
   */
  async getStats(): Promise<WatchlistStats> {
    const response = await apiClient.get<ApiResponse<WatchlistStats>>('/watchlist/stats');
    return response.data.data || { total: 0, wantToWatch: 0, watching: 0, watched: 0 };
  },

  /**
   * Check if a TMDB movie is in the watchlist
   */
  async check(tmdbId: number): Promise<{ isWatchlisted: boolean; watchlistItem: WatchlistItem | null }> {
    const response = await apiClient.get<ApiResponse<{ isWatchlisted: boolean; watchlistItem: WatchlistItem | null }>>(
      `/watchlist/check/${tmdbId}`
    );
    return response.data.data || { isWatchlisted: false, watchlistItem: null };
  },

  /**
   * Add a movie to the watchlist
   */
  async add(item: CreateWatchlistDTO): Promise<WatchlistItem> {
    const response = await apiClient.post<ApiResponse<WatchlistItem>>('/watchlist', item);
    return response.data.data!;
  },

  /**
   * Update the status of a watchlist movie
   */
  async updateStatus(id: number, status: WatchlistStatus): Promise<WatchlistItem> {
    const response = await apiClient.patch<ApiResponse<WatchlistItem>>(`/watchlist/${id}`, { status });
    return response.data.data!;
  },

  /**
   * Remove a movie from the watchlist
   */
  async remove(id: number): Promise<void> {
    await apiClient.delete<ApiResponse<void>>(`/watchlist/${id}`);
  },
};
