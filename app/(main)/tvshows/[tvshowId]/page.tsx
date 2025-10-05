/* eslint-disable @typescript-eslint/prefer-as-const */
"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import { getImageUrl } from "@/lib/tmdb";
import {
  useMediaCredits,
  useMediaDetails,
  useMediaVideos,
  Cast,
  Video,
} from "@/hooks/useMedia";
import { FavoriteButton } from "@/components/functional/favoriteButton";
import WatchlistButton from "@/components/functional/watchlistButton";

export default function TvShowDetailsPage() {
  const params = useParams();
  const tvshowId = params.tvshowId as string;
  const type: "tv" = "tv"; // fixed for this route

  // Fetch data
  const { data: details, isLoading: loadingDetails } = useMediaDetails(
    type,
    tvshowId
  );
  const { data: credits } = useMediaCredits(type, tvshowId);
  const { data: videos } = useMediaVideos(type, tvshowId);

  if (loadingDetails)
    return <p className="text-white p-4 text-center">Loading...</p>;
  if (!details)
    return <p className="text-white p-4 text-center">No details found.</p>;

  const officialTrailer = videos?.find((v: Video) => v.type === "Trailer");

  return (
    <main className="min-h-screen bg-gray-900 text-white">
      {/* Backdrop */}
      {details.backdrop_path && (
        <div className="relative h-64 sm:h-80 md:h-96 w-full">
          <Image
            src={getImageUrl(details.backdrop_path, "original")}
            alt={details.name ?? "Backdrop"}
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
              alt={details.name ?? "Poster"}
              fill
              className="object-cover rounded-lg"
            />
          </div>

          {/* Details */}
          <div className="flex-1 flex flex-col gap-4">
            <h1 className="text-3xl sm:text-4xl font-bold">{details.name}</h1>
            <p className="text-gray-300 leading-relaxed">{details.overview}</p>
            <p className="text-gray-200">
              <strong>Genres:</strong>{" "}
              {details.genres.map((g: any) => g.name).join(", ")}
            </p>
            <p className="text-gray-200">
              <strong>First Air Date:</strong> {details.first_air_date}
            </p>

            {/* Trailer */}
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
