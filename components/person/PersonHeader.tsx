"use client";

import Image from "next/image";
import { getImageUrl } from "@/lib/tmdb";

interface PersonHeaderProps {
  name: string;
  profilePath: string | null;
  biography?: string | null;
}

export default function PersonHeader({ name, profilePath, biography }: PersonHeaderProps) {
  return (
    <div className="flex gap-6 flex-col md:flex-row">
      <div className="w-40 h-56 relative rounded overflow-hidden bg-gray-800 flex-shrink-0">
        <Image
          src={getImageUrl(profilePath, "w500")}
          alt={name}
          fill
          className="object-cover"
        />
      </div>
      <div className="flex-1">
        <h1 className="text-3xl font-bold mb-2">{name}</h1>
        {biography && (
          <p className="text-white/80 leading-relaxed whitespace-pre-line">
            {biography}
          </p>
        )}
      </div>
    </div>
  );
}


