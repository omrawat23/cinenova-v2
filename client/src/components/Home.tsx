import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import MovieBanner from "./Movies/MovieBanner";
import MovieCard from "./Card";
import type { Movie, TvShow } from "types";

export default function HomePage() {
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [topRatedMovies, setTopRatedMovies] = useState<Movie[]>([]);
  const [popularTVShows, setPopularTVShows] = useState<TvShow[]>([]);
  const [loading, setLoading] = useState(true);


  // Fetch function for different types of content
  const fetchContent = useCallback(
    async (type: "movie" | "tv", category: "popular" | "top_rated", page: number = 1) => {
      const apiKey = import.meta.env.VITE_TMDB_API_KEY;
      const options = {
        method: "GET",
        url: `https://api.themoviedb.org/3/${type}/${category}?language=en-US&page=${page}`,
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
      };

      try {
        setLoading(true);
        const response = await axios.request(options);
        console.log("API Response:", response.data.results[0]); // Log the first item

        if (type === "movie" && category === "popular") {
          setPopularMovies(response.data.results);
        } else if (type === "movie" && category === "top_rated") {
          setTopRatedMovies(response.data.results);
        } else if (type === "tv" && category === "top_rated") {
          setPopularTVShows(response.data.results);
        }
      } catch (error) {
        console.error(`Error fetching ${type} ${category}:`, error);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Fetch content on component mount
  useEffect(() => {
    const currentPage = 1;
    fetchContent("movie", "popular", currentPage);
    fetchContent("movie", "top_rated", currentPage);
    fetchContent("tv", "top_rated", currentPage);
  }, [fetchContent]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  // Reusable carousel render function
  const renderCarousel = (
    title: string,
    items: Movie[] | TvShow[],
    type: "movie" | "tv"
  ) => (
    <div className="max-w-8xl mt-4 mx-auto">
      <Carousel
         opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
         <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl md:text-2xl font-bold text-white">{title}</h2>
          <div className="flex gap-2 relative">
            <CarouselPrevious className=" static translate-y-0 h-8 w-8 bg-white/10 hover:bg-white/20 border-0" />
            <CarouselNext className=" static translate-y-0 h-8 w-8 bg-white/10 hover:bg-white/20 border-0" />
          </div>
        </div>
        <CarouselContent className="-ml-2 md:-ml-4">
          {items.map((item) => (
            <CarouselItem key={item.id} className="pl-2 md:pl-4 flex-[0_0_50%] sm:flex-[0_0_50%] md:flex-[0_0_33.33%] lg:flex-[0_0_20%] xl:flex-[0_0_14.5%]">
              <MovieCard
                type={type}
                id={item.id}
                title={type === "movie" ? (item as Movie).title : (item as TvShow).name}
                posterPath={item.poster_path}
                voteAverage={item.vote_average}
                releaseDate={
                  type === "movie"
                    ? (item as Movie).release_date
                    : (item as TvShow).first_air_date
                }
                genreIds={item.genre_ids}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );

  return (
    <div className="space-y-4">
      <MovieBanner />
      <div className="w-full space-y-8">
        {renderCarousel("Popular Movies", popularMovies, "movie")}
        {renderCarousel("Top Rated Movies", topRatedMovies, "movie")}
        {renderCarousel("Top Rated TV Shows", popularTVShows, "tv")}
        <p className="hidden sm:flex justify-center items-center mt-6 mb-6 text-gray-600">
          This site does not store any files on the server; we only link to the media hosted on
          3rd party services.
        </p>
      </div>
    </div>
  );
}

