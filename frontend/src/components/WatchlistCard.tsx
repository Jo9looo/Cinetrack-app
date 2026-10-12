import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Star, Calendar, ImageOff } from 'lucide-react';
import { WatchlistItem, WatchlistStatus } from '../types/watchlist';
import { StatusSelector } from './StatusSelector';

interface WatchlistCardProps {
  item: WatchlistItem;
  onUpdateStatus: (id: number, status: WatchlistStatus) => Promise<boolean>;
  onRemove: (id: number) => Promise<boolean>;
}

export const WatchlistCard: React.FC<WatchlistCardProps> = ({
  item,
  onUpdateStatus,
  onRemove,
}) => {
  const [updating, setUpdating] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleStatusChange = async (newStatus: WatchlistStatus) => {
    if (newStatus === item.status || updating) return;
    try {
      setUpdating(true);
      await onUpdateStatus(item.id, newStatus);
    } finally {
      setUpdating(false);
    }
  };

  const handleRemove = async () => {
    if (removing) return;
    try {
      setRemoving(true);
      await onRemove(item.id);
    } finally {
      setRemoving(false);
      setConfirmDelete(false);
    }
  };

  const releaseYear = item.release_date ? item.release_date.substring(0, 4) : 'N/A';

  return (
    <div className="flex flex-col sm:flex-row gap-4 p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all duration-200 shadow-md">
      {/* Poster */}
      <Link
        to={`/movie/${item.tmdb_id}`}
        className="w-full sm:w-28 sm:h-40 aspect-[2/3] sm:aspect-auto rounded-lg overflow-hidden bg-slate-950 flex-shrink-0 group relative block"
      >
        {item.poster_path ? (
          <img
            src={item.poster_path}
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-600 p-2 text-center">
            <ImageOff className="w-6 h-6 mb-1 opacity-50" />
            <span className="text-[10px]">No Poster</span>
          </div>
        )}
      </Link>

      {/* Content & Actions */}
      <div className="flex flex-col justify-between flex-1 gap-3">
        <div>
          <div className="flex items-start justify-between gap-2">
            <Link
              to={`/movie/${item.tmdb_id}`}
              className="text-base sm:text-lg font-semibold text-white hover:text-rose-400 transition-colors line-clamp-1"
            >
              {item.title}
            </Link>

            {confirmDelete ? (
              <div className="flex items-center gap-1.5 bg-rose-950/60 border border-rose-500/30 rounded-lg p-1 text-xs">
                <button
                  onClick={handleRemove}
                  disabled={removing}
                  className="px-2 py-0.5 rounded bg-rose-600 hover:bg-rose-500 text-white font-medium transition-colors cursor-pointer"
                >
                  {removing ? '...' : 'Remove'}
                </button>
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="px-2 py-0.5 rounded text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmDelete(true)}
                className="text-slate-500 hover:text-rose-400 p-1.5 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                title="Remove from watchlist"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-1">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              {releaseYear}
            </span>
            {item.rating && Number(item.rating) > 0 && (
              <span className="flex items-center gap-1 text-amber-400 font-medium">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                {Number(item.rating).toFixed(1)}
              </span>
            )}
            <span className="text-slate-500">
              Added: {new Date(item.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Status Selector Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800/80">
          <span className="text-xs text-slate-400 font-medium">Viewing Status:</span>
          <StatusSelector
            currentStatus={item.status}
            onChange={handleStatusChange}
            disabled={updating}
          />
        </div>
      </div>
    </div>
  );
};
