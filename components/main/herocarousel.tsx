/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, Info } from "lucide-react";
import { useNowPlayingMovies } from "@/hooks/useMovies";
import { getImageUrl } from "@/lib/tmdb/fetcher";
import { motion, AnimatePresence } from "framer-motion";

const MAX_CONTENT_WIDTH_CLASS = "max-w-[1800px]";
const SLIDE_DURATION = 7000;
const PROGRESS_RESET_DELAY_MS = 80;

interface Movie {
  id: number;
  title: string;
  backdrop_path: string | null;
  poster_path: string | null;
  overview: string;
  runtime: number;
  vote_average: number;
  release_date: string;
}

interface MoviesResponse {
  results: Movie[];
  page: number;
  total_pages: number;
  total_results: number;
}

interface HeroCarouselProps {
  movies: MoviesResponse;
}

export function HeroCarousel({ movies }: HeroCarouselProps) {
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const displayMovies = movies?.results?.slice(0, 8) || [];

  useEffect(() => {
    if (!displayMovies.length || isPaused) return;

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % displayMovies.length);
    }, SLIDE_DURATION);

    return () => clearInterval(interval);
  }, [displayMovies.length, isPaused]);

  // Progress bar animation (robust reset between slides)
  useEffect(() => {
    const progressElement = document.getElementById(`progress-${index}`);
    if (!progressElement || isPaused) return;

    // Reset animation
    progressElement.style.width = "0%";

    // Small delay to ensure reset is applied and layout has updated
    const timeout = setTimeout(() => {
      progressElement.style.transition = `width ${SLIDE_DURATION}ms linear`;
      progressElement.style.width = "100%";
    }, PROGRESS_RESET_DELAY_MS);

    return () => {
      clearTimeout(timeout);
      if (progressElement) {
        progressElement.style.transition = "none";
        progressElement.style.width = "0%";
      }
    };
  }, [index, isPaused]);

  const goToSlide = (i: number) => {
    setIndex(i);
  };

  if (!displayMovies.length) {
    return (
      <div className="h-[70vh] flex items-center justify-center bg-[#141414]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400">Loading featured content...</p>
        </div>
      </div>
    );
  }

  const currentMovie = displayMovies[index];

  return (
    <motion.section
      className="relative w-full h-[60vh] sm:h-[70vh] md:h-[76vh] lg:h-[80vh] xl:h-[85vh] overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Movie Slides */}
      <AnimatePresence mode="wait">
        {displayMovies.map((movie, i) => {
          const images = getImageUrl(
            movie.backdrop_path || movie.poster_path,
            "original"
          );

          return (
            <motion.div
              key={`${movie.id}-${i}`}
              className="absolute inset-0"
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{
                opacity: i === index ? 1 : 0,
                scale: i === index ? 1 : 1.1,
                zIndex: i === index ? 10 : 0,
              }}
              exit={{ opacity: 0, scale: 1.1 }}
              transition={{ duration: 1, ease: "easeInOut" }}
            >
              <Image
                src={images}
                alt={movie.title}
                fill
                priority={i === index}
                className="object-cover object-center sm:object-top"
              />

              {/* Enhanced gradient overlays for better text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/70 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#141414]/90 via-[#141414]/40 to-transparent" />
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Content Overlay */}
      <div
        className={`absolute inset-0 z-20 mx-auto ${MAX_CONTENT_WIDTH_CLASS} w-full`}
      >
        <motion.div
          className="absolute bottom-0 left-0 w-full p-4 sm:p-6 md:p-10 lg:p-16 space-y-4 sm:space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <div className="max-w-2xl space-y-3 sm:space-y-4">
            {/* Featured badge */}
            <motion.div
              className="flex items-center gap-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.3 }}
            >
              <span className="px-2 sm:px-3 py-1 bg-red-600 text-white text-xs font-bold uppercase tracking-wider rounded">
                Now Playing
              </span>
              <span className="text-gray-300 text-xs sm:text-sm">
                {index + 1} / {displayMovies.length}
              </span>
            </motion.div>

            {/* Title */}
            <motion.h1
              className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold text-white drop-shadow-2xl leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              {currentMovie.title}
            </motion.h1>

            {/* Movie Info */}
            <motion.div
              className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm md:text-base flex-wrap"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
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
            </motion.div>

            {/* Overview */}
            <motion.p
              className="text-gray-200 text-sm sm:text-base md:text-lg line-clamp-2 sm:line-clamp-3 leading-relaxed max-w-xl drop-shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              {currentMovie.overview}
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              className="flex flex-wrap gap-2 sm:gap-3 pt-2 mb-12 sm:mb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              <Link href={`/movies/${currentMovie.id}`}>
                <motion.button
                  className="flex items-center cursor-pointer gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-md bg-white text-black font-semibold hover:bg-white/90 transition-all shadow-lg text-sm sm:text-base"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
                  Play Now
                </motion.button>
              </Link>

              <Link href={`/movies/${currentMovie.id}`}>
                <motion.button
                  className="flex items-center cursor-pointer gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-md bg-gray-500/70 backdrop-blur-sm text-white font-semibold hover:bg-gray-500/90 transition-all border border-gray-400/30 text-sm sm:text-base"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Info className="w-4 h-4 sm:w-5 sm:h-5" />
                  More Info
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Carousel Controls - Bottom Right */}
      <motion.div
        className="absolute bottom-8 right-10 md:right-8 z-30 flex items-center gap-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.5 }}
      >
        <div className="flex gap-2">
          {displayMovies.map((_, i) => (
            <motion.button
              key={i}
              onClick={() => goToSlide(i)}
              className="relative h-1 w-8 bg-gray-600/50 hover:bg-gray-400/50 transition-colors overflow-hidden rounded-full cursor-pointer"
              aria-label={`Go to slide ${i + 1}`}
              // whileHover={{ scale: 1.1 }}
              // whileTap={{ scale: 0.95 }}
            >
              {i === index && (
                <motion.div
                  id={`progress-${index}`}
                  className="absolute inset-0 bg-red-600 rounded-full"
                  style={{ width: "0%", transition: "none" }}
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  // transition={{
                  //   duration: SLIDE_DURATION / 1000,
                  //   ease: "linear",
                  // }}
                />
              )}
            </motion.button>
          ))}
        </div>
      </motion.div>
    </motion.section>
  );
}
