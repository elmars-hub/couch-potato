// src/hooks/useTVShows.ts
import { useQuery } from "@tanstack/react-query";
import {
  getPopularTVShows,
  getTrendingTVShows,
  getTVShowDetails,
} from "@/lib/tmdb";

export function useTrendingTVShows() {
  return useQuery({
    queryKey: ["tv", "trending"],
    queryFn: getTrendingTVShows,
  });
}

export function usePopularTVShows(page = 1) {
  return useQuery({
    queryKey: ["tv", "popular", page],
    queryFn: () => getPopularTVShows(page),
  });
}

export function useTVShowDetails(id: number) {
  return useQuery({
    queryKey: ["tv", id],
    queryFn: () => getTVShowDetails(id),
    enabled: !!id,
  });
}
