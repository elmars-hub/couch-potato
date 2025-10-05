/**
 * Generate TMDB image URL
 */
export function getImageUrl(path: string | null, size: string = "w500"): string {
  if (!path) return "/placeholder-movie.jpg";
  return `https://image.tmdb.org/t/p/${size}${path}`;
}

/**
 * Generate avatar URL from email
 */
export function getAvatarUrl(email: string, size: number = 40): string {
  const hash = email.split("").reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(email)}&size=${size}&background=random&color=fff&bold=true&format=png&hash=${Math.abs(hash)}`;
}

/**
 * Generate movie/TV show URL
 */
export function getMediaUrl(mediaType: "movie" | "tv", id: number): string {
  if (mediaType === "tv") {
    return `/tvshows/${id}`;
  }
  return `/movies/${id}?type=movie`;
}

/**
 * Generate person URL
 */
export function getPersonUrl(personId: number): string {
  return `/person/${personId}`;
}

/**
 * Generate category URL
 */
export function getCategoryUrl(categoryId: string): string {
  return `/category/${categoryId}`;
}
