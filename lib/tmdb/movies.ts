import { fetchFromTMDB, type TMDBResponse } from "./fetcher";

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

export async function getTrendingMovies() {
  return fetchFromTMDB("/trending/movie/week");
}

export async function getNowPlayingMovies(page = 1) {
  return fetchFromTMDB(`/movie/now_playing`, { page });
}

export async function getPopularMovies(page = 1) {
  return fetchFromTMDB("/movie/popular", { page });
}

export async function getTopRatedMovies(page = 1): Promise<TMDBResponse<Movie>> {
  return getMoviesByCategory("top-rated", page) as Promise<TMDBResponse<Movie>>;
}

export async function getUpcomingMovies(page = 1): Promise<TMDBResponse<Movie>> {
  return getMoviesByCategory("upcoming", page) as Promise<TMDBResponse<Movie>>;
}

export async function getActionMovies(page = 1): Promise<TMDBResponse<Movie>> {
  return getMoviesByCategory("action", page) as Promise<TMDBResponse<Movie>>;
}

export async function getComedyMovies(page = 1): Promise<TMDBResponse<Movie>> {
  return getMoviesByCategory("comedy", page) as Promise<TMDBResponse<Movie>>;
}

export async function getMovieDetails(id: number) {
  return fetchFromTMDB(`/movie/${id}`, {
    append_to_response: "credits,videos,similar",
  });
}

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
  return fetchFromTMDB("/discover/movie", queryParams);
}

export async function getMoviesByCategory(
  category: Category,
  page = 1
): Promise<TMDBResponse<Movie>> {
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
      return fetchFromTMDB("/discover/movie", { with_genres: 28, page });
    case "comedy":
      return fetchFromTMDB("/discover/movie", { with_genres: 35, page });
    case "animation":
      return fetchFromTMDB("/discover/movie", { with_genres: 16, page });
    case "adventure":
      return fetchFromTMDB("/discover/movie", { with_genres: 12, page });
    case "horror":
      return fetchFromTMDB("/discover/movie", { with_genres: 27, page });
    case "romance":
      return fetchFromTMDB("/discover/movie", { with_genres: 10749, page });
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

