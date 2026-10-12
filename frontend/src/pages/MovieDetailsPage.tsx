import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Star,
  Clock,
  Calendar,
  Bookmark,
  Check,
  Tag,
  ImageOff,
} from 'lucide-react';
import { MovieDetail } from '../types/movie';
import { movieService } from '../services/movieService';
import { useWatchlistContext } from '../context/WatchlistContext';
import { StatusBadge } from '../components/StatusBadge';
import { StatusSelector } from '../components/StatusSelector';
import { ErrorMessage } from '../components/ErrorMessage';

export const MovieDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const tmdbId = parseInt(id || '', 10);

  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {
    isWatchlisted,
    getWatchlistItemByTmdbId,
    addToWatchlist,
    updateStatus,
  } = useWatchlistContext();

  const saved = isWatchlisted(tmdbId);
  const watchlistItem = getWatchlistItemByTmdbId(tmdbId);

  useEffect(() => {
    const fetchMovie = async () => {
      if (isNaN(tmdbId) || tmdbId <= 0) {
        setError('Invalid movie identifier.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await movieService.getDetails(tmdbId);
        setMovie(data);
      } catch (err: any) {
        console.error('Failed to fetch movie details:', err);
        setError(err.response?.data?.message || 'Failed to load movie details from server.');
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [tmdbId]);

  const handleAdd = async () => {
    if (!movie || saved) return;
    await addToWatchlist({
      tmdbId: movie.tmdbId,
      title: movie.title,
      posterPath: movie.posterPath,
      releaseDate: movie.releaseDate,
      rating: movie.rating,
      status: 'Want to Watch',
    });
  };

  const formatRuntime = (minutes: number | null): string => {
    if (!minutes || minutes <= 0) return 'Runtime unavailable';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m (${minutes} mins)` : `${mins} mins`;
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex justify-center items-center min-h-[50vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-rose-500/20 border-t-rose-500 rounded-full animate-spin" />
          <p className="text-slate-400 text-sm">Loading movie details...</p>
        </div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <ErrorMessage message={error || 'Movie not found.'} onRetry={() => window.location.reload()} />
      </div>
    );
  }

  return (
    <div className="relative pb-16">
      {/* Backdrop Image Banner */}
      <div className="relative w-full h-72 sm:h-96 lg:h-[450px] overflow-hidden bg-slate-950">
        {movie.backdropPath ? (
          <img
            src={movie.backdropPath}
            alt={movie.title}
            className="w-full h-full object-cover opacity-25 filter blur-xs"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-b from-rose-950/20 to-slate-950" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent" />
      </div>

      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-52 sm:-mt-64 relative z-10">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-slate-900/80 border border-slate-700/80 text-slate-300 hover:text-white hover:bg-slate-800 transition-all text-xs font-semibold mb-6 backdrop-blur-md cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {/* Poster Column */}
          <div className="md:col-span-1">
            <div className="rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl aspect-[2/3] relative">
              {movie.posterPath ? (
                <img
                  src={movie.posterPath}
                  alt={movie.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-600 p-4 text-center">
                  <ImageOff className="w-12 h-12 mb-2 opacity-50" />
                  <span className="text-sm">No Poster Available</span>
                </div>
              )}
            </div>
          </div>

          {/* Details Column */}
          <div className="md:col-span-2 lg:col-span-3 space-y-6">
            <div>
              {movie.tagline && (
                <p className="text-rose-400 font-medium italic text-sm mb-2">
                  "{movie.tagline}"
                </p>
              )}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
                {movie.title}
              </h1>

              {/* Metadata Badges */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-300 mt-4">
                {movie.rating > 0 && (
                  <div className="flex items-center gap-1.5 text-amber-400 font-bold bg-amber-400/10 border border-amber-400/20 px-2.5 py-1 rounded-lg">
                    <Star className="w-4 h-4 fill-amber-400" />
                    <span>{movie.rating.toFixed(1)} / 10</span>
                  </div>
                )}

                {movie.releaseDate && (
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <Calendar className="w-4 h-4 text-slate-500" />
                    <span>{movie.releaseDate}</span>
                  </div>
                )}

                {movie.runtime && (
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <Clock className="w-4 h-4 text-slate-500" />
                    <span>{formatRuntime(movie.runtime)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Genres */}
            {movie.genres.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <Tag className="w-4 h-4 text-slate-500 mr-1" />
                {movie.genres.map((genre) => (
                  <span
                    key={genre}
                    className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-medium border border-slate-700/60"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            )}

            {/* Synopsis / Overview */}
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-white">Overview</h2>
              <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
                {movie.overview || 'No synopsis available for this movie.'}
              </p>
            </div>

            {/* Watchlist Actions */}
            <div className="pt-6 border-t border-slate-800/80">
              {saved && watchlistItem ? (
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                      <Check className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Current Status</p>
                      <StatusBadge status={watchlistItem.status} />
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-400">Change Status:</span>
                    <StatusSelector
                      currentStatus={watchlistItem.status}
                      onChange={(newStatus) => updateStatus(watchlistItem.id, newStatus)}
                    />
                  </div>
                </div>
              ) : (
                <button
                  onClick={handleAdd}
                  className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white font-semibold text-sm shadow-xl shadow-rose-950/40 flex items-center gap-2.5 transition-all cursor-pointer hover:scale-[1.02]"
                >
                  <Bookmark className="w-5 h-5" />
                  <span>Add to My Watchlist</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
