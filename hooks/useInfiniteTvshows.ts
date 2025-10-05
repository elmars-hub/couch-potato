import { useInfiniteQuery } from "@tanstack/react-query";
import { getPopularTVShows } from "@/lib/tmdb";

export function useInfinitePopularTv() {
  return useInfiniteQuery({
    queryKey: ["tv", "popular", "infinite"],
    queryFn: ({ pageParam }) => getPopularTVShows(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.total_pages) return lastPage.page + 1;
      return undefined;
    },
    staleTime: 1000 * 60 * 5,
  });
}


