import { getTrendingMovies, getPopularMovies } from "@/lib/tmdb";
import { MovieCarousel } from "@/components/movies/MovieCarousel";
import CategorySection from "@/components/functional/category-section";
import MoviesClient from "./movies-client";

export default async function MoviesPage() {
  // Pre-fetch data on the server
  const [trendingMovies, popularMovies] = await Promise.all([
    getTrendingMovies(),
    getPopularMovies(1),
  ]);

  return (
    <>
      <MovieCarousel movies={trendingMovies.results ?? []} />

      <main className="min-h-screen bg-[#141414] py-8">
        <div className="container mx-auto px-4">
          <div className="space-y-8 pb-6">
            <CategorySection title="Trending Now" categoryId="trending" />
          </div>

          <MoviesClient initialMovies={popularMovies.results} />
        </div>
      </main>
    </>
  );
}
