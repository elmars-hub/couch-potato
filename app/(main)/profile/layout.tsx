import type { Metadata } from "next";
import { generateProfileMetadata } from "@/lib/metadata";

export const metadata: Metadata = generateProfileMetadata();

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
