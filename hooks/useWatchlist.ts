import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

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
      const { data } = await axios.get("/api/watchlist");
      return data;
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
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
      if (isInWatchlist) {
        const { data } = await axios.delete("/api/watchlist", {
          params: { mediaId, mediaType },
        });
        return data;
      }
      const { data } = await axios.post("/api/watchlist", {
        mediaId,
        mediaType,
      });
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
