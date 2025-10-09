import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { createClient as createBrowserClient } from "@/lib/supabase/client";

export type MediaType = "movie" | "tv";

export interface WatchlistItem {
  id: string;
  userId: string;
  mediaType: MediaType;
  mediaId: number;
  createdAt: string;
}

//  Fetch all watchlist items
export function useWatchlist() {
  return useQuery<WatchlistItem[]>({
    queryKey: ["watchlist"],
    queryFn: async () => {
      const supabase = createBrowserClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const token = session?.access_token;
      // If not authenticated yet, return empty list to avoid unnecessary 401s
      if (!token) return [];
      const { data } = await axios.get("/api/watchlist", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data as WatchlistItem[];
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
    retry: false,
  });
}

// Check if item is in watchlist
export function useIsInWatchlist(mediaId: number, mediaType: MediaType) {
  const { data: watchlist } = useWatchlist();
  return Boolean(
    watchlist?.some((w) => w.mediaId === mediaId && w.mediaType === mediaType)
  );
}

// Toggle watchlist (optimistic updates)
export function useToggleWatchlist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      mediaId,
      mediaType,
      isInWatchlist,
    }: {
      mediaId: number;
      mediaType: MediaType;
      isInWatchlist: boolean;
    }) => {
      const supabase = createBrowserClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const token = session?.access_token;
      const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
      if (isInWatchlist) {
        const { data } = await axios.delete("/api/watchlist", {
          params: { mediaId, mediaType },
          headers,
        });
        return data;
      }
      const { data } = await axios.post(
        "/api/watchlist",
        {
          mediaId,
          mediaType,
        },
        { headers }
      );
      return data;
    },

    onMutate: async ({ mediaId, mediaType, isInWatchlist }) => {
      await queryClient.cancelQueries({ queryKey: ["watchlist"] });
      const prev =
        queryClient.getQueryData<WatchlistItem[]>(["watchlist"]) || [];

      queryClient.setQueryData(
        ["watchlist"],
        isInWatchlist
          ? prev.filter(
              (w) => !(w.mediaId === mediaId && w.mediaType === mediaType)
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
      if (ctx?.prev) queryClient.setQueryData(["watchlist"], ctx.prev);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["watchlist"] });
    },
  });
}
