import React, { useState } from 'react';
import { Bookmark, RefreshCw } from 'lucide-react';
import { WatchlistStatus } from '../types/watchlist';
import { useWatchlistContext } from '../context/WatchlistContext';
import { StatsCard } from '../components/StatsCard';
import { WatchlistCard } from '../components/WatchlistCard';
import { EmptyState } from '../components/EmptyState';
import { ErrorMessage } from '../components/ErrorMessage';

export const WatchlistPage: React.FC = () => {
  const {
    watchlist,
    stats,
    loading,
    error,
    refreshWatchlist,
    updateStatus,
    removeFromWatchlist,
  } = useWatchlistContext();

  const [filter, setFilter] = useState<'All' | WatchlistStatus>('All');

  const filteredMovies = watchlist.filter((item) => {
    if (filter === 'All') return true;
    return item.status === filter;
  });

  const filterTabs: Array<'All' | WatchlistStatus> = [
    'All',
    'Want to Watch',
    'Watching',
    'Watched',
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">My Watchlist</h1>
          <p className="text-slate-400 text-sm mt-1">
            Track and organize your personal movie collection stored directly in MySQL.
          </p>
        </div>

        <button
          onClick={refreshWatchlist}
          disabled={loading}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700/80 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition-colors self-start sm:self-auto cursor-pointer"
          title="Refresh watchlist from database"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-rose-500' : ''}`} />
          <span>Refresh Database</span>
        </button>
      </div>

      {/* Live Statistics Section */}
      <StatsCard stats={stats} />

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-4 overflow-x-auto">
        {filterTabs.map((tab) => {
          const isActive = filter === tab;
          let count = stats.total;
          if (tab === 'Want to Watch') count = stats.wantToWatch;
          else if (tab === 'Watching') count = stats.watching;
          else if (tab === 'Watched') count = stats.watched;

          return (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-rose-600 text-white shadow-lg shadow-rose-950/40'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <span>{tab}</span>
              <span
                className={`px-1.5 py-0.5 rounded-full text-xs ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Watchlist Items */}
      {loading && watchlist.length === 0 ? (
        <div className="py-12 flex justify-center items-center">
          <div className="w-8 h-8 border-4 border-rose-500/20 border-t-rose-500 rounded-full animate-spin" />
        </div>
      ) : error ? (
        <ErrorMessage message={error} onRetry={refreshWatchlist} />
      ) : filteredMovies.length === 0 ? (
        <EmptyState
          title={
            filter === 'All'
              ? 'Your Watchlist is Empty'
              : `No movies marked as "${filter}"`
          }
          description={
            filter === 'All'
              ? 'Browse movies in the Discover page or search for your favorite films to start building your watchlist.'
              : `You don't have any movies in your watchlist with "${filter}" status right now.`
          }
          icon={Bookmark}
          actionText={filter === 'All' ? 'Discover Movies' : undefined}
          actionLink={filter === 'All' ? '/' : undefined}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredMovies.map((item) => (
            <WatchlistCard
              key={item.id}
              item={item}
              onUpdateStatus={updateStatus}
              onRemove={removeFromWatchlist}
            />
          ))}
        </div>
      )}
    </div>
  );
};
