// src/hooks/useMovies.ts
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import {
  getTrendingMovies,
  getPopularMovies,
  getMovieDetails,
} from "@/lib/tmdb";

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
