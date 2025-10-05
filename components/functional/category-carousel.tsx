"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Movie } from "@/lib/tmdb";
import { getImageUrl, getYear } from "@/lib/tmdb";

interface CategoryCarouselProps {
  title: string;
  movies: Movie[];
  categoryId: string;
}

export function CategoryCarousel({
  title,
  movies,
  categoryId,
}: CategoryCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const scroll = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return;

    const scrollAmount = 400;
    const newScrollLeft =
      scrollContainerRef.current.scrollLeft +
      (direction === "left" ? -scrollAmount : scrollAmount);

    scrollContainerRef.current.scrollTo({
      left: newScrollLeft,
      behavior: "smooth",
    });

    // Update arrow visibility
    setTimeout(() => {
      if (!scrollContainerRef.current) return;
      setShowLeftArrow(scrollContainerRef.current.scrollLeft > 0);
      setShowRightArrow(
        scrollContainerRef.current.scrollLeft <
          scrollContainerRef.current.scrollWidth -
            scrollContainerRef.current.clientWidth -
            10
      );
    }, 300);
  };

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
            {title}
            {title.includes("Trending") && <span className="text-2xl">🔥</span>}
          </h2>
          <Link href={`/category/${categoryId}`}>
            <Button
              variant="ghost"
              className="text-white hover:text-red-500 gap-2 group"
            >
              More
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        {/* Carousel */}
        <div className="relative group">
          {/* Left Arrow */}
          {showLeftArrow && (
            <button
              onClick={() => scroll("left")}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-full bg-gradient-to-r from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-start pl-2"
              aria-label="Scroll left"
            >
              <div className="w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-sm flex items-center justify-center">
                <ChevronLeft className="h-6 w-6 text-white" />
              </div>
            </button>
          )}

          {/* Movies Container */}
          <div
            ref={scrollContainerRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {movies.map((movie) => (
              <Link
                key={movie.id}
                href={`/movie/${movie.id}`}
                className="flex-shrink-0 w-[200px] group/card"
              >
                <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-gray-800">
                  <Image
                    src={
                      getImageUrl(movie.poster_path, "w500") ||
                      "/placeholder.svg"
                    }
                    alt={movie.title}
                    fill
                    className="object-cover group-hover/card:scale-105 transition-transform duration-300"
                    sizes="200px"
                  />
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity">
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="text-white font-semibold text-sm line-clamp-2 mb-1">
                        {movie.title}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-white/80">
                        <span>⭐ {movie.vote_average.toFixed(1)}</span>
                        <span>•</span>
                        <span>{getYear(movie.release_date)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Right Arrow */}
          {showRightArrow && (
            <button
              onClick={() => scroll("right")}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-full bg-gradient-to-l from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-end pr-2"
              aria-label="Scroll right"
            >
              <div className="w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-sm flex items-center justify-center">
                <ChevronRight className="h-6 w-6 text-white" />
              </div>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
