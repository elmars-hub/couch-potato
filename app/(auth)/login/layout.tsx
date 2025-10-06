import type { Metadata } from "next";
import { generateAuthMetadata } from "@/lib/metadata";

export const metadata: Metadata = generateAuthMetadata("login");

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
