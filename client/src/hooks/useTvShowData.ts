import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const apiKey = import.meta.env.VITE_TMDB_API_KEY3;

const fetchTvShowData = async (movieId: string) => {
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
  };

  const [tvRes, castRes, similarRes, imagesRes] = await Promise.all([
    axios.get(`https://api.themoviedb.org/3/tv/${movieId}?language=en-US`, options),
    axios.get(`https://api.themoviedb.org/3/tv/${movieId}/credits?language=en-US`, options),
    axios.get(`https://api.themoviedb.org/3/tv/${movieId}/similar?language=en-US`, options),
    axios.get(`https://api.themoviedb.org/3/tv/${movieId}/images`, options)
  ]);

  return {
    tvShow: tvRes.data,
    cast: castRes.data.cast.slice(0, 7),
    similar: similarRes.data.results.slice(0, 6),
    images: {
      backdrops: imagesRes.data.backdrops.slice(0, 8),
      posters: imagesRes.data.posters.slice(0, 4)
    }
  };
};

export function useTvShowData(movieId: string) {
  return useQuery({
    queryKey: ['tvShowData', movieId],
    queryFn: () => fetchTvShowData(movieId),
    enabled: !!movieId,
  });
}

const fetchEpisodes = async (movieId: string, selectedSeason: number) => {
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
  };
  const res = await axios.get(`https://api.themoviedb.org/3/tv/${movieId}/season/${selectedSeason}?language=en-US`, options);
  return res.data.episodes;
};

export function useEpisodes(movieId: string, selectedSeason: number) {
  return useQuery({
    queryKey: ['episodes', movieId, selectedSeason],
    queryFn: () => fetchEpisodes(movieId, selectedSeason),
    enabled: !!movieId && !!selectedSeason,
  });
}
