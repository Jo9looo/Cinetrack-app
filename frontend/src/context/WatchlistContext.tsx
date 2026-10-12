import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { WatchlistItem, WatchlistStatus, CreateWatchlistDTO, WatchlistStats } from '../types/watchlist';
import { watchlistService } from '../services/watchlistService';

interface WatchlistContextType {
  watchlist: WatchlistItem[];
  stats: WatchlistStats;
  loading: boolean;
  error: string | null;
  refreshWatchlist: () => Promise<void>;
  addToWatchlist: (item: CreateWatchlistDTO) => Promise<boolean>;
  updateStatus: (id: number, status: WatchlistStatus) => Promise<boolean>;
  removeFromWatchlist: (id: number) => Promise<boolean>;
  isWatchlisted: (tmdbId: number) => boolean;
  getWatchlistItemByTmdbId: (tmdbId: number) => WatchlistItem | undefined;
}

const WatchlistContext = createContext<WatchlistContextType | undefined>(undefined);

export const WatchlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [stats, setStats] = useState<WatchlistStats>({ total: 0, wantToWatch: 0, watching: 0, watched: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshWatchlist = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [items, currentStats] = await Promise.all([
        watchlistService.getAll(),
        watchlistService.getStats(),
      ]);
      setWatchlist(items);
      setStats(currentStats);
    } catch (err: any) {
      console.error('Failed to fetch watchlist:', err);
      setError(err.response?.data?.message || 'Failed to load watchlist from server');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshWatchlist();
  }, [refreshWatchlist]);

  const addToWatchlist = async (item: CreateWatchlistDTO): Promise<boolean> => {
    try {
      await watchlistService.add(item);
      await refreshWatchlist();
      return true;
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to add movie to watchlist';
      alert(msg);
      return false;
    }
  };

  const updateStatus = async (id: number, status: WatchlistStatus): Promise<boolean> => {
    try {
      await watchlistService.updateStatus(id, status);
      await refreshWatchlist();
      return true;
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to update status';
      alert(msg);
      return false;
    }
  };

  const removeFromWatchlist = async (id: number): Promise<boolean> => {
    try {
      await watchlistService.remove(id);
      await refreshWatchlist();
      return true;
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to remove movie';
      alert(msg);
      return false;
    }
  };

  const isWatchlisted = (tmdbId: number): boolean => {
    return watchlist.some(item => item.tmdb_id === tmdbId);
  };

  const getWatchlistItemByTmdbId = (tmdbId: number): WatchlistItem | undefined => {
    return watchlist.find(item => item.tmdb_id === tmdbId);
  };

  return (
    <WatchlistContext.Provider
      value={{
        watchlist,
        stats,
        loading,
        error,
        refreshWatchlist,
        addToWatchlist,
        updateStatus,
        removeFromWatchlist,
        isWatchlisted,
        getWatchlistItemByTmdbId,
      }}
    >
      {children}
    </WatchlistContext.Provider>
  );
};

export function useWatchlistContext() {
  const context = useContext(WatchlistContext);
  if (!context) {
    throw new Error('useWatchlistContext must be used within a WatchlistProvider');
  }
  return context;
}
