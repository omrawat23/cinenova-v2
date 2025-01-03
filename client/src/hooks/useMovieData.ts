import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const apiKey = import.meta.env.VITE_TMDB_API_KEY2;

const fetchMovieData = async (movieId: string) => {
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
  };

  const [movieRes, castRes, similarRes, imagesRes] = await Promise.all([
    axios.get(`https://api.themoviedb.org/3/movie/${movieId}?language=en-US`, options),
    axios.get(`https://api.themoviedb.org/3/movie/${movieId}/credits?language=en-US`, options),
    axios.get(`https://api.themoviedb.org/3/movie/${movieId}/similar?language=en-US`, options),
    axios.get(`https://api.themoviedb.org/3/movie/${movieId}/images`, options)
  ]);

  return {
    movie: movieRes.data,
    cast: castRes.data.cast.slice(0, 7),
    similar: similarRes.data.results.slice(0, 6),
    images: {
      backdrops: imagesRes.data.backdrops.slice(0, 8),
      posters: imagesRes.data.posters.slice(0, 4)
    }
  };
};

export function useMovieData(movieId: string) {
  return useQuery({
    queryKey: ['movieData', movieId],
    queryFn: () => fetchMovieData(movieId),
    enabled: !!movieId,
  });
}

