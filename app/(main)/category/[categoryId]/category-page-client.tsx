"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useInfiniteMoviesByCategory } from "@/hooks/useInfiniteMovies";
import { getImageUrl, getYear, type Category } from "@/lib/tmdb";
import { motion, AnimatePresence } from "framer-motion";

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

  // Sync state with prop on mount and prop changes
  useEffect(() => {
    setSelectedCategory(category);
  }, [category]);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteMoviesByCategory(selectedCategory);

  const currentCategory = CATEGORIES.find((cat) => cat.id === selectedCategory);
  const allMovies = data?.pages.flatMap((page) => page.results) ?? [];

  // Remove debug logs in production

  return (
    <motion.div
      className="min-h-screen bg-[#141414] text-white mt-24"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Breadcrumb */}
      <motion.div
        className="container mx-auto px-4 py-6"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        <div className="flex items-center gap-2 text-sm text-white/60">
          <Link href="/" className="hover:text-white transition-colors">
            Home
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-white font-medium">
            {currentCategory?.label || `Category: ${category}`}
          </span>
        </div>
      </motion.div>

      {/* Category Tabs */}
      <motion.div
        className="container mx-auto px-4 pb-8"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <Tabs
          value={selectedCategory}
          onValueChange={(value) => setSelectedCategory(value as Category)}
          className="w-full"
        >
          <TabsList className="w-full justify-start overflow-x-auto bg-transparent border-white/10 rounded-none h-auto p-0 flex-wrap gap-2 scrollbar-hide">
            {CATEGORIES.map((cat, index) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + index * 0.05, duration: 0.3 }}
              >
                <TabsTrigger
                  value={cat.id}
                  className="data-[state=active]:bg-red-600 data-[state=active]:text-white cursor-pointer bg-white/5 hover:bg-white/10 rounded-full px-3 py-2 text-xs sm:text-sm whitespace-nowrap transition-all duration-300 hover:scale-105"
                >
                  <span className="mr-1">{cat.emoji}</span>
                  <span className="hidden sm:inline">{cat.label}</span>
                  <span className="sm:hidden">{cat.label.split(" ")[0]}</span>
                </TabsTrigger>
              </motion.div>
            ))}
          </TabsList>
        </Tabs>
      </motion.div>

      {/* Movies Grid */}
      <motion.div
        className="container mx-auto px-4 pb-12"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              className="flex flex-col items-center justify-center py-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Loader2 className="h-8 w-8 animate-spin text-red-600 mb-4" />
              <p className="text-white/60">
                Loading {currentCategory?.label || category}...
              </p>
            </motion.div>
          ) : error ? (
            <motion.div
              className="flex flex-col items-center justify-center py-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <p className="text-red-500 text-lg mb-2">Error loading movies</p>
              <p className="text-white/60 text-sm">{error.message}</p>
            </motion.div>
          ) : allMovies.length === 0 ? (
            <motion.div
              className="flex flex-col items-center justify-center py-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <p className="text-white/60 text-lg">No movies found</p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
                {allMovies.map((movie, index) => (
                  <motion.div
                    key={`${movie.id}-${index}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                    whileHover={{ scale: 1.02 }}
                    className="group relative"
                  >
                    <Link href={`/movie/${movie.id}`}>
                      <div className="absolute -left-1 -top-1 z-10 w-6 h-6 sm:w-8 sm:h-8 bg-red-600 rounded-full flex items-center justify-center text-white font-bold text-xs sm:text-sm shadow-lg">
                        {index + 1}
                      </div>
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
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-3">
                            <h3 className="text-white font-semibold text-xs sm:text-sm line-clamp-2 mb-1 sm:mb-2">
                              {movie.title}
                            </h3>
                            <div className="flex items-center gap-1 sm:gap-2 text-xs text-white/80 mb-1 sm:mb-2">
                              <span>⭐ {movie.vote_average.toFixed(1)}</span>
                              <span>•</span>
                              <span>{getYear(movie.release_date)}</span>
                            </div>
                            <Button
                              size="sm"
                              className="w-full bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm py-1 sm:py-2"
                            >
                              ▶ Play
                            </Button>
                          </div>
                        </div>
                      </div>
                      <div className="mt-2 sm:hidden">
                        <h3 className="text-white text-xs font-medium line-clamp-1">
                          {movie.title}
                        </h3>
                        <div className="flex items-center gap-1 text-xs text-white/60 mt-1">
                          <span>⭐ {movie.vote_average.toFixed(1)}</span>
                          <span>•</span>
                          <span>{getYear(movie.release_date)}</span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
              {hasNextPage && (
                <motion.div
                  className="flex justify-center mt-8 sm:mt-12"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Button
                    onClick={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                    size="lg"
                    className="bg-red-600 hover:bg-red-700 text-white px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base"
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
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
