import type { Metadata } from "next";
import { getMediaDetails } from "@/lib/tmdb/search";
import { generateMovieMetadata } from "@/lib/metadata";

type Props = {
  params: Promise<{ movieId: string }>;
  searchParams: Promise<{ type?: string }>;
};

export async function generateMetadata({
  params,
  searchParams,
}: Props): Promise<Metadata> {
  const { movieId } = await params;
  const resolvedSearchParams = await searchParams;
  const type = (resolvedSearchParams?.type ?? "movie") as "movie" | "tv";

  try {
    const movie = await getMediaDetails(type, movieId);
    return generateMovieMetadata(movie);
  } catch (error) {
    console.error("Failed to fetch movie metadata:", error);
    return {
      title: "Movie Not Found",
      description: "The requested movie could not be found.",
    };
  }
}

export default function MovieLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
