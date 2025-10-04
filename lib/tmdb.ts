/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";

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
  size: "w500" | "original" = "w500"
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
