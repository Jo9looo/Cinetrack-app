import { useState, useEffect } from 'react';

/**
 * Custom hook to debounce any value (e.g., search text) by a specified delay.
 * Prevents flooding the backend and TMDB API with requests on every keystroke.
 */
export function useDebounce<T>(value: T, delay = 400): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
