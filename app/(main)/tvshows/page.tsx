/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import Link from "next/link";
import { useTrendingTVShows } from "@/hooks/useTvshows";
import { getImageUrl } from "@/lib/tmdb";
import { TvCarousel } from "@/components/main/tvcarousel";

export default function TvshowPage() {
  const { data: tvshows, isLoading } = useTrendingTVShows();

  if (isLoading) {
    return <p className="text-white text-center mt-20">Loading TV Shows...</p>;
  }

  return (
    <>
      <TvCarousel tvshows={tvshows} />

      <main className="min-h-screen bg-gray-900 py-8">
        <div className="container mx-auto px-4">
          <h1 className="mb-8 text-4xl font-bold text-white">
            Trending TV Shows
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {tvshows?.results.map((tv: any) => (
              <Link
                key={tv.id}
                href={`/tvshows/${tv.id}`}
                className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:scale-105 transition-transform"
              >
                <div className="relative w-full h-[300px]">
                  <Image
                    src={getImageUrl(tv.poster_path)}
                    alt={tv.name}
                    fill
                    className="object-cover object-top"
                  />
                </div>
                <div className="p-4">
                  <h2 className="text-white font-semibold text-lg mb-2">
                    {tv.name}
                  </h2>
                  <p className="text-gray-300 text-sm line-clamp-3">
                    {tv.overview || "No description available."}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
