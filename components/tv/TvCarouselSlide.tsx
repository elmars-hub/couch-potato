import Image from "next/image";
import { getImageUrl } from "@/helpers/url";
import { TVShow } from "@/types/tv";

interface TvCarouselSlideProps {
  shows: TVShow[];
  currentIndex: number;
}

export function TvCarouselSlide({ shows, currentIndex }: TvCarouselSlideProps) {
  return (
    <>
      {shows.map((show, i) => {
        const img = getImageUrl(
          show.backdrop_path || show.poster_path,
          "original"
        );

        return (
          <div
            key={show.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              i === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            <Image
              src={img}
              alt={show.name}
              fill
              priority={i === currentIndex}
              className="object-cover object-top"
            />

            {/* Gradients */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/70 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#141414]/90 via-[#141414]/40 to-transparent" />
          </div>
        );
      })}
    </>
  );
}
