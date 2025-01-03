export interface Season {
  season_number: number;
  name: string;
  episode_count: number;
}

export interface Episode {
  episode_number: number;
  name: string;
  still_path: string | null;
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

export interface SimilarShow {
  id: number;
  name: string;
  poster_path: string | null;
}

export interface ImageData {
  backdrops: { file_path: string }[];
  posters: { file_path: string }[];
  file_path: string
}

export interface Movie {
  adult: boolean;
  backdrop_path: string;
  genre_ids: [];
  id: number;
  imdb_id: string;
  overview: string;
  poster_path: string;
  release_date: string;
  runtime: number | undefined;
  tagline: string;
  title: string;
  vote_average: number;
  name: string;
  first_air_date: number;
  media_type: string;
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

export interface SimilarMovie {
  id: number;
  title: string;
  poster_path: string | null;
}

export interface ImageData {
  backdrops: { file_path: string }[];
  posters: { file_path: string }[];
}

export interface Genre {
  id: number;
  name: string;
}



export interface TvShow {
  id: number;
  name: string;
  first_air_date: string;
  episode_run_time: number[];
  overview: string;
  backdrop_path: string;
  seasons: Season[];
  adult: boolean;
  genre_ids: number[];
  origin_country: string[];
  original_language: string;
  original_name: string;
  popularity: number;
  poster_path: string;
  vote_average: number;
  vote_count: number;
  media_type: string;

  release_date: string;
  title: string;
}

export interface SearchResponse {
  results: Movie[];
  total_pages: number;
  total_results: number;
}

