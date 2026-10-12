export type WatchlistStatus = 'Want to Watch' | 'Watching' | 'Watched';

export const WATCHLIST_STATUSES: WatchlistStatus[] = [
  'Want to Watch',
  'Watching',
  'Watched',
];

export interface WatchlistItem {
  id: number;
  tmdb_id: number;
  title: string;
  poster_path: string | null;
  release_date: string | null;
  rating: number | null;
  status: WatchlistStatus;
  created_at: string;
  updated_at: string;
}

export interface CreateWatchlistDTO {
  tmdbId: number;
  title: string;
  posterPath?: string | null;
  releaseDate?: string | null;
  rating?: number | null;
  status?: WatchlistStatus;
}

export interface WatchlistStats {
  total: number;
  wantToWatch: number;
  watching: number;
  watched: number;
}
