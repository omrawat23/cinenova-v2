import axios from "axios";

const tmdbClient = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  headers: {
    accept: "application/json",
  },
});

tmdbClient.interceptors.request.use((config) => {
  const apiKey = import.meta.env.VITE_TMDB_API_KEY;

  if (!apiKey) {
    throw new Error("VITE_TMDB_API_KEY is not configured");
  }

  config.headers.Authorization = `Bearer ${apiKey}`;
  return config;
});

export default tmdbClient;
