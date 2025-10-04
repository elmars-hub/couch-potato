// src/hooks/useTrending.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const baseUrl = "https://api.themoviedb.org/3";
const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;

export type MediaType = "movie" | "tv";

interface TrendingResult {
  id: number;
  title?: string; // movies
  name?: string; // tv shows
  poster_path: string | null;
  media_type: MediaType;
}

export const useTrending = (timeWindow: "day" | "week" = "week") => {
  return useQuery<TrendingResult[]>({
    queryKey: ["trending", timeWindow],
    queryFn: async () => {
      const { data } = await axios.get(
        `${baseUrl}/trending/all/${timeWindow}?api_key=${apiKey}`
      );
      return data.results;
    },
  });
};
