/* eslint-disable @typescript-eslint/no-explicit-any */
const baseUrl = "https://api.themoviedb.org/3";
const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;

export interface TMDBResponse<T = any> {
  results: T[];
  page: number;
  total_pages: number;
  total_results: number;
}

export interface FetchOptions {
  [key: string]: string | number | undefined | null | boolean;
}

export async function fetchFromTMDB(endpoint: string, params: FetchOptions = {}) {
  const url = new URL(`${baseUrl}${endpoint}`);
  if (!apiKey) {
    throw new Error("TMDB API key is not defined");
  }
  url.searchParams.set("api_key", apiKey);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, String(value));
    }
  });

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`TMDB API error: ${res.status}`);
  return res.json();
}

export function getImageUrl(
  path: string | null,
  size: "w500" | "w780" | "original" = "original"
) {
  if (!path) return "/placeholder.jpg";
  return `https://image.tmdb.org/t/p/${size}${path.startsWith("/") ? path : `/${path}`}`;
}

export function getYear(dateString: string): string {
  return new Date(dateString).getFullYear().toString();
}

