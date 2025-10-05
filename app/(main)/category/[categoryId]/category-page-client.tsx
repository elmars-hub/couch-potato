"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useInfiniteMoviesByCategory } from "@/hooks/useInfiniteMovies";
import { getImageUrl, getYear, type Category } from "@/lib/tmdb";

const CATEGORIES = [
  { id: "trending", label: "Trending Now", emoji: "🔥" },
  { id: "popular", label: "Popular Movies", emoji: "⭐" },
  { id: "top-rated", label: "Top Rated", emoji: "🏆" },
  { id: "now-playing", label: "Now Playing", emoji: "🎬" },
  { id: "upcoming", label: "Coming Soon", emoji: "📅" },
  { id: "hollywood", label: "Hollywood", emoji: "🎭" },
  { id: "animation", label: "Animation", emoji: "🎨" },
  { id: "horror", label: "Horror", emoji: "👻" },
  { id: "romance", label: "Romance", emoji: "💕" },
  { id: "adventure", label: "Adventure", emoji: "🗺️" },
  { id: "nollywood", label: "Nollywood", emoji: "🎥" },
  { id: "anime", label: "Anime", emoji: "🎌" },
  { id: "action", label: "Action", emoji: "💥" },
  { id: "comedy", label: "Comedy", emoji: "😂" },
] as const;

interface CategoryPageClientProps {
  category: Category;
}

export function CategoryPageClient({ category }: CategoryPageClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<Category>(category);
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteMoviesByCategory(selectedCategory);

  const currentCategory = CATEGORIES.find((cat) => cat.id === selectedCategory);
  const allMovies = data?.pages.flatMap((page) => page.results) ?? [];

  return (
    <div className="min-h-screen bg-[#141414] text-white mt-24">
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-2 text-sm text-white/60">
          <Link href="/" className="hover:text-white transition-colors">
            Home
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-white font-medium">
            {currentCategory?.label || "Category"}
          </span>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="container mx-auto px-4 pb-8 ">
        <Tabs
          value={selectedCategory}
          onValueChange={(value) => setSelectedCategory(value as Category)}
          className="w-full"
        >
          <TabsList className="w-full justify-start overflow-x-auto bg-transparent border-white/10 rounded-none h-auto p-0 flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <TabsTrigger
                key={cat.id}
                value={cat.id}
                className="data-[state=active]:bg-red-600 data-[state=active]:text-white  cursor-pointer bg-white/5 hover:bg-white/10 rounded-full px-4 py-2 text-sm whitespace-nowrap"
              >
                <span className="mr-1">{cat.emoji}</span>
                {cat.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Movies Grid */}
      <div className="container mx-auto px-4 pb-12">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-red-600" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {allMovies.map((movie, index) => (
                <Link
                  key={`${movie.id}-${index}`}
                  href={`/movie/${movie.id}`}
                  className="group relative"
                >
                  {/* Ranking Badge */}
                  <div className="absolute -left-2 -top-2 z-10 w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                    {index + 1}
                  </div>

                  {/* Movie Poster */}
                  <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-gray-800">
                    <Image
                      src={
                        getImageUrl(movie.poster_path, "w500") ||
                        "/placeholder.svg"
                      }
                      alt={movie.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 16vw"
                    />

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="absolute bottom-0 left-0 right-0 p-3">
                        <h3 className="text-white font-semibold text-sm line-clamp-2 mb-2">
                          {movie.title}
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-white/80 mb-2">
                          <span className="flex items-center gap-1">
                            ⭐ {movie.vote_average.toFixed(1)}
                          </span>
                          <span>•</span>
                          <span>{getYear(movie.release_date)}</span>
                        </div>
                        <Button
                          size="sm"
                          className="w-full bg-red-600 hover:bg-red-700 text-white"
                        >
                          ▶ Play
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Movie Info (visible on mobile) */}
                  <div className="mt-2 md:hidden">
                    <h3 className="text-white text-sm font-medium line-clamp-1">
                      {movie.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-white/60 mt-1">
                      <span>⭐ {movie.vote_average.toFixed(1)}</span>
                      <span>•</span>
                      <span>{getYear(movie.release_date)}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Load More Button */}
            {hasNextPage && (
              <div className="flex justify-center mt-12">
                <Button
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                  size="lg"
                  className="bg-red-600 hover:bg-red-700 text-white px-8"
                >
                  {isFetchingNextPage ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    "Load More"
                  )}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
