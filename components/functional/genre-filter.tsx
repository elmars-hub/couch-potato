"use client";

import { useEffect, useState } from "react";
import { getGenres } from "@/lib/tmdb";

interface Genre {
  id: number;
  name: string;
}

export default function GenreFilter({
  type,
  value,
  onChange,
}: {
  type: "movie" | "tv";
  value?: string;
  onChange: (genreId: string | undefined) => void;
}) {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getGenres(type)
      .then((res: any) => setGenres(res.genres || []))
      .finally(() => setLoading(false));
  }, [type]);

  return (
    <div className="flex items-center gap-3 mb-6">
      <label className="text-white/80 text-sm">Genre</label>
      <select
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value || undefined)}
        className="bg-white/10 border border-white/10 text-white rounded px-3 py-2 text-sm outline-none"
      >
        <option value="" className="bg-[#141414]">All</option>
        {genres.map((g) => (
          <option key={g.id} value={String(g.id)} className="bg-[#141414]">
            {g.name}
          </option>
        ))}
      </select>
      {loading && <span className="text-white/50 text-xs">Loading...</span>}
    </div>
  );
}


