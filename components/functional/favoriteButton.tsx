import { Heart } from "lucide-react";
import { useIsFavorite, useToggleFavorite } from "@/hooks/useFavourites";

export function FavoriteButton({
  mediaId,
  mediaType,
}: {
  mediaId: number;
  mediaType: "movie" | "tv";
}) {
  const isFavorite = useIsFavorite(mediaId, mediaType);
  const toggleFavorite = useToggleFavorite();

  return (
    <button
      onClick={() => toggleFavorite.mutate({ mediaId, mediaType, isFavorite })}
      className="p-2"
    >
      <Heart
        className={`w-6 h-6 transition-colors duration-200 ${
          isFavorite ? "text-red-500 fill-red-500" : "text-gray-400"
        }`}
      />
    </button>
  );
}
