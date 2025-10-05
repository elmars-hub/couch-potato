"use client";

import { useEffect, useState } from "react";
import { TvCarousel } from "@/components/main/tvcarousel";
import { getPopularTVShows, type TMDBResponse } from "@/lib/tmdb";

export default function CategorySectionTV({ title }: { title: string }) {
  const [data, setData] = useState<TMDBResponse | null>(null);

  useEffect(() => {
    let isMounted = true;
    getPopularTVShows(1).then((res) => {
      if (isMounted) setData(res);
    });
    return () => {
      isMounted = false;
    };
  }, []);

  if (!data) return null;

  return <TvCarousel tvshows={data as any} />;
}


