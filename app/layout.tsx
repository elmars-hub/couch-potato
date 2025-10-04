import type React from "react";
import type { Metadata } from "next";

import { Inter } from "next/font/google";
const GeistSans = Inter({ subsets: ["latin"], variable: "--font-sans" });
const GeistMono = Inter({ subsets: ["latin"], variable: "--font-mono" });
import "./globals.css";
import { Providers } from "./providers";
import Navbar from "@/components/navbar/navbar";

export const metadata: Metadata = {
  title: "Couch Potato",
  description: "Your ultimate movie and TV show companion",
  generator: "v0.app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`font-sans ${GeistSans.variable} ${GeistMono.variable} bg-[#141414] text-white antialiased overflow-hidden`}
      >
        <Providers>
          <Navbar />

          {children}
        </Providers>
      </body>
    </html>
  );
}
