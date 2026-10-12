import React, { useState, useEffect } from 'react';
import { Flame, Sparkles } from 'lucide-react';
import { MovieSummary } from '../types/movie';
import { movieService } from '../services/movieService';
import { MovieCard } from '../components/MovieCard';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { ErrorMessage } from '../components/ErrorMessage';

export const DiscoverPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'trending' | 'popular'>('trending');
  const [movies, setMovies] = useState<MovieSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      setError(null);
      if (activeTab === 'trending') {
        const response = await movieService.getTrending();
        setMovies(response.movies);
      } else {
        const response = await movieService.getPopular(1);
        setMovies(response.movies);
      }
    } catch (err: any) {
      console.error('Error fetching movies:', err);
      const message =
        err.response?.data?.message ||
        'Unable to connect to the backend server. Please verify the backend is running at http://localhost:5000.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, [activeTab]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Hero Header */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-rose-950/40 via-slate-900 to-slate-900/40 border border-rose-500/20 p-6 sm:p-10 shadow-2xl">
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            Discover & Curate Your Cinema Journey
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
            Track Every Movie You Love.
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Explore daily trending titles, search through millions of films, and seamlessly organize your personal watchlist with live database sync.
          </p>
        </div>
      </div>

      {/* Tabs / Filters */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('trending')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'trending'
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-950/50'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Flame className="w-4 h-4" />
            Trending Today
          </button>
          <button
            onClick={() => setActiveTab('popular')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'popular'
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-950/50'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            Popular
          </button>
        </div>

        <span className="text-xs text-slate-500 hidden sm:inline-block">
          Powered by TMDB API via Express Backend
        </span>
      </div>

      {/* Movie Content */}
      {loading ? (
        <LoadingSkeleton count={10} />
      ) : error ? (
        <ErrorMessage message={error} onRetry={fetchMovies} />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
          {movies.map((movie) => (
            <MovieCard key={movie.tmdbId} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
};
