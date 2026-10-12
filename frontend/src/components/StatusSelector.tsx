import React from 'react';
import { WatchlistStatus, WATCHLIST_STATUSES } from '../types/watchlist';

interface StatusSelectorProps {
  currentStatus: WatchlistStatus;
  onChange: (newStatus: WatchlistStatus) => void;
  disabled?: boolean;
}

export const StatusSelector: React.FC<StatusSelectorProps> = ({
  currentStatus,
  onChange,
  disabled = false,
}) => {
  return (
    <select
      value={currentStatus}
      onChange={(e) => onChange(e.target.value as WatchlistStatus)}
      disabled={disabled}
      className="bg-slate-900 border border-slate-700 text-slate-200 text-xs sm:text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-colors cursor-pointer disabled:opacity-50"
    >
      {WATCHLIST_STATUSES.map((status) => (
        <option key={status} value={status}>
          {status}
        </option>
      ))}
    </select>
  );
};
