import Link from "next/link";
import { Play, Info } from "lucide-react";
import { Movie } from "@/types/movie";
import { formatRating } from "@/helpers/rating";
import { getYear } from "@/helpers/date";

interface MovieCarouselContentProps {
  movie: Movie;
}

export function MovieCarouselContent({ movie }: MovieCarouselContentProps) {
  return (
    <div className="absolute inset-0 z-20 mx-auto max-w-[1800px] w-full">
      <div className="absolute bottom-0 left-0 w-full p-6 md:p-10 lg:p-16 space-y-6">
        <div className="max-w-2xl space-y-4">
          {/* Featured badge */}
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-red-600 text-white text-xs font-bold uppercase tracking-wider rounded">
              Trending Movies
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white drop-shadow-2xl leading-tight">
            {movie.title}
          </h1>

          {/* Movie Info */}
          <div className="flex items-center gap-3 text-sm md:text-base">
            <span className="px-2 py-1 bg-yellow-500 text-black font-bold rounded text-xs">
              {formatRating(movie.vote_average)}
            </span>
            <span className="text-gray-200 font-medium">
              {getYear(movie.release_date)}
            </span>
            <span className="text-gray-400">•</span>
            <span className="text-gray-300">
              {Math.floor(Math.random() * 60) + 90} min
            </span>
          </div>

          {/* Overview */}
          <p className="text-gray-200 text-base md:text-lg line-clamp-3 leading-relaxed max-w-xl drop-shadow-lg">
            {movie.overview}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 pt-2 mb-10">
            <Link href={`/movies/${movie.id}`}>
              <button className="flex items-center gap-2 px-6 py-3 rounded-md bg-white text-black font-semibold hover:bg-white/90 transition-all shadow-lg hover:scale-105 transform duration-200">
                <Play className="w-5 h-5 fill-current" />
                Play Now
              </button>
            </Link>

            <Link href={`/movies/${movie.id}`}>
              <button className="flex items-center gap-2 px-6 py-3 rounded-md bg-gray-500/70 backdrop-blur-sm text-white font-semibold hover:bg-gray-500/90 transition-all border border-gray-400/30">
                <Info className="w-5 h-5" />
                More Info
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
