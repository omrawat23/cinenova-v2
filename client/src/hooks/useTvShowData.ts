import { useQuery } from "@tanstack/react-query";
import tmdbClient from "@/lib/tmdb";

const fetchTvShowData = async (movieId: string, signal?: AbortSignal) => {
  const [tvRes, castRes, similarRes, imagesRes] = await Promise.all([
    tmdbClient.get(`/tv/${movieId}`, { params: { language: "en-US" }, signal }),
    tmdbClient.get(`/tv/${movieId}/credits`, { params: { language: "en-US" }, signal }),
    tmdbClient.get(`/tv/${movieId}/similar`, { params: { language: "en-US" }, signal }),
    tmdbClient.get(`/tv/${movieId}/images`, { signal }),
  ]);

  return {
    tvShow: tvRes.data,
    cast: castRes.data.cast?.slice(0, 7) ?? [],
    similar: similarRes.data.results?.slice(0, 6) ?? [],
    images: {
      backdrops: imagesRes.data.backdrops?.slice(0, 8) ?? [],
      posters: imagesRes.data.posters?.slice(0, 4) ?? [],
    },
  };
};

export function useTvShowData(movieId: string) {
  return useQuery({
    queryKey: ["tvShowData", movieId],
    queryFn: ({ signal }) => fetchTvShowData(movieId, signal),
    enabled: Boolean(movieId),
  });
}

const fetchEpisodes = async (
  movieId: string,
  selectedSeason: number,
  signal?: AbortSignal,
) => {
  const response = await tmdbClient.get(
    `/tv/${movieId}/season/${selectedSeason}`,
    { params: { language: "en-US" }, signal },
  );
  return response.data.episodes ?? [];
};

export function useEpisodes(movieId: string, selectedSeason: number) {
  return useQuery({
    queryKey: ["episodes", movieId, selectedSeason],
    queryFn: ({ signal }) => fetchEpisodes(movieId, selectedSeason, signal),
    enabled: Boolean(movieId) && selectedSeason > 0,
  });
}
