import Image from "next/image";
import { getImageUrl } from "@/helpers/url";
import { Movie } from "@/types/movie";

interface MovieCarouselSlideProps {
  movies: Movie[];
  currentIndex: number;
}

export function MovieCarouselSlide({
  movies,
  currentIndex,
}: MovieCarouselSlideProps) {
  return (
    <>
      {movies.map((movie, i) => {
        const images = getImageUrl(
          movie.backdrop_path || movie.poster_path,
          "original"
        );

        return (
          <div
            key={movie.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              i === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            <Image
              src={images}
              alt={movie.title}
              fill
              priority={i === currentIndex}
              className="object-cover object-top"
            />

            {/* Enhanced gradient overlays for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/70 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#141414]/90 via-[#141414]/40 to-transparent" />
          </div>
        );
      })}
    </>
  );
}
