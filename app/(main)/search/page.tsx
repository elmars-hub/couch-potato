/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearch } from "@/hooks/useSearch";
import Image from "next/image";
import Link from "next/link";
import { getImageUrl } from "@/lib/tmdb";
import { useRouter } from "next/navigation";

export default function SearchPage() {
  const [input, setInput] = useState("");
  const [query, setQuery] = useState("");
  const [recent, setRecent] = useState<string[]>([]);
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);

  // Debounce
  useEffect(() => {
    const t = setTimeout(() => setQuery(input.trim()), 300);
    return () => clearTimeout(t);
  }, [input]);

  useEffect(() => {
    const stored = localStorage.getItem("recent-searches");
    if (stored) setRecent(JSON.parse(stored));
  }, []);

  const { data, isLoading } = useSearch(query, 1);
  const results = useMemo(() => data?.results ?? [], [data]);
  const router = useRouter();

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!results.length) return;
      const cols = 6;
      if (e.key === "ArrowRight")
        setFocusedIndex((i) => Math.min(i + 1, results.length - 1));
      if (e.key === "ArrowLeft") setFocusedIndex((i) => Math.max(i - 1, 0));
      if (e.key === "ArrowDown")
        setFocusedIndex((i) =>
          Math.min((i < 0 ? 0 : i) + cols, results.length - 1)
        );
      if (e.key === "ArrowUp")
        setFocusedIndex((i) => Math.max((i < 0 ? 0 : i) - cols, 0));
      if (e.key === "Enter" && focusedIndex >= 0) {
        const item: any = results[focusedIndex];
        const href =
          item.media_type === "tv"
            ? `/tvshows/${item.id}`
            : `/movies/${item.id}?type=movie`;
        window.location.href = href;
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [results, focusedIndex]);

  function saveRecent(term: string) {
    if (!term) return;
    const next = [term, ...recent.filter((r) => r !== term)].slice(0, 8);
    setRecent(next);
    localStorage.setItem("recent-searches", JSON.stringify(next));
  }

  function clearRecent() {
    setRecent([]);
    localStorage.removeItem("recent-searches");
  }

  return (
    <main className="min-h-screen bg-[#141414] text-white">
      <div className="container mx-auto px-4 pt-28 pb-10">
        <div className="max-w-3xl mx-auto">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Search for movies, TV shows..."
            className="w-full bg-white/10 border border-white/10 rounded-md px-4 py-3 outline-none focus:border-white/30 placeholder:text-white/50"
          />
          {recent.length > 0 && !query && (
            <div className="mt-4 text-white/60 text-sm">
              <div className="flex items-center justify-between mb-2">
                <span>Recent searches</span>
                <button
                  onClick={clearRecent}
                  className="text-white/50 hover:text-white/80 cursor-pointer"
                >
                  Clear
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {recent.map((r) => (
                  <button
                    key={r}
                    onClick={() => {
                      setInput(r);
                      setQuery(r);
                    }}
                    className="px-3 py-1 bg-white/10 hover:bg-white/20 cursor-pointer rounded-full"
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mt-8">
          {!query && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Top Searches</h2>
              <div className="flex flex-wrap gap-2 ">
                {[
                  "Top Rated",
                  "Action",
                  "Comedy",
                  "Horror",
                  "Anime",
                  "Popular",
                ].map((t) => {
                  const map: Record<string, string> = {
                    "Top Rated": "top-rated",
                    Popular: "popular",
                    Action: "action",
                    Comedy: "comedy",
                    Horror: "horror",
                    Anime: "anime",
                  };
                  const category = map[t] || "popular";
                  return (
                    <button
                      key={t}
                      onClick={() => {
                        saveRecent(t);
                        router.push(`/category/${category}`);
                      }}
                      className="px-3 cursor-pointer py-1 bg-white/10 hover:bg-white/20 rounded-full"
                    >
                      {t}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
          {isLoading && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className="relative aspect-[2/3] bg-white/10 rounded animate-pulse"
                />
              ))}
            </div>
          )}

          {!isLoading && query && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {results.map((item: any, i: number) => {
                const href =
                  item.media_type === "tv"
                    ? `/tvshows/${item.id}`
                    : item.media_type === "person"
                    ? `/person/${item.id}`
                    : `/movies/${item.id}?type=movie`;
                return (
                  <Link
                    key={`${item.media_type}-${item.id}`}
                    href={href}
                    className={`group outline-none ${
                      focusedIndex === i ? "ring-2 ring-red-600 rounded" : ""
                    }`}
                  >
                    <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-gray-800">
                      <Image
                        src={getImageUrl(
                          item.poster_path || item.profile_path,
                          "w500"
                        )}
                        alt={item.title || item.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="mt-2 text-sm line-clamp-1">
                      {item.title || item.name}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
