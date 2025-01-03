import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchContent = async (
  type: "movie" | "tv",
  category: "popular" | "top_rated" | "upcoming",
  page: number = 1
) => {
  const apiKey = import.meta.env.VITE_TMDB_API_KEY;
  const response = await axios.get(
    `https://api.themoviedb.org/3/${type}/${category}`,
    {
      params: {
        language: "en-US",
        page,
      },
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    }
  );

  return response.data.results;
};

export function useContentFetch() {
  const { data: popularMovies = [], isLoading: loadingPopularMovies } = useQuery({
    queryKey: ["popularMovies"],
    queryFn: () => fetchContent("movie", "popular"),
  });

  const { data: topRatedMovies = [], isLoading: loadingTopRatedMovies } = useQuery({
    queryKey: ["topRatedMovies"],
    queryFn: () => fetchContent("movie", "top_rated"),
  });

  const { data: popularTVShows = [], isLoading: loadingTVShows } = useQuery({
    queryKey: ["popularTVShows"],
    queryFn: () => fetchContent("tv", "top_rated"),
  });

  const { data: upcomingMovies = [], isLoading: loadingUpcomingMovies } = useQuery({
    queryKey: ["upcomingMovies"],
    queryFn: () => fetchContent("movie", "upcoming"),
  });

  const isLoading = loadingPopularMovies || loadingTopRatedMovies || loadingTVShows || loadingUpcomingMovies;

  return {
    popularMovies,
    topRatedMovies,
    popularTVShows,
    upcomingMovies,
    isLoading
  };
}