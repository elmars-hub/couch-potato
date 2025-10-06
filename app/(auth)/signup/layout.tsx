import type { Metadata } from "next";
import { generateAuthMetadata } from "@/lib/metadata";

export const metadata: Metadata = generateAuthMetadata("signup");

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
