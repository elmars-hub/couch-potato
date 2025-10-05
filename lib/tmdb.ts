/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";

export interface Movie {
  id: number;
  title: string;
  overview: string;
  backdrop_path: string | null;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
  genre_ids: number[];
}

export interface TMDBResponse {
  results: Movie[];
  page: number;
  total_pages: number;
  total_results: number;
}

const baseUrl = "https://api.themoviedb.org/3";
const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const imageBase = process.env.NEXT_PUBLIC_TMDB_IMAGE_BASE;

// Core fetch function
async function fetchTMDB(endpoint: string, params: Record<string, any> = {}) {
  try {
    const { data } = await axios.get(`${baseUrl}${endpoint}`, {
      params: { api_key: apiKey, ...params },
    });
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.message);
    }
    throw new Error("Failed to fetch data");
  }
}

export function getImageUrl(
  path: string | null,
  size: "w500" | "w780" | "original" = "original"
) {
  if (!path) return "/placeholder.jpg";
  return `https://image.tmdb.org/t/p/${size}${
    path.startsWith("/") ? path : `/${path}`
  }`;
}

// Movies
export async function getTrendingMovies() {
  return fetchTMDB("/trending/movie/week");
}

export async function getNowPlayingMovies(page = 1) {
  return fetchTMDB(`/movie/now_playing?page=${page}`);
}

export async function getPopularMovies(page = 1) {
  return fetchTMDB("/movie/popular", { page });
}

export async function getMovieDetails(id: number) {
  return fetchTMDB(`/movie/${id}`, {
    append_to_response: "credits,videos,similar",
  });
}

// TV Shows
export async function getPopularTVShows(page = 1) {
  return fetchTMDB("/tv/popular", { page });
}

export async function getTVShowDetails(id: number) {
  return fetchTMDB(`/tv/${id}`, {
    append_to_response: "credits,videos,similar",
  });
}

export async function getTrendingTVShows() {
  return fetchTMDB("/trending/tv/week");
}

// Search
export async function searchMulti(query: string, page = 1) {
  return fetchTMDB("/search/multi", {
    query,
    page,
  });
}

// Discover
export async function discoverMovies(params: {
  page?: number;
  genre?: string;
  year?: string;
  sort?: string;
}) {
  const { page = 1, genre, year, sort = "popularity.desc" } = params;
  const queryParams: Record<string, any> = { page, sort_by: sort };

  if (genre) queryParams.with_genres = genre;
  if (year) queryParams.primary_release_year = year;

  return fetchTMDB("/discover/movie", queryParams);
}

// Genres
export async function getGenres(type: "movie" | "tv") {
  return fetchTMDB(`/genre/${type}/list`);
}

// Movies & TV Shows - Details
export async function fetchDetails(type: "movie" | "tv", id: number | string) {
  return fetchTMDB(`/${type}/${id}`, {
    append_to_response: "credits,videos,similar",
  });
}

// Movies & TV Shows - Credits only
export async function fetchCredits(type: "movie" | "tv", id: number | string) {
  const data = await fetchTMDB(`/${type}/${id}/credits`);
  return data; // includes cast and crew
}

// Movies & TV Shows - Videos/Trailers only
export async function fetchVideos(type: "movie" | "tv", id: number | string) {
  const data = await fetchTMDB(`/${type}/${id}/videos`);
  return data; // includes trailers, clips
}

export type Category =
  | "trending"
  | "popular"
  | "top-rated"
  | "now-playing"
  | "upcoming"
  | "action"
  | "comedy"
  | "animation"
  | "adventure"
  | "horror"
  | "romance"
  | "hollywood"
  | "nollywood"
  | "anime";

interface FetchOptions {
  [key: string]: string | number | undefined;
}
export function getYear(dateString: string): string {
  return new Date(dateString).getFullYear().toString();
}

// Generic fetch helper
async function fetchFromTMDB(endpoint: string, params: FetchOptions = {}) {
  const url = new URL(`${baseUrl}${endpoint}`);
  if (!apiKey) {
    throw new Error("TMDB API key is not defined");
  }
  url.searchParams.set("api_key", apiKey);

  Object.entries(params).forEach(([key, value]) => {
    if (value) url.searchParams.set(key, String(value));
  });

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`TMDB API error: ${res.status}`);
  return res.json();
}

// Map categories to API calls

export async function getMoviesByCategory(
  category: Category,
  page = 1
): Promise<TMDBResponse> {
  switch (category) {
    case "trending":
      return fetchFromTMDB("/trending/movie/week", { page });

    case "popular":
      return fetchFromTMDB("/movie/popular", { page });

    case "top-rated":
      return fetchFromTMDB("/movie/top_rated", { page });

    case "now-playing":
      return fetchFromTMDB("/movie/now_playing", { page });

    case "upcoming":
      return fetchFromTMDB("/movie/upcoming", { page });

    case "action":
      return fetchFromTMDB("/discover/movie", {
        with_genres: 28,
        page,
      });

    case "comedy":
      return fetchFromTMDB("/discover/movie", {
        with_genres: 35,
        page,
      });

    case "animation":
      return fetchFromTMDB("/discover/movie", {
        with_genres: 16,
        page,
      });

    case "adventure":
      return fetchFromTMDB("/discover/movie", {
        with_genres: 12,
        page,
      });

    case "horror":
      return fetchFromTMDB("/discover/movie", {
        with_genres: 27,
        page,
      });

    case "romance":
      return fetchFromTMDB("/discover/movie", {
        with_genres: 10749,
        page,
      });

    case "hollywood":
      return fetchFromTMDB("/discover/movie", {
        with_original_language: "en",
        region: "US",
        sort_by: "popularity.desc",
        page,
      });

    case "nollywood":
      return fetchFromTMDB("/discover/movie", {
        with_origin_country: "NG",
        sort_by: "popularity.desc",
        page,
      });

    case "anime":
      return fetchFromTMDB("/discover/movie", {
        with_genres: 16,
        with_original_language: "ja",
        sort_by: "popularity.desc",
        page,
      });

    default:
      throw new Error(`Unknown category: ${category}`);
  }
}

export async function getTopRatedMovies(page = 1): Promise<TMDBResponse> {
  return getMoviesByCategory("top-rated", page);
}

export async function getUpcomingMovies(page = 1): Promise<TMDBResponse> {
  return getMoviesByCategory("upcoming", page);
}

export async function getActionMovies(page = 1): Promise<TMDBResponse> {
  return getMoviesByCategory("action", page);
}

export async function getComedyMovies(page = 1): Promise<TMDBResponse> {
  return getMoviesByCategory("comedy", page);
}
