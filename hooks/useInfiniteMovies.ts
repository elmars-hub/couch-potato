"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import {
  getMoviesByCategory,
  type Category,
  type TMDBResponse,
} from "@/lib/tmdb";

export function useInfiniteMoviesByCategory(category: Category) {
  console.log(
    "[v0] useInfiniteMoviesByCategory hook called with category:",
    category
  );

  return useInfiniteQuery<TMDBResponse>({
    queryKey: ["movies", category, "infinite"],
    queryFn: async ({ pageParam = 1 }) => {
      console.log("[v0] Fetching page:", pageParam, "for category:", category);
      const result = await getMoviesByCategory(category, pageParam as number);
      console.log("[v0] Query result:", result.results?.length || 0, "movies");
      return result;
    },
    getNextPageParam: (lastPage) => {
      return lastPage.page < lastPage.total_pages
        ? lastPage.page + 1
        : undefined;
    },
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000,
    retry: 2,
    retryDelay: 1000,
  });
}
