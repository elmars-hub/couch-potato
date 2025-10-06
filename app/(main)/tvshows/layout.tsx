import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "TV Shows",
  description: "Browse and discover the latest TV shows and series. Find popular shows, top-rated series, and explore different genres on Couch Potato.",
  keywords: ["TV shows", "series", "television", "entertainment", "popular shows", "top rated", "genres"],
  openGraph: {
    title: "TV Shows | Couch Potato",
    description: "Browse and discover the latest TV shows and series. Find popular shows, top-rated series, and explore different genres.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TV Shows | Couch Potato",
    description: "Browse and discover the latest TV shows and series. Find popular shows, top-rated series, and explore different genres.",
  },
};

export default function TVShowsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
