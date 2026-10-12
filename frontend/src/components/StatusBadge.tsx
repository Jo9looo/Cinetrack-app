import React from 'react';
import { WatchlistStatus } from '../types/watchlist';
import { Bookmark, PlayCircle, CheckCircle2 } from 'lucide-react';

interface StatusBadgeProps {
  status: WatchlistStatus;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  if (status === 'Want to Watch') {
    return (
      <span className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 ${sizeClasses}`}>
        <Bookmark className="w-3 h-3" />
        Want to Watch
      </span>
    );
  }

  if (status === 'Watching') {
    return (
      <span className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 ${sizeClasses}`}>
        <PlayCircle className="w-3 h-3" />
        Watching
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 ${sizeClasses}`}>
      <CheckCircle2 className="w-3 h-3" />
      Watched
    </span>
  );
};
