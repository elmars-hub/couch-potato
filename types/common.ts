export interface TMDBResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export interface SearchResult {
  id: number;
  title?: string;
  name?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  media_type: "movie" | "tv" | "person";
  popularity: number;
  vote_average?: number;
  vote_count?: number;
  release_date?: string;
  first_air_date?: string;
  adult: boolean;
  original_language: string;
  original_title?: string;
  original_name?: string;
  origin_country?: string[];
  genre_ids: number[];
}

export interface Genre {
  id: number;
  name: string;
}

export interface Category {
  id: string;
  name: string;
  type: "movie" | "tv";
}

export interface User {
  id: string;
  email: string;
  name: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface WatchlistItem {
  id: string;
  userId: string;
  mediaId: number;
  mediaType: "movie" | "tv";
  createdAt: Date;
}

export interface FavoriteItem {
  id: string;
  userId: string;
  mediaId: number;
  mediaType: "movie" | "tv";
  createdAt: Date;
}
