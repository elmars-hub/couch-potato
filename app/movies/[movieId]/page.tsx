"use client";

import Image from "next/image";
import { useParams, useSearchParams } from "next/navigation";
import { getImageUrl } from "@/lib/tmdb";
import {
  useMediaCredits,
  useMediaDetails,
  useMediaVideos,
  Cast,
  Video,
} from "@/hooks/useMedia";
import { FavoriteButton } from "@/components/favoriteButton";
import WatchlistButton from "@/components/watchlistButton";

export default function MovieDetailsPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const movieId = params.movieId as string;
  const type = (searchParams.get("type") ?? "movie") as "movie" | "tv";

  // Fetch data using hooks
  const { data: details, isLoading: loadingDetails } = useMediaDetails(
    type,
    movieId
  );
  const { data: credits } = useMediaCredits(type, movieId);
  const { data: videos } = useMediaVideos(type, movieId);

  // Handle loading / empty states
  if (loadingDetails)
    return <p className="text-white p-4 text-center">Loading...</p>;
  if (!details)
    return <p className="text-white p-4 text-center">No details found.</p>;

  // Only one official trailer
  const officialTrailer = videos?.find((v: Video) => v.type === "Trailer");

  return (
    <main className="min-h-screen bg-gray-900 text-white">
      {/* Backdrop */}
      {details.backdrop_path && (
        <div className="relative h-64 sm:h-80 md:h-96 w-full">
          <Image
            src={getImageUrl(details.backdrop_path, "original")}
            alt={details.title ?? details.name ?? "Backdrop"}
            fill
            className="object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent" />
        </div>
      )}

      <div className="container mx-auto px-4 py-8 -mt-48 md:-mt-64 relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Poster */}
          <div className="w-full md:w-1/3 relative h-80 md:h-[500px] flex-shrink-0 rounded-lg overflow-hidden shadow-lg">
            <Image
              src={getImageUrl(details.poster_path)}
              alt={details.title ?? details.name ?? "Poster"}
              fill
              className="object-cover rounded-lg"
            />
          </div>

          {/* Details */}
          <div className="flex-1 flex flex-col gap-4">
            <h1 className="text-3xl sm:text-4xl font-bold">
              {details.title ?? details.name}
            </h1>
            <p className="text-gray-300 leading-relaxed">{details.overview}</p>
            <p className="text-gray-200">
              <strong>Genres:</strong>{" "}
              {details.genres.map((g) => g.name).join(", ")}
            </p>
            <p className="text-gray-200">
              <strong>
                {type === "movie" ? "Release Date:" : "First Air Date:"}
              </strong>{" "}
              {details.release_date ?? details.first_air_date}
            </p>

            {/* Official Trailer */}
            {officialTrailer && (
              <div>
                <h2 className="text-2xl font-semibold mb-2">
                  Official Trailer
                </h2>
                <a
                  href={`https://www.youtube.com/watch?v=${officialTrailer.key}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-800 px-4 py-2 rounded hover:bg-gray-700 transition"
                  aria-label={`Watch trailer: ${officialTrailer.name}`}
                >
                  {officialTrailer.name}
                </a>
              </div>
            )}

            <div className="mt-4 flex gap-4">
              <FavoriteButton mediaId={details.id} mediaType={type} />
              <WatchlistButton mediaId={details.id} mediaType={type} />
            </div>

            {/* Cast */}
            {credits?.length > 0 && (
              <div>
                <h2 className="text-2xl font-semibold mb-2">Cast</h2>
                <div className="flex overflow-x-auto gap-4 pb-2">
                  {credits.slice(0, 6).map((cast: Cast) => (
                    <div
                      key={cast.id}
                      className="w-28 flex-shrink-0 text-center"
                    >
                      <div className="relative w-28 h-36 rounded overflow-hidden shadow hover:scale-105 transition-transform">
                        <Image
                          src={getImageUrl(cast.profile_path)}
                          alt={cast.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <p className="text-sm mt-1 font-medium">{cast.name}</p>
                      <p className="text-xs text-gray-400">{cast.character}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
