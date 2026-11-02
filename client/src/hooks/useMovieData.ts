import { useQuery } from "@tanstack/react-query";
import tmdbClient from "@/lib/tmdb";

const fetchMovieData = async (movieId: string, signal?: AbortSignal) => {
  const [movieRes, castRes, similarRes, imagesRes] = await Promise.all([
    tmdbClient.get(`/movie/${movieId}`, { params: { language: "en-US" }, signal }),
    tmdbClient.get(`/movie/${movieId}/credits`, { params: { language: "en-US" }, signal }),
    tmdbClient.get(`/movie/${movieId}/similar`, { params: { language: "en-US" }, signal }),
    tmdbClient.get(`/movie/${movieId}/images`, { signal }),
  ]);

  return {
    movie: movieRes.data,
    cast: castRes.data.cast?.slice(0, 7) ?? [],
    similar: similarRes.data.results?.slice(0, 6) ?? [],
    images: {
      backdrops: imagesRes.data.backdrops?.slice(0, 8) ?? [],
      posters: imagesRes.data.posters?.slice(0, 4) ?? [],
    },
  };
};

export function useMovieData(movieId: string) {
  return useQuery({
    queryKey: ["movieData", movieId],
    queryFn: ({ signal }) => fetchMovieData(movieId, signal),
    enabled: Boolean(movieId),
  });
}
