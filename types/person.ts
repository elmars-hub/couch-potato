export interface Person {
  id: number;
  name: string;
  biography: string | null;
  birthday: string | null;
  deathday: string | null;
  gender: number;
  homepage: string | null;
  imdb_id: string | null;
  known_for_department: string;
  place_of_birth: string | null;
  popularity: number;
  profile_path: string | null;
  adult: boolean;
  also_known_as: string[];
  combined_credits: CombinedCredits;
}

export interface CombinedCredits {
  cast: CombinedCast[];
  crew: CombinedCrew[];
}

export interface CombinedCast {
  id: number;
  title?: string;
  name?: string;
  character: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  media_type: "movie" | "tv";
  genre_ids?: number[];
  popularity: number;
  vote_average: number;
  vote_count: number;
  release_date?: string;
  first_air_date?: string;
  adult: boolean;
  original_language: string;
  original_title?: string;
  original_name?: string;
  origin_country?: string[];
  episode_count?: number;
  episode_run_time?: number[];
  genre_ids?: number[];
}

export interface CombinedCrew {
  id: number;
  title?: string;
  name?: string;
  job: string;
  department: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  media_type: "movie" | "tv";
  popularity: number;
  vote_average: number;
  vote_count: number;
  release_date?: string;
  first_air_date?: string;
  adult: boolean;
  original_language: string;
  original_title?: string;
  original_name?: string;
  origin_country?: string[];
  episode_count?: number;
  episode_run_time?: number[];
  genre_ids?: number[];
}
