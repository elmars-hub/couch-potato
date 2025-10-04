/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, Info } from "lucide-react";
import { useNowPlayingMovies } from "@/hooks/useMovies";
import { getImageUrl } from "@/lib/tmdb";

const MAX_CONTENT_WIDTH_CLASS = "max-w-[1800px]";

export default function HeroCarousel() {
  const { data, isLoading, error } = useNowPlayingMovies(1);
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const movies = data?.results?.slice(0, 8) || [];

  useEffect(() => {
    if (!movies.length || isPaused) return;

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % movies.length);
    }, 7000);

    return () => clearInterval(interval);
  }, [movies, isPaused]);

  // Progress bar animation
  useEffect(() => {
    const progressElement = document.getElementById(`progress-${index}`);
    if (!progressElement || isPaused) return;

    // Reset and start animation
    progressElement.style.width = "0%";

    // Force reflow to restart animation
    void progressElement.offsetWidth;

    const animation = progressElement.animate(
      [{ width: "0%" }, { width: "100%" }],
      { duration: 7000, easing: "linear", fill: "forwards" }
    );

    return () => animation.cancel();
  }, [index, isPaused]);

  const goToSlide = (i: number) => {
    setIndex(i);
  };

  if (isLoading) {
    return (
      <div className="h-[70vh] flex items-center justify-center bg-[#141414]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400">Loading featured content...</p>
        </div>
      </div>
    );
  }

  if (!movies.length) return null;

  const currentMovie = movies[index];

  return (
    <section
      className="relative w-full h-[75vh] md:h-[76vh] lg:h-[80vh] xl:h-[85vh] overflow-hidden group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Movie Slides */}
      {movies.map((movie, i) => {
        const images = getImageUrl(
          movie.backdrop_path || movie.poster_path,
          "original"
        );

        return (
          <div
            key={movie.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              i === index ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            <Image
              src={images}
              alt={movie.title}
              fill
              priority={i === index}
              className="object-cover object-top"
            />

            {/* Gradient overlays - enhanced for better readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#141414]/80 via-transparent to-[#141414]/30" />
          </div>
        );
      })}

      {/* Content Overlay */}
      <div
        className={`absolute inset-0 z-20 mx-auto ${MAX_CONTENT_WIDTH_CLASS} w-full`}
      >
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-10 lg:p-16 space-y-6">
          <div className="max-w-2xl space-y-4">
            {/* Featured badge */}
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-red-600 text-white text-xs font-bold uppercase tracking-wider rounded">
                Featured
              </span>
              <span className="text-gray-300 text-sm">
                {index + 1} / {movies.length}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white drop-shadow-2xl leading-tight">
              {currentMovie.title}
            </h1>

            {/* Movie Info */}
            <div className="flex items-center gap-3 text-sm md:text-base">
              <span className="px-2 py-1 bg-yellow-500 text-black font-bold rounded text-xs">
                {currentMovie.vote_average.toFixed(1)}
              </span>
              <span className="text-gray-200 font-medium">
                {currentMovie.release_date?.split("-")[0]}
              </span>
              <span className="text-gray-400">•</span>
              <span className="text-gray-300">
                {Math.floor(Math.random() * 60) + 90} min
              </span>
            </div>

            {/* Overview */}
            <p className="text-gray-200 text-base md:text-lg line-clamp-3 leading-relaxed max-w-xl drop-shadow-lg">
              {currentMovie.overview}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 pt-2 mb-10">
              <Link href={`/movies/${currentMovie.id}`}>
                <button className="flex items-center gap-2 px-6 py-3 rounded-md bg-white text-black font-semibold hover:bg-white/90 transition-all shadow-lg hover:scale-105 transform duration-200">
                  <Play className="w-5 h-5 fill-current" />
                  Play Now
                </button>
              </Link>

              <Link href={`/movies/${currentMovie.id}`}>
                <button className="flex items-center gap-2 px-6 py-3 rounded-md bg-gray-500/70 backdrop-blur-sm text-white font-semibold hover:bg-gray-500/90 transition-all border border-gray-400/30">
                  <Info className="w-5 h-5" />
                  More Info
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Carousel Controls - Bottom Right */}
      <div className="absolute bottom-8 right-12 md:right-8 z-30 flex items-center gap-3 ">
        <div className="flex gap-2">
          {movies.map((_, i) => (
            <button
              key={i}
              onClick={() => goToSlide(i)}
              className="group relative h-1 w-8 md:w-12 bg-gray-600/50 hover:bg-gray-400/50 transition-colors overflow-hidden rounded-full"
              aria-label={`Go to slide ${i + 1}`}
            >
              {i === index && (
                <div
                  id={`progress-${index}`}
                  className="absolute inset-0 bg-red-600 rounded-full"
                  style={{ width: "0%" }}
                />
              )}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
