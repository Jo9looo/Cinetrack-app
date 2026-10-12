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

export interface MovieListResponse {
  movies: MovieSummary[];
  page?: number;
  totalPages?: number;
  totalResults?: number;
}
