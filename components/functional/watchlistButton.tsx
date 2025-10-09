"use client";

import { Bookmark } from "lucide-react";
import { useIsInWatchlist, useToggleWatchlist } from "@/hooks/useWatchlist";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAuthContext } from "@/lib/auth-context";

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
  const { user } = useAuthContext();
  const router = useRouter();

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!user) {
          toast.error("Please log in to bookmark");
          router.push("/login");
          return;
        }
        toggleWatchlist.mutate(
          { mediaId, mediaType, isInWatchlist },
          {
            onSuccess: () => {
              toast.success(
                isInWatchlist ? "Removed from watchlist" : "Added to watchlist"
              );
            },
            onError: () => {
              toast.error("Failed to update watchlist");
            },
          }
        );
      }}
      className="p-2 cursor-pointer hover:scale-y-90"
    >
      <Bookmark
        className={`w-6 h-6 transition-colors duration-200 ${
          isInWatchlist ? "text-yellow-500 fill-yellow-500" : "text-gray-400"
        }`}
      />
    </button>
  );
}
