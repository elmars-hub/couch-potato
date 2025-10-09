import { Heart } from "lucide-react";
import { useIsFavorite, useToggleFavorite } from "@/hooks/useFavourites";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAuthContext } from "@/lib/auth-context";

export function FavoriteButton({
  mediaId,
  mediaType,
}: {
  mediaId: number;
  mediaType: "movie" | "tv";
}) {
  const isFavorite = useIsFavorite(mediaId, mediaType);
  const toggleFavorite = useToggleFavorite();
  const { user } = useAuthContext();
  const router = useRouter();

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!user) {
          toast.error("Please log in to like movies");
          router.push("/login");
          return;
        }
        toggleFavorite.mutate({ mediaId, mediaType, isFavorite });
      }}
      className="p-2 cursor-pointer"
    >
      <Heart
        className={`w-6 h-6 transition-colors duration-200 ${
          isFavorite ? "text-red-500 fill-red-500" : "text-gray-400"
        }`}
      />
    </button>
  );
}
