/**
 * Raw movie item structure returned by TMDB list endpoints.
 */
export interface TMDBMovieRaw {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  genre_ids?: number[];
}

/**
 * Detailed movie structure returned by TMDB movie details endpoint.
 */
export interface TMDBMovieDetailRaw {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  runtime: number | null;
  genres: Array<{ id: number; name: string }>;
  tagline?: string;
  status: string;
  homepage?: string;
}

/**
 * Cleaned and standardized movie object sent to frontend clients.
 */
export interface MovieSummary {
  tmdbId: number;
  title: string;
  overview: string;
  posterPath: string | null;
  backdropPath: string | null;
  releaseDate: string;
  rating: number;
}

export interface MovieDetail extends MovieSummary {
  runtime: number | null;
  genres: string[];
  tagline: string | null;
  status: string;
}
