// src/hooks/useFavorites.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { createClient as createBrowserClient } from "@/lib/supabase/client";

export type MediaType = "movie" | "tv";

export interface FavoriteItem {
  id: string;
  userId: string;
  mediaType: MediaType;
  mediaId: number;
  createdAt: string;
}

// Fetch all favorites
export function useFavorites() {
  return useQuery<FavoriteItem[]>({
    queryKey: ["favorites"],
    queryFn: async () => {
      const supabase = createBrowserClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) return [];
      const { data } = await axios.get("/api/favorites", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data as FavoriteItem[];
    },
    staleTime: 1000 * 60 * 2,
    retry: false,
  });
}

// Toggle favorites (with optimistic update)
export function useToggleFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      mediaId,
      mediaType,
      isFavorite,
    }: {
      mediaId: number;
      mediaType: MediaType;
      isFavorite: boolean;
    }) => {
      const supabase = createBrowserClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const token = session?.access_token;
      const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
      if (isFavorite) {
        const { data } = await axios.delete("/api/favorites", {
          params: { mediaId, mediaType },
          headers,
        });
        return data;
      }

      const { data } = await axios.post(
        "/api/favorites",
        {
          mediaId,
          mediaType,
        },
        { headers }
      );
      return data;
    },

    // Optimistic update
    onMutate: async ({ mediaId, mediaType, isFavorite }) => {
      await queryClient.cancelQueries({ queryKey: ["favorites"] });
      const prev =
        queryClient.getQueryData<FavoriteItem[]>(["favorites"]) || [];

      queryClient.setQueryData(
        ["favorites"],
        isFavorite
          ? prev.filter(
              (f) => !(f.mediaId === mediaId && f.mediaType === mediaType)
            )
          : [
              ...prev,
              {
                id: `temp-${mediaType}-${mediaId}`,
                userId: "optimistic",
                mediaType,
                mediaId,
                createdAt: new Date().toISOString(),
              },
            ]
      );

      return { prev };
    },

    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(["favorites"], ctx.prev);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });
}

// Check if a media is already a favorite
export function useIsFavorite(mediaId: number, mediaType: MediaType) {
  const { data: favorites } = useFavorites();
  return Boolean(
    favorites?.some((f) => f.mediaId === mediaId && f.mediaType === mediaType)
  );
}
