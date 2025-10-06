import { getTrendingTVShows, getPopularTVShows } from "@/lib/tmdb";
import { TvCarousel } from "@/components/tv/TvCarousel";
import TvShowsClient from "./tvshows-client";

export default async function TvshowPage() {
  // Pre-fetch data on the server
  const [trendingTVShows, popularTVShows] = await Promise.all([
    getTrendingTVShows(),
    getPopularTVShows(1),
  ]);

  return (
    <>
      <TvCarousel tvshows={trendingTVShows.results ?? []} />

      <main className="min-h-screen bg-[#141414] py-8">
        <div className="container mx-auto px-4">
          <TvShowsClient initialTVShows={popularTVShows.results} />
        </div>
      </main>
    </>
  );
}
