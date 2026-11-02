import { useQuery } from "@tanstack/react-query";
import tmdbClient from "@/lib/tmdb";
import type { Movie, TvShow } from "types";

type ContentType = "movie" | "tv";
type ContentCategory = "popular" | "top_rated" | "upcoming";

const fetchContent = async <T,>(
  type: ContentType,
  category: ContentCategory,
  page: number,
  signal?: AbortSignal,
): Promise<T[]> => {
  const response = await tmdbClient.get<{ results: T[] }>(
    `/${type}/${category}`,
    {
      params: { language: "en-US", page },
      signal,
    },
  );

  return response.data.results;
};

export function useContentFetch() {
  const { data: popularMovies = [], isLoading: loadingPopularMovies } = useQuery<Movie[]>({
    queryKey: ["content", "movie", "popular", 1],
    queryFn: ({ signal }) => fetchContent<Movie>("movie", "popular", 1, signal),
  });

  const { data: topRatedMovies = [], isLoading: loadingTopRatedMovies } = useQuery<Movie[]>({
    queryKey: ["content", "movie", "top_rated", 1],
    queryFn: ({ signal }) => fetchContent<Movie>("movie", "top_rated", 1, signal),
  });

  const { data: popularTVShows = [], isLoading: loadingTVShows } = useQuery<TvShow[]>({
    queryKey: ["content", "tv", "top_rated", 1],
    queryFn: ({ signal }) => fetchContent<TvShow>("tv", "top_rated", 1, signal),
  });

  const { data: upcomingMovies = [], isLoading: loadingUpcomingMovies } = useQuery<Movie[]>({
    queryKey: ["content", "movie", "upcoming", 1],
    queryFn: ({ signal }) => fetchContent<Movie>("movie", "upcoming", 1, signal),
  });

  return {
    popularMovies,
    topRatedMovies,
    popularTVShows,
    upcomingMovies,
    isLoading:
      loadingPopularMovies ||
      loadingTopRatedMovies ||
      loadingTVShows ||
      loadingUpcomingMovies,
  };
}
