/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/prefer-as-const */
"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getImageUrl } from "@/lib/tmdb/fetcher";
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
  const type: "tv" = "tv";

  const { data: details, isLoading: loadingDetails } = useMediaDetails(
    type,
    tvshowId
  );
  const { data: credits } = useMediaCredits(type, tvshowId);
  const { data: videos } = useMediaVideos(type, tvshowId);

  if (loadingDetails)
    return (
      <main className="min-h-screen bg-[#141414] text-white mt-24 overflow-x-hidden">
        <div className="container mx-auto max-w-6xl px-4 py-8">
          <div className="relative h-56 sm:h-72 md:h-96 w-full bg-white/10 animate-pulse rounded" />
          <div className="flex flex-col md:flex-row gap-6 md:gap-8 mt-6">
            <div className="w-full md:w-1/3 h-72 sm:h-80 md:h-[500px] bg-white/10 rounded animate-pulse" />
            <div className="flex-1 space-y-4">
              <div className="h-8 w-2/3 bg-white/10 rounded animate-pulse" />
              <div className="h-4 w-full bg-white/10 rounded animate-pulse" />
              <div className="h-4 w-5/6 bg-white/10 rounded animate-pulse" />
              <div className="h-4 w-4/6 bg-white/10 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </main>
    );
  if (!details)
    return <p className="text-white p-4 text-center">No details found.</p>;

  const officialTrailer = videos?.find((v: Video) => v.type === "Trailer");

  return (
    <main className="min-h-screen text-white overflow-x-hidden">
      {/* Backdrop */}
      {details.backdrop_path && (
        <div className="relative h-56 sm:h-80 md:h-96 w-full">
          <Image
            src={getImageUrl(details.backdrop_path, "original")}
            alt={details.name ?? "Backdrop"}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/70 to-transparent" />
        </div>
      )}

      <div className="container mx-auto max-w-6xl px-4 py-6 sm:py-8 -mt-32 sm:-mt-40 md:-mt-48 lg:-mt-56 relative z-10">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Poster */}
          <div className="w-full lg:w-1/3 relative h-64 sm:h-72 md:h-80 lg:h-[500px] flex-shrink-0 rounded-lg overflow-hidden shadow-lg">
            <Image
              src={getImageUrl(details.poster_path)}
              alt={details.name ?? "Poster"}
              fill
              className="object-cover rounded-lg"
            />
          </div>

          {/* Details */}
          <div className="flex-1 flex flex-col gap-4">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">{details.name}</h1>
            <p className="text-gray-300 leading-relaxed text-sm sm:text-base">{details.overview}</p>
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
                <h2 className="text-xl font-semibold mb-2">Official Trailer</h2>
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
                <div className="flex overflow-x-auto gap-4 pb-2 -mx-4 px-4 md:mx-0 md:px-0">
                  {credits.slice(0, 6).map((cast: Cast) => (
                    <Link
                      href={`/person/${cast.id}`}
                      key={cast.id}
                      className="w-24 sm:w-28 flex-shrink-0 text-center"
                      prefetch
                    >
                      <div className="relative w-24 h-32 sm:w-28 sm:h-36 rounded overflow-hidden shadow hover:scale-105 transition-transform">
                        <Image
                          src={getImageUrl(cast.profile_path ?? null)}
                          alt={cast.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <p className="text-sm mt-1 font-medium">{cast.name}</p>
                      <p className="text-xs text-gray-400">{cast.character}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Related */}
            {Array.isArray((details as any)?.similar?.results) && (
              <div className="mt-8">
                <h2 className="text-2xl font-semibold mb-3">Related</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
                  {((details as any).similar.results as any[])
                    .slice(0, 12)
                    .map((s: any) => (
                      <Link
                        href={`/tvshows/${s.id}`}
                        key={s.id}
                        className="group relative"
                      >
                        <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-gray-800">
                          <Image
                            src={getImageUrl(s.poster_path, "w500")}
                            alt={s.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="mt-2 text-sm line-clamp-1">
                          {s.name}
                        </div>
                      </Link>
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
