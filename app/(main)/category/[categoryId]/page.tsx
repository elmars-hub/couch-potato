import { Suspense } from "react";
import { CategoryPageClient } from "./category-page-client";
import type { Category } from "@/lib/tmdb";

interface CategoryPageProps {
  params: Promise<{ id: string }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { id } = await params;
  const category = id as Category;

  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <CategoryPageClient category={category} />
    </Suspense>
  );
}
