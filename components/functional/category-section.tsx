"use client";

import { useEffect, useState } from "react";
import { CategoryCarousel } from "@/components/functional/category-carousel";
import { getMoviesByCategory } from "@/lib/tmdb/movies";
import type { TMDBResponse } from "@/lib/tmdb/fetcher";

export default function CategorySection({
  title,
  categoryId,
}: {
  title: string;
  categoryId: string;
}) {
  const [data, setData] = useState<TMDBResponse | null>(null);

  useEffect(() => {
    let isMounted = true;
    getMoviesByCategory(categoryId as any, 1).then((res) => {
      if (isMounted) setData(res);
    });
    return () => {
      isMounted = false;
    };
  }, [categoryId]);

  if (!data) return null;

  return (
    <CategoryCarousel
      title={title}
      movies={data.results.slice(0, 15) as any}
      categoryId={categoryId}
    />
  );
}


