/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import GenreFilter from "@/components/functional/genre-filter";
import { discoverMovies, getPopularMovies } from "@/lib/tmdb";
import { getImageUrl } from "@/helpers/url";
import { getYear } from "@/helpers/date";
import { GridSkeleton } from "@/components/general/GridSkeleton";

interface MoviesClientProps {
  initialMovies: any[];
}

export default function MoviesClient({ initialMovies }: MoviesClientProps) {
  const [page, setPage] = useState(1);
  const [genre, setGenre] = useState<string | undefined>(undefined);
  const [items, setItems] = useState<any[]>(initialMovies);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Reset on genre change
  useEffect(() => {
    setItems([]);
    setPage(1);
    setHasMore(true);
  }, [genre]);

  // Load items
  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const res = genre
          ? await discoverMovies({ page, genre })
          : await getPopularMovies(page);
        if (!mounted) return;
        setItems((prev) =>
          page === 1 ? res.results : [...prev, ...res.results]
        );
        setHasMore(res.page < res.total_pages);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [genre, page]);

  return (
    <>
      <h2 className="mb-2 text-2xl font-semibold text-white">Browse Movies</h2>
      <GenreFilter type="movie" value={genre} onChange={setGenre} />

      {loading && items.length === 0 ? (
        <GridSkeleton count={18} />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {items.map((movie) => (
            <Link
              key={movie.id}
              href={`/movies/${movie.id}?type=movie`}
              className="group relative"
            >
              <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-gray-800">
                <Image
                  src={getImageUrl(movie.poster_path, "w500")}
                  alt={movie.title || movie.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <h3 className="text-white font-semibold text-sm line-clamp-2 mb-2">
                      {movie.title || movie.name}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-white/80 mb-2">
                      {typeof movie.vote_average === "number" && (
                        <span>⭐ {movie.vote_average.toFixed(1)}</span>
                      )}
                      {movie.release_date && (
                        <>
                          <span>•</span>
                          <span>{getYear(movie.release_date)}</span>
                        </>
                      )}
                    </div>
                    <button className="w-full bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded py-1.5">
                      ▶ Play
                    </button>
                  </div>
                </div>
              </div>
              <div className="mt-2 text-sm line-clamp-1">
                {movie.title || movie.name}
              </div>
            </Link>
          ))}
        </div>
      )}

      <div className="flex justify-center mt-8">
        <button
          onClick={() => setPage((p) => p + 1)}
          disabled={!hasMore || loading}
          className="px-6 py-3 rounded-md bg-red-600 text-white cursor-pointer font-semibold hover:bg-red-700 disabled:opacity-60"
        >
          {loading ? "Loading..." : hasMore ? "Load More" : "No more results"}
        </button>
      </div>
    </>
  );
}
