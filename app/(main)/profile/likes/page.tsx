"use client";

import React from "react";
import { useFavorites } from "@/hooks/useFavourites";
import Image from "next/image";
import Link from "next/link";
import { getImageUrl, fetchDetails } from "@/lib/tmdb";

export default function LikesHistoryPage() {
  const { data, isLoading } = useFavorites();

  return (
    <main className="min-h-screen bg-[#141414] text-white">
      <div className="container mx-auto px-4 pt-28 pb-10">
        <h1 className="text-3xl font-bold mb-6">Liked Items</h1>

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="relative aspect-[2/3] bg-white/10 rounded animate-pulse" />
            ))}
          </div>
        ) : data && data.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {data.map((item) => (
              <LikesCard key={`${item.mediaType}-${item.mediaId}`} mediaType={item.mediaType} mediaId={item.mediaId} />
            ))}
          </div>
        ) : (
          <p className="text-white/60">No likes yet.</p>
        )}
      </div>
    </main>
  );
}

function LikesCard({ mediaType, mediaId }: { mediaType: "movie" | "tv"; mediaId: number }) {
  const [poster, setPoster] = React.useState<string | null>(null);
  const [title, setTitle] = React.useState<string>("");
  React.useEffect(() => {
    let mounted = true;
    fetchDetails(mediaType, mediaId).then((res: any) => {
      if (!mounted) return;
      setPoster(res.poster_path ?? null);
      setTitle(res.title || res.name || "");
    });
    return () => {
      mounted = false;
    };
  }, [mediaType, mediaId]);
  const href = mediaType === "tv" ? `/tvshows/${mediaId}` : `/movies/${mediaId}?type=movie`;
  return (
    <Link href={href} className="group">
      <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-gray-800">
        <Image
          src={getImageUrl(poster, "w500")}
          alt={title || "Poster"}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="mt-2 text-sm line-clamp-1">{title}</div>
    </Link>
  );
}


