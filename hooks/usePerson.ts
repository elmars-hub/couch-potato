import { useQuery } from "@tanstack/react-query";
import { getPerson } from "@/lib/tmdb/person";

export function usePerson(personId: string | number) {
  return useQuery({
    queryKey: ["person", personId],
    queryFn: () => getPerson(personId),
    enabled: !!personId,
    staleTime: 1000 * 60 * 10,
  });
}


