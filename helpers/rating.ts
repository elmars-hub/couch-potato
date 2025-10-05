/**
 * Format rating to 1 decimal place
 */
export function formatRating(rating: number | null | undefined): string {
  if (!rating) return "N/A";
  return rating.toFixed(1);
}

/**
 * Get rating color based on score
 */
export function getRatingColor(rating: number | null | undefined): string {
  if (!rating) return "text-gray-400";
  
  if (rating >= 8) return "text-green-500";
  if (rating >= 6) return "text-yellow-500";
  if (rating >= 4) return "text-orange-500";
  return "text-red-500";
}

/**
 * Get rating emoji based on score
 */
export function getRatingEmoji(rating: number | null | undefined): string {
  if (!rating) return "❓";
  
  if (rating >= 8) return "🔥";
  if (rating >= 6) return "👍";
  if (rating >= 4) return "👌";
  return "👎";
}
