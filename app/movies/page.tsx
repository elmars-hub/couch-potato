/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePopularMovies } from "@/hooks/useMovies";
import { getImageUrl } from "@/lib/tmdb"; // your helper function

export default function MoviesPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading, error } = usePopularMovies(page);

  if (isLoading) {
    return <p className="text-white text-center mt-20">Loading movies...</p>;
  }

  if (error) {
    return (
      <p className="text-red-500 text-center mt-20">Failed to load movies</p>
    );
  }

  return (
    <main className="min-h-screen bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        <h1 className="mb-8 text-4xl font-bold text-white">Popular Movies</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {data?.results.map((movie: any) => (
            <Link
              key={movie.id}
              href={`/movies/${movie.id}?type=movie`}
              className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:scale-105 transition-transform"
            >
              <div className="relative w-full h-[300px]">
                <Image
                  src={getImageUrl(movie.poster_path)}
                  alt={movie.title || movie.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h2 className="text-white font-semibold text-lg mb-2">
                  {movie.title || movie.name}
                </h2>
                <p className="text-gray-300 text-sm line-clamp-3">
                  {movie.overview || "No description available."}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-8 gap-4">
          <button
            className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
            disabled={page === 1}
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          >
            Previous
          </button>
          <span className="text-white px-4 py-2">{page}</span>
          <button
            className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
            onClick={() => setPage((prev) => prev + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </main>
  );
}
