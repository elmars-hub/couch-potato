"use client";

import { Bookmark } from "lucide-react";
import { useIsInWatchlist, useToggleWatchlist } from "@/hooks/useWatchlist";

interface WatchlistButtonProps {
  mediaId: number;
  mediaType: "movie" | "tv";
}

export default function WatchlistButton({
  mediaId,
  mediaType,
}: WatchlistButtonProps) {
  const isInWatchlist = useIsInWatchlist(mediaId, mediaType);
  const toggleWatchlist = useToggleWatchlist();

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleWatchlist.mutate({ mediaId, mediaType, isInWatchlist });
      }}
      className="p-2"
    >
      <Bookmark
        className={`w-6 h-6 transition-colors duration-200 ${
          isInWatchlist ? "text-yellow-500 fill-yellow-500" : "text-gray-400"
        }`}
      />
    </button>
  );
}
