import Navbar from "@/components/navbar/navbar";
import HeroCarousel from "@/components/main/herocarousel";

export default function HomePage() {
  return (
    <main className="mx-auto ">
      <Navbar />
      <HeroCarousel />
    </main>
  );
}
