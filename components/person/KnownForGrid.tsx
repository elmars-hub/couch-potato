"use client";

import Image from "next/image";
import Link from "next/link";
import { getImageUrl } from "@/lib/tmdb/fetcher";

interface CreditItem {
  id: number;
  credit_id: string;
  media_type: "movie" | "tv";
  title?: string;
  name?: string;
  poster_path?: string | null;
}

export default function KnownForGrid({ items }: { items: CreditItem[] }) {
  if (!items?.length) return null;
  return (
    <div className="mt-10">
      <h2 className="text-2xl font-semibold mb-4">Known For</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {items.slice(0, 18).map((c) => (
          <Link
            key={`${c.credit_id}-${c.id}`}
            href={c.media_type === "tv" ? `/tvshows/${c.id}` : `/movies/${c.id}?type=movie`}
            prefetch
            className="group"
          >
            <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-gray-800">
              <Image
                src={getImageUrl(c.poster_path ?? null, "w500")}
                alt={c.title ?? c.name ?? ""}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="mt-2 text-sm line-clamp-1">{c.title ?? c.name}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}


