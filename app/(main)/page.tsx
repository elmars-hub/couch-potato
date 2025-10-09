import type { Metadata } from "next";
import { CategoryCarousel } from "@/components/functional/category-carousel";
import { HeroCarousel } from "@/components/main/herocarousel";
import { getMoviesByCategory, getNowPlayingMovies } from "@/lib/tmdb/movies";
import HomeInfiniteFeed from "@/components/functional/home-infinite-feed";

export const metadata: Metadata = {
  title: "Home",
  description: "Discover the latest movies and TV shows. Browse trending content, popular films, and find your next favorite entertainment on Couch Potato.",
  keywords: ["movies", "TV shows", "trending", "popular", "entertainment", "streaming", "discover"],
  openGraph: {
    title: "Couch Potato - Discover Movies & TV Shows",
    description: "Discover the latest movies and TV shows. Browse trending content, popular films, and find your next favorite entertainment.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Couch Potato - Discover Movies & TV Shows",
    description: "Discover the latest movies and TV shows. Browse trending content, popular films, and find your next favorite entertainment.",
  },
};

export default async function HomePage() {
  const movies = await getNowPlayingMovies();

  const [trending, hollywood, popular, topRated, action, horror, animation] =
    await Promise.all([
      getMoviesByCategory("trending"),
      getMoviesByCategory("hollywood"),
      getMoviesByCategory("popular"),
      getMoviesByCategory("top-rated"),
      getMoviesByCategory("action"),
      getMoviesByCategory("horror"),
      getMoviesByCategory("animation"),
    ]);

  return (
    <main className="mx-auto ">
      <HeroCarousel movies={movies} />

      <div className="space-y-8 pb-16">
        <CategoryCarousel
          title="Trending Now"
          movies={trending.results.slice(0, 15)}
          categoryId="trending"
        />
        <CategoryCarousel
          title="Hollywood Movie"
          movies={hollywood.results.slice(0, 15)}
          categoryId="hollywood"
        />
        <CategoryCarousel
          title="Popular Movies"
          movies={popular.results.slice(0, 15)}
          categoryId="popular"
        />
        <CategoryCarousel
          title="Top Rated"
          movies={topRated.results.slice(0, 15)}
          categoryId="top-rated"
        />
        <CategoryCarousel
          title="Action Movies"
          movies={action.results.slice(0, 15)}
          categoryId="action"
        />
        <CategoryCarousel
          title="Horror Movies"
          movies={horror.results.slice(0, 15)}
          categoryId="horror"
        />
        <CategoryCarousel
          title="Animation"
          movies={animation.results.slice(0, 15)}
          categoryId="animation"
        />
      </div>

      {/* Infinite feeds */}
      <div className="container mx-auto px-4 pb-24">
        <HomeInfiniteFeed />
      </div>
    </main>
  );
}
