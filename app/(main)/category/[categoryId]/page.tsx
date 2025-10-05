import { Suspense } from "react";
import { CategoryPageClient } from "./category-page-client";
import type { Category } from "@/lib/tmdb";

interface CategoryPageProps {
  params: { categoryId: string };
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const category = params.categoryId as Category;

  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <CategoryPageClient category={category} />
    </Suspense>
  );
}
