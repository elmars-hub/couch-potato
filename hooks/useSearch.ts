import { useQuery } from "@tanstack/react-query";
import { searchMulti } from "@/lib/tmdb/search";

export function useSearch(query: string, page = 1) {
  return useQuery({
    queryKey: ["search", query, page],
    queryFn: () => searchMulti(query, page),
    enabled: query.length > 0,
  });
}
