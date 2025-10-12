/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Metadata } from "next";

// Base metadata for the app
export const baseMetadata: Metadata = {
  title: {
    default: "Couch Potato",
    template: "%s | Couch Potato",
  },
  description:
    "Your ultimate movie and TV show companion. Discover, watch, and track your favorite films and series.",
  keywords: [
    "movies",
    "TV shows",
    "entertainment",
    "streaming",
    "reviews",
    "ratings",
  ],
  authors: [{ name: "Couch Potato Team" }],
  creator: "Couch Potato",
  publisher: "Couch Potato",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  ),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Couch Potato",
    title: "Couch Potato",
    description: "Your ultimate movie and TV show companion",
    images: [
      {
        url: "/cinema-bg.jpeg",
        width: 1200,
        height: 630,
        alt: "Couch Potato - Movie and TV Show Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Couch Potato",
    description: "Your ultimate movie and TV show companion",
    images: ["/cinema-bg.jpeg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
};

// Generate movie metadata
export function generateMovieMetadata(movie: any): Metadata {
  const title = movie.title || movie.name || "Unknown Movie";
  const description =
    movie.overview ||
    `Watch ${title} and discover more about this ${
      movie.media_type || "movie"
    }.`;
  const releaseYear = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : "";
  const yearSuffix = releaseYear ? ` (${releaseYear})` : "";

  return {
    title: `${title}${yearSuffix}`,
    description:
      description.length > 160
        ? description.substring(0, 157) + "..."
        : description,
    keywords: [
      title,
      movie.media_type || "movie",
      ...(movie.genres?.map((g: any) => g.name) || []),
      releaseYear,
      "movie",
      "film",
      "entertainment",
    ],
    openGraph: {
      title: `${title}${yearSuffix}`,
      description,
      type: "video.movie",
      images: movie.poster_path
        ? [
            {
              url: `https://image.tmdb.org/t/p/w1280${movie.poster_path}`,
              width: 1280,
              height: 1920,
              alt: `${title} poster`,
            },
            ...(movie.backdrop_path
              ? [
                  {
                    url: `https://image.tmdb.org/t/p/w1920${movie.backdrop_path}`,
                    width: 1920,
                    height: 1080,
                    alt: `${title} backdrop`,
                  },
                ]
              : []),
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: `${title}${yearSuffix}`,
      description,
      images: movie.poster_path
        ? [`https://image.tmdb.org/t/p/w1280${movie.poster_path}`]
        : undefined,
    },
  };
}

// Generate person metadata
export function generatePersonMetadata(person: any): Metadata {
  const name = person.name || "Unknown Person";
  const description = person.biography
    ? person.biography.length > 160
      ? person.biography.substring(0, 157) + "..."
      : person.biography
    : `Learn more about ${name}, their filmography, and career highlights.`;

  return {
    title: name,
    description,
    keywords: [
      name,
      "actor",
      "actress",
      "director",
      "producer",
      "filmography",
      "movies",
      "TV shows",
      "entertainment",
    ],
    openGraph: {
      title: name,
      description,
      type: "profile",
      images: person.profile_path
        ? [
            {
              url: `https://image.tmdb.org/t/p/w1280${person.profile_path}`,
              width: 1280,
              height: 1920,
              alt: `${name} profile photo`,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: name,
      description,
      images: person.profile_path
        ? [`https://image.tmdb.org/t/p/w1280${person.profile_path}`]
        : undefined,
    },
  };
}

// Generate category metadata
export function generateCategoryMetadata(
  category: string,
  items?: any[]
): Metadata {
  const categoryTitles: Record<string, string> = {
    trending: "Trending Movies",
    popular: "Popular Movies",
    "top-rated": "Top Rated Movies",
    "now-playing": "Now Playing Movies",
    upcoming: "Upcoming Movies",
    action: "Action Movies",
    comedy: "Comedy Movies",
    drama: "Drama Movies",
    horror: "Horror Movies",
    romance: "Romance Movies",
    thriller: "Thriller Movies",
    animation: "Animation Movies",
    documentary: "Documentary Movies",
    hollywood: "Hollywood Movies",
  };

  const title =
    categoryTitles[category] ||
    `${category.charAt(0).toUpperCase() + category.slice(1)} Movies`;
  const description = `Discover the best ${title.toLowerCase()}. Browse through our curated collection of ${
    items?.length || "popular"
  } movies in this category.`;

  return {
    title,
    description,
    keywords: [
      category,
      "movies",
      "entertainment",
      "streaming",
      "film",
      "cinema",
    ],
    openGraph: {
      title,
      description,
      type: "website",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

// Generate search metadata
export function generateSearchMetadata(
  query: string,
  results?: any[]
): Metadata {
  const title = `Search Results for "${query}"`;
  const description = results?.length
    ? `Found ${results.length} results for "${query}". Discover movies, TV shows, and more.`
    : `Search for "${query}" and discover movies, TV shows, and more.`;

  return {
    title,
    description,
    robots: {
      index: false,
      follow: true,
    },
    openGraph: {
      title,
      description,
      type: "website",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

// Generate profile metadata
export function generateProfileMetadata(userName?: string): Metadata {
  const title = userName ? `${userName}'s Profile` : "Profile";
  const description =
    "Manage your movie preferences, favorites, and watchlist on Couch Potato.";

  return {
    title,
    description,
    robots: {
      index: false, // Don't index user profiles
      follow: true,
    },
    openGraph: {
      title,
      description,
      type: "profile",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

// Generate auth page metadata
export function generateAuthMetadata(type: "login" | "signup"): Metadata {
  const title = type === "login" ? "Sign In" : "Sign Up";
  const description =
    type === "login"
      ? "Sign in to your Couch Potato account to access your favorites and watchlist."
      : "Create your Couch Potato account to start tracking your favorite movies and TV shows.";

  return {
    title,
    description,
    robots: {
      index: false, // Don't index auth pages
      follow: true,
    },
    openGraph: {
      title,
      description,
      type: "website",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}
