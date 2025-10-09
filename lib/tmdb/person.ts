import { fetchFromTMDB } from "./fetcher";

export async function getPerson(personId: string | number) {
  return fetchFromTMDB(`/person/${personId}`, {
    append_to_response: "combined_credits",
  });
}

