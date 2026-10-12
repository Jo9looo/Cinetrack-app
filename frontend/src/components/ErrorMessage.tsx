import React from 'react';
import { AlertCircle, RefreshCw, Key } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => {
  const isKeyError = message.toLowerCase().includes('tmdb_api_key') || message.toLowerCase().includes('tmdb api key');

  return (
    <div className="p-6 max-w-2xl mx-auto rounded-xl bg-rose-950/30 border border-rose-500/30 text-slate-200 shadow-xl my-6">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400 flex-shrink-0">
          <AlertCircle className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-rose-300 text-base mb-1">
            {isKeyError ? 'TMDB API Configuration Required' : 'Failed to Load Movies'}
          </h3>
          <p className="text-sm text-slate-300 mb-3">{message}</p>

          {isKeyError && (
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 mb-4 space-y-1.5 font-mono">
              <div className="flex items-center gap-1.5 text-amber-400 font-semibold mb-1">
                <Key className="w-3.5 h-3.5" />
                <span>How to configure your TMDB API Key:</span>
              </div>
              <p>1. Get a free API key at <a href="https://www.themoviedb.org/settings/api" target="_blank" rel="noreferrer" className="text-rose-400 underline">themoviedb.org</a></p>
              <p>2. Open <code className="text-rose-300">cinetrack/backend/.env</code></p>
              <p>3. Set <code className="text-rose-300">TMDB_API_KEY=your_actual_key</code></p>
              <p>4. Save the file (the server reloads automatically)</p>
            </div>
          )}

          {onRetry && (
            <button
              onClick={onRetry}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Try Again
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
