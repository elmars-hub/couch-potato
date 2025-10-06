import type { Metadata } from "next";
import { getPerson } from "@/lib/tmdb";
import { generatePersonMetadata } from "@/lib/metadata";

type Props = {
  params: { personId: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const personId = params.personId;

  try {
    const person = await getPerson(personId);
    return generatePersonMetadata(person);
  } catch (error) {
    console.error("Failed to fetch person metadata:", error);
    return {
      title: "Person Not Found",
      description: "The requested person could not be found.",
    };
  }
}

export default function PersonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
