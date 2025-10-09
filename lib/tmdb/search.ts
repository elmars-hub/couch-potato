import { fetchFromTMDB } from "./fetcher";

export async function searchMulti(query: string, page = 1) {
  return fetchFromTMDB("/search/multi", { query, page });
}

export async function getGenres(type: "movie" | "tv") {
  return fetchFromTMDB(`/genre/${type}/list`);
}

export async function fetchDetails(type: "movie" | "tv", id: number | string) {
  return fetchFromTMDB(`/${type}/${id}`, {
    append_to_response: "credits,videos,similar",
  });
}

// Backwards-compatible alias
export async function getMediaDetails(type: "movie" | "tv", id: number | string) {
  return fetchDetails(type, id);
}

export async function fetchCredits(type: "movie" | "tv", id: number | string) {
  return fetchFromTMDB(`/${type}/${id}/credits`);
}

export async function fetchVideos(type: "movie" | "tv", id: number | string) {
  return fetchFromTMDB(`/${type}/${id}/videos`);
}

