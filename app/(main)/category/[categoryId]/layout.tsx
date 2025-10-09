/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Metadata } from "next";
import { getMoviesByCategory } from "@/lib/tmdb/movies";
import { generateCategoryMetadata } from "@/lib/metadata";

type Props = {
  params: { categoryId: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const categoryId = params.categoryId;

  try {
    const data = await getMoviesByCategory(categoryId as any, 1);
    return generateCategoryMetadata(categoryId, data.results);
  } catch (error) {
    console.error("Failed to fetch category metadata:", error);
    return {
      title: "Category Not Found",
      description: "The requested category could not be found.",
    };
  }
}

export default function CategoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
