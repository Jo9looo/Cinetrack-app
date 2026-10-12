import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Bookmark, Check, ImageOff } from 'lucide-react';
import { MovieSummary } from '../types/movie';
import { useWatchlistContext } from '../context/WatchlistContext';
import { StatusBadge } from './StatusBadge';

interface MovieCardProps {
  movie: MovieSummary;
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  const { isWatchlisted, getWatchlistItemByTmdbId, addToWatchlist } = useWatchlistContext();

  const saved = isWatchlisted(movie.tmdbId);
  const savedItem = getWatchlistItemByTmdbId(movie.tmdbId);

  const releaseYear = movie.releaseDate ? movie.releaseDate.substring(0, 4) : 'N/A';

  const handleQuickAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (saved) return;

    await addToWatchlist({
      tmdbId: movie.tmdbId,
      title: movie.title,
      posterPath: movie.posterPath,
      releaseDate: movie.releaseDate,
      rating: movie.rating,
      status: 'Want to Watch',
    });
  };

  return (
    <div className="group relative flex flex-col rounded-xl overflow-hidden bg-slate-900 border border-slate-800 transition-all duration-300 hover:-translate-y-1.5 hover:border-rose-500/40 hover:shadow-xl hover:shadow-rose-950/20">
      <Link to={`/movie/${movie.tmdbId}`} className="block relative aspect-[2/3] w-full bg-slate-950 overflow-hidden">
        {movie.posterPath ? (
          <img
            src={movie.posterPath}
            alt={movie.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-600 p-4 text-center">
            <ImageOff className="w-10 h-10 mb-2 opacity-50" />
            <span className="text-xs">No Poster Available</span>
          </div>
        )}

        {/* Rating Badge */}
        {movie.rating > 0 && (
          <div className="absolute top-2.5 right-2.5 flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-amber-400 text-xs font-semibold shadow-md">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span>{movie.rating.toFixed(1)}</span>
          </div>
        )}

        {/* Watchlist status overlay badge if already watchlisted */}
        {saved && savedItem && (
          <div className="absolute top-2.5 left-2.5 shadow-md">
            <StatusBadge status={savedItem.status} size="sm" />
          </div>
        )}
      </Link>

      {/* Info Container */}
      <div className="p-3.5 flex flex-col flex-1 justify-between gap-3">
        <div>
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>{releaseYear}</span>
          </div>
          <Link
            to={`/movie/${movie.tmdbId}`}
            className="font-medium text-sm text-slate-100 hover:text-rose-400 line-clamp-1 transition-colors"
            title={movie.title}
          >
            {movie.title}
          </Link>
        </div>

        {/* Quick Action Button */}
        <button
          onClick={handleQuickAdd}
          disabled={saved}
          className={`w-full py-1.5 px-3 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
            saved
              ? 'bg-slate-800 text-emerald-400 cursor-default border border-emerald-500/20'
              : 'bg-slate-800/80 hover:bg-rose-600 text-slate-200 hover:text-white border border-slate-700/60 hover:border-rose-500 shadow-sm cursor-pointer'
          }`}
        >
          {saved ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>In Watchlist</span>
            </>
          ) : (
            <>
              <Bookmark className="w-3.5 h-3.5" />
              <span>Add to Watchlist</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
