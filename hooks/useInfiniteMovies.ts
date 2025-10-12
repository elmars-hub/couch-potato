import { useInfiniteQuery } from "@tanstack/react-query";
import { getMoviesByCategory, type Category } from "@/lib/tmdb/movies";

export function useInfiniteMoviesByCategory(category: Category) {
  return useInfiniteQuery({
    queryKey: ["movies", "category", category],
    queryFn: ({ pageParam }) => getMoviesByCategory(category, pageParam),
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.total_pages) {
        return lastPage.page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
