import type { Metadata } from "next";
import { getMediaDetails } from "@/lib/tmdb/search";
import { generateMovieMetadata } from "@/lib/metadata";

type Props = {
  params: { tvshowId: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const tvshowId = params.tvshowId;

  try {
    const tvshow = await getMediaDetails("tv", tvshowId);
    return generateMovieMetadata(tvshow);
  } catch (error) {
    console.error("Failed to fetch TV show metadata:", error);
    return {
      title: "TV Show Not Found",
      description: "The requested TV show could not be found.",
    };
  }
}

export default function TVShowLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
