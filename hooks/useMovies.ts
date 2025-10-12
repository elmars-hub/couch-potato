import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import {
  getTrendingMovies,
  getPopularMovies,
  getMovieDetails,
  getNowPlayingMovies,
} from "@/lib/tmdb/movies";

export function useTrendingMovies() {
  return useQuery({
    queryKey: ["movies", "trending"],
    queryFn: getTrendingMovies,
  });
}

export function usePopularMovies(page = 1) {
  return useQuery({
    queryKey: ["movies", "popular", page],
    queryFn: () => getPopularMovies(page),
  });
}

export function useMovieDetails(id: number) {
  return useQuery({
    queryKey: ["movie", id],
    queryFn: () => getMovieDetails(id),
    enabled: !!id,
  });
}

export function useNowPlayingMovies(page = 1) {
  return useQuery({
    queryKey: ["movies", "now-playing", page],
    queryFn: () => getNowPlayingMovies(page),
  });
}

// Infinite scroll version
export function useInfinitePopularMovies() {
  return useInfiniteQuery({
    queryKey: ["movies", "popular", "infinite"],
    queryFn: ({ pageParam = 1 }) => getPopularMovies(pageParam),
    getNextPageParam: (lastPage) => {
      return lastPage.page < lastPage.total_pages
        ? lastPage.page + 1
        : undefined;
    },
    initialPageParam: 1,
  });
}
