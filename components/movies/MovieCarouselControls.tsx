"use client";

import { useEffect } from "react";
import { Movie } from "@/types/movie";

interface MovieCarouselControlsProps {
  movies: Movie[];
  currentIndex: number;
  onSlideChange: (index: number) => void;
}

export function MovieCarouselControls({ 
  movies, 
  currentIndex, 
  onSlideChange 
}: MovieCarouselControlsProps) {
  // Progress bar animation
  useEffect(() => {
    const progressElement = document.getElementById(`progress-${currentIndex}`);
    if (!progressElement) return;

    // Reset animation
    progressElement.style.width = "0%";

    // Small delay to ensure reset is applied
    const timeout = setTimeout(() => {
      progressElement.style.transition = `width 7000ms linear`;
      progressElement.style.width = "100%";
    }, 50);

    return () => {
      clearTimeout(timeout);
      if (progressElement) {
        progressElement.style.transition = "none";
        progressElement.style.width = "0%";
      }
    };
  }, [currentIndex]);

  return (
    <div className="absolute bottom-8 right-10 md:right-8 z-30 flex items-center gap-3">
      <div className="flex gap-2">
        {movies.map((_, i) => (
          <button
            key={i}
            onClick={() => onSlideChange(i)}
            className="relative h-1 w-8 md:w-12 bg-gray-600/50 hover:bg-gray-400/50 transition-colors overflow-hidden rounded-full"
            aria-label={`Go to slide ${i + 1}`}
          >
            {i === currentIndex && (
              <div
                id={`progress-${currentIndex}`}
                className="absolute inset-0 bg-red-600 rounded-full"
                style={{ width: "0%", transition: "none" }}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
