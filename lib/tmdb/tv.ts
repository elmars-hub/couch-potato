import { fetchFromTMDB } from "./fetcher";

export async function getPopularTVShows(page = 1) {
  return fetchFromTMDB("/tv/popular", { page });
}

export async function getTrendingTVShows() {
  return fetchFromTMDB("/trending/tv/week");
}

export async function getTVShowDetails(id: number) {
  return fetchFromTMDB(`/tv/${id}`, {
    append_to_response: "credits,videos,similar",
  });
}

export async function discoverTv(params: {
  page?: number;
  genre?: string;
  year?: string;
  sort?: string;
}) {
  const { page = 1, genre, year, sort = "popularity.desc" } = params;
  const queryParams: Record<string, any> = { page, sort_by: sort };
  if (genre) queryParams.with_genres = genre;
  if (year) queryParams.first_air_date_year = year;
  return fetchFromTMDB("/discover/tv", queryParams);
}

