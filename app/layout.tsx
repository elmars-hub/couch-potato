import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { Toaster } from "react-hot-toast";

const GeistSans = Inter({ subsets: ["latin"], variable: "--font-sans" });
const GeistMono = Inter({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "Couch Potato",
  description: "Your ultimate movie and TV show companion",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Hydrate initial user on the server to avoid client fetch on first paint
  const supabase = await createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  let initialUser = null;
  if (authUser) {
    initialUser = await prisma.user.findUnique({ where: { id: authUser.id } });
  }
  return (
    <html lang="en">
      <body
        className={`font-sans ${GeistSans.variable} ${GeistMono.variable} bg-[#141414] text-white antialiased`}
      >
        <Providers initialUser={initialUser}>{children}</Providers>

        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
          }}
        />
      </body>
    </html>
  );
}
