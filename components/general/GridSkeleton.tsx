import React from "react";

interface GridSkeletonProps {
  count?: number;
  className?: string;
}

export function GridSkeleton({ count = 12, className = "" }: GridSkeletonProps) {
  return (
    <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mt-8 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="relative aspect-[2/3] bg-white/10 rounded-lg animate-pulse" />
      ))}
    </div>
  );
}
