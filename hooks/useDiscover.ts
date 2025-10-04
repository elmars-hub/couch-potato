// src/hooks/useDiscover.ts
import { useQuery } from "@tanstack/react-query";
import { discoverMovies } from "@/lib/tmdb";

interface DiscoverParams {
  page?: number;
  genre?: string;
  year?: string;
  sort?: string;
}

export function useDiscover(params: DiscoverParams) {
  return useQuery({
    queryKey: ["discover", params],
    queryFn: () => discoverMovies(params),
    staleTime: 1000 * 60 * 2,
  });
}
