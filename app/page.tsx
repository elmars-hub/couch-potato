import { HeroCarousel } from "@/components/main/herocarousel";
import { getNowPlayingMovies } from "@/lib/tmdb";

export default async function HomePage() {
  const movies = await getNowPlayingMovies();

  return (
    <main className="mx-auto ">
      <HeroCarousel movies={movies} />
    </main>
  );
}
