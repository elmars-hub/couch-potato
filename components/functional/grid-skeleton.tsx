"use client";

export default function GridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="relative aspect-[2/3] bg-white/10 rounded animate-pulse" />
      ))}
    </div>
  );
}


