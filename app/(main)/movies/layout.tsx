import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Movies",
  description:
    "Browse and discover the latest movies. Find popular films, top-rated movies, and explore different genres on Couch Potato.",
  keywords: [
    "movies",
    "films",
    "cinema",
    "entertainment",
    "popular movies",
    "top rated",
    "genres",
  ],
  openGraph: {
    title: "Movies | Couch Potato",
    description:
      "Browse and discover the latest movies. Find popular films, top-rated movies, and explore different genres.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Movies | Couch Potato",
    description:
      "Browse and discover the latest movies. Find popular films, top-rated movies, and explore different genres.",
  },
};

export default function MoviesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
