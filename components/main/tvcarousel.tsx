/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, Info } from "lucide-react";
import { getImageUrl } from "@/lib/tmdb";

const MAX_CONTENT_WIDTH_CLASS = "max-w-[1800px]";
const SLIDE_DURATION = 7000;
const PROGRESS_RESET_DELAY_MS = 80;

interface TvShow {
  id: number;
  name: string; // ✅ TV shows use "name" instead of "title"
  backdrop_path: string | null;
  poster_path: string | null;
  overview: string;
  vote_average: number;
  first_air_date: string;
}

interface TvshowsResponse {
  results: TvShow[];
  page: number;
  total_pages: number;
  total_results: number;
}

interface TvCarouselProps {
  tvshows: TvshowsResponse;
}

export function TvCarousel({ tvshows }: TvCarouselProps) {
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // ✅ Slice the TV shows (not movies)
  const displayShows = tvshows?.results?.slice(0, 8) || [];

  useEffect(() => {
    if (!displayShows.length || isPaused) return;

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % displayShows.length);
    }, SLIDE_DURATION);

    return () => clearInterval(interval);
  }, [displayShows.length, isPaused]);

  // Progress bar animation (robust reset between slides)
  useEffect(() => {
    const progressElement = document.getElementById(`progress-${index}`);
    if (!progressElement || isPaused) return;

    progressElement.style.width = "0%";

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

  const goToSlide = (i: number) => setIndex(i);

  if (!displayShows.length) {
    return (
      <div className="h-[70vh] flex items-center justify-center bg-[#141414]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400">Loading featured TV shows...</p>
        </div>
      </div>
    );
  }

  const currentShow = displayShows[index];
  const currentImage = getImageUrl(
    currentShow.backdrop_path || currentShow.poster_path,
    "original"
  );

  return (
    <section
      className="relative w-full h-[70vh] md:h-[75vh] lg:h-[80vh] overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slides */}
      {displayShows.map((show, i) => {
        const img = getImageUrl(
          show.backdrop_path || show.poster_path,
          "original"
        );

        return (
          <div
            key={show.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              i === index ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            <Image
              src={img}
              alt={show.name}
              fill
              priority={i === index}
              className="object-cover object-top"
            />

            {/* Gradients */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/70 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#141414]/90 via-[#141414]/40 to-transparent" />
          </div>
        );
      })}

      {/* Overlay Content */}
      <div
        className={`absolute inset-0 z-20 mx-auto ${MAX_CONTENT_WIDTH_CLASS} w-full`}
      >
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-10 lg:p-16 space-y-6">
          <div className="max-w-2xl space-y-4">
            {/* Badge */}
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-red-600 text-white text-xs font-bold uppercase tracking-wider rounded">
                Trending TV Shows
              </span>
              <span className="text-gray-300 text-sm">
                {index + 1} / {displayShows.length}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white drop-shadow-2xl leading-tight">
              {currentShow.name}
            </h1>

            {/* Info */}
            <div className="flex items-center gap-3 text-sm md:text-base">
              <span className="px-2 py-1 bg-yellow-500 text-black font-bold rounded text-xs">
                {currentShow.vote_average.toFixed(1)}
              </span>
              <span className="text-gray-200 font-medium">
                {currentShow.first_air_date?.split("-")[0]}
              </span>
            </div>

            {/* Overview */}
            <p className="text-gray-200 text-base md:text-lg line-clamp-3 leading-relaxed max-w-xl drop-shadow-lg">
              {currentShow.overview}
            </p>

            {/* Buttons */}
            <div className="flex flex-wrap gap-3 pt-2 mb-10">
              <Link href={`/tvshows/${currentShow.id}`}>
                <button className="flex items-center gap-2 px-6 py-3 rounded-md bg-white text-black font-semibold hover:bg-white/90 transition-all shadow-lg hover:scale-105 transform duration-200">
                  <Play className="w-5 h-5 fill-current" />
                  Watch Now
                </button>
              </Link>

              <Link href={`/tvshows/${currentShow.id}`}>
                <button className="flex items-center gap-2 px-6 py-3 rounded-md bg-gray-500/70 backdrop-blur-sm text-white font-semibold hover:bg-gray-500/90 transition-all border border-gray-400/30">
                  <Info className="w-5 h-5" />
                  More Info
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="absolute bottom-8 right-10 md:right-8 z-30 flex items-center gap-3">
        {displayShows.map((_, i) => (
          <button
            key={i}
            onClick={() => goToSlide(i)}
            className="relative h-1 w-8 md:w-12 bg-gray-600/50 hover:bg-gray-400/50 transition-colors overflow-hidden rounded-full"
            aria-label={`Go to slide ${i + 1}`}
          >
            {i === index && (
              <div
                id={`progress-${index}`}
                className="absolute inset-0 bg-red-600 rounded-full"
                style={{ width: "0%", transition: "none" }}
              />
            )}
          </button>
        ))}
      </div>
    </section>
  );
}
