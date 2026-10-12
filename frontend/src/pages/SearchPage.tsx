import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search as SearchIcon, Film } from 'lucide-react';
import { MovieSummary } from '../types/movie';
import { movieService } from '../services/movieService';
import { useDebounce } from '../hooks/useDebounce';
import { SearchBar } from '../components/SearchBar';
import { MovieCard } from '../components/MovieCard';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { ErrorMessage } from '../components/ErrorMessage';
import { EmptyState } from '../components/EmptyState';

export const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
  const debouncedQuery = useDebounce(query, 400);

  const [results, setResults] = useState<MovieSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    // Keep URL in sync with user's search
    if (debouncedQuery.trim()) {
      setSearchParams({ q: debouncedQuery });
    } else {
      setSearchParams({});
    }

    const performSearch = async () => {
      const trimmed = debouncedQuery.trim();
      if (!trimmed) {
        setResults([]);
        setHasSearched(false);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        setHasSearched(true);
        const data = await movieService.search(trimmed);
        setResults(data.movies);
      } catch (err: any) {
        console.error('Search error:', err);
        setError(err.response?.data?.message || 'Failed to search movies. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    performSearch();
  }, [debouncedQuery, setSearchParams]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Search Header */}
      <div className="text-center space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Search Movies</h1>
        <p className="text-slate-400 text-sm max-w-lg mx-auto">
          Type a movie title to search across the extensive TMDB library via our backend API.
        </p>
      </div>

      {/* Search Input Bar */}
      <SearchBar
        value={query}
        onChange={setQuery}
        placeholder="Search for movies (e.g. Oppenheimer, Interstellar, Spider-Man)..."
      />

      {/* Results Section */}
      <div>
        {loading ? (
          <div className="space-y-4">
            <p className="text-xs text-slate-400 flex items-center gap-2">
              <SearchIcon className="w-3.5 h-3.5 animate-spin text-rose-500" />
              Searching for "{debouncedQuery}"...
            </p>
            <LoadingSkeleton count={10} />
          </div>
        ) : error ? (
          <ErrorMessage message={error} onRetry={() => setQuery(query)} />
        ) : hasSearched && results.length === 0 ? (
          <EmptyState
            title={`No results found for "${debouncedQuery}"`}
            description="Try checking for typos or searching for a different movie title."
            icon={Film}
          />
        ) : results.length > 0 ? (
          <div className="space-y-4">
            <p className="text-xs text-slate-400">
              Found <span className="font-semibold text-rose-400">{results.length}</span> results for "{debouncedQuery}"
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
              {results.map((movie) => (
                <MovieCard key={movie.tmdbId} movie={movie} />
              ))}
            </div>
          </div>
        ) : (
          <EmptyState
            title="Start Searching"
            description="Enter a movie title in the search box above to find movies and add them to your watchlist."
            icon={SearchIcon}
          />
        )}
      </div>
    </div>
  );
};
