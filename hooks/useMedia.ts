import { useQuery } from "@tanstack/react-query";
import { fetchDetails, fetchCredits, fetchVideos } from "@/lib/tmdb";

// Types
export interface Cast {
  id: number;
  name: string;
  character: string;
  profile_path?: string | null;
}

export interface Video {
  id: string;
  name: string;
  key: string;
  type: string;
}

// Details hook
export function useMediaDetails(type: "movie" | "tv", id: string) {
  return useQuery({
    queryKey: ["media-details", type, id],
    queryFn: () => fetchDetails(type, id),
    enabled: !!id,
  });
}

// Credits hook (limit to 12)
export function useMediaCredits(type: "movie" | "tv", id: string, limit = 6) {
  return useQuery({
    queryKey: ["media-credits", type, id],
    queryFn: async () => {
      const data = await fetchCredits(type, id);
      return (data.cast ?? []).slice(0, limit);
    },
    enabled: !!id,
  });
}

// Videos hook (trailers only)
export function useMediaVideos(type: "movie" | "tv", id: string) {
  return useQuery({
    queryKey: ["media-videos", type, id],
    queryFn: async () => {
      const data = await fetchVideos(type, id);
      return (data.results ?? []).filter(
        (v: { type: string }) => v.type === "Trailer"
      );
    },
    enabled: !!id,
  });
}
