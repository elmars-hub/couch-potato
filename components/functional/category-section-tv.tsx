"use client";

import { useEffect, useState } from "react";
import { TvCarousel } from "@/components/tv/TvCarousel";
import { getPopularTVShows } from "@/lib/tmdb/tv";
import type { TMDBResponse } from "@/lib/tmdb/fetcher";

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


