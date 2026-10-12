import React from 'react';
import { WatchlistStats } from '../types/watchlist';
import { Film, Bookmark, PlayCircle, CheckCircle2 } from 'lucide-react';

interface StatsCardProps {
  stats: WatchlistStats;
}

export const StatsCard: React.FC<StatsCardProps> = ({ stats }) => {
  const items = [
    {
      label: 'Total Movies',
      value: stats.total,
      icon: Film,
      color: 'text-rose-400',
      bgColor: 'bg-rose-500/10',
      borderColor: 'border-rose-500/20',
    },
    {
      label: 'Want to Watch',
      value: stats.wantToWatch,
      icon: Bookmark,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20',
    },
    {
      label: 'Watching',
      value: stats.watching,
      icon: PlayCircle,
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/20',
    },
    {
      label: 'Watched',
      value: stats.watched,
      icon: CheckCircle2,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/20',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-8">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.label}
            className={`p-4 rounded-xl bg-slate-900/80 border ${item.borderColor} backdrop-blur-sm transition-all hover:border-slate-600 flex items-center justify-between shadow-lg shadow-black/20`}
          >
            <div>
              <p className="text-xs sm:text-sm font-medium text-slate-400">{item.label}</p>
              <p className="text-2xl sm:text-3xl font-bold tracking-tight text-white mt-1">
                {item.value}
              </p>
            </div>
            <div className={`p-2.5 sm:p-3 rounded-lg ${item.bgColor}`}>
              <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${item.color}`} />
            </div>
          </div>
        );
      })}
    </div>
  );
};
