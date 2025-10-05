// src/hooks/useDiscover.ts
import { useQuery } from "@tanstack/react-query";
import { discoverMovies, discoverTv } from "@/lib/tmdb";

interface DiscoverParams {
  page?: number;
  genre?: string;
  year?: string;
  sort?: string;
}

export function useDiscoverMovies(params: DiscoverParams) {
  return useQuery({
    queryKey: ["discover", "movie", params],
    queryFn: () => discoverMovies(params),
    staleTime: 1000 * 60 * 2,
  });
}

export function useDiscoverTv(params: DiscoverParams) {
  return useQuery({
    queryKey: ["discover", "tv", params],
    queryFn: () => discoverTv(params),
    staleTime: 1000 * 60 * 2,
  });
}
