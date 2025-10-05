import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Toaster } from "react-hot-toast";

const GeistSans = Inter({ subsets: ["latin"], variable: "--font-sans" });
const GeistMono = Inter({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "Couch Potato",
  description: "Your ultimate movie and TV show companion",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`font-sans ${GeistSans.variable} ${GeistMono.variable} bg-[#141414] text-white antialiased`}
      >
        <Providers>{children}</Providers>

        <Toaster position="top-center" reverseOrder={false} />
      </body>
    </html>
  );
}
