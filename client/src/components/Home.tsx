// HomePage.tsx
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import useEmblaCarousel from "embla-carousel-react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import MovieBanner from "./Movies/MovieBanner";
import MovieCard from "./Card";

// Define types for Movie and TVShow
interface Movie {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
  runtime?: number;
  release_date: string;
  genre_ids: number[];
}

interface TVShow {
  id: number;
  name: string;
  poster_path: string;
  vote_average: number;
  first_air_date: string;
  genre_ids: number[];
}

export default function HomePage() {
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [topRatedMovies, setTopRatedMovies] = useState<Movie[]>([]);
  const [popularTVShows, setPopularTVShows] = useState<TVShow[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { page } = useParams();

  // Carousels for different sections
  const [popularMoviesEmblaRef, popularMoviesEmblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    slidesToScroll: 1,
  });

  const [topRatedMoviesEmblaRef, topRatedMoviesEmblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    slidesToScroll: 1,
  });

  const [popularTVShowsEmblaRef, popularTVShowsEmblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    slidesToScroll: 1,
  });

  // Scroll functions for each carousel
  const scrollPrev = useCallback((emblaApi: any) => emblaApi && emblaApi.scrollPrev(), []);
  const scrollNext = useCallback((emblaApi: any) => emblaApi && emblaApi.scrollNext(), []);

  // Fetch function for different types of content
  const fetchContent = useCallback(async (type: 'movie' | 'tv', category: 'popular' | 'top_rated', page: number = 1) => {
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
  console.log('API Response:', response.data.results[0]); // Log the first item

  if (type === 'movie' && category === 'popular') {
    setPopularMovies(response.data.results);
  } else if (type === 'movie' && category === 'top_rated') {
    setTopRatedMovies(response.data.results);
  } else if (type === 'tv' && category === 'top_rated') {
    setPopularTVShows(response.data.results);
  }
} catch (error) {
  console.error(`Error fetching ${type} ${category}:`, error);
} finally {
  setLoading(false);
    }
  }, []);

  // Fetch content on component mount
  useEffect(() => {
    const currentPage = parseInt(page || "1", 10);
    fetchContent('movie', 'popular', currentPage);
    fetchContent('movie', 'top_rated', currentPage);
    fetchContent('tv', 'top_rated', currentPage);
  }, [page, fetchContent]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  // Reusable carousel render function
  const renderCarousel = (
    title: string,
    items: Movie[] | TVShow[],
    emblaRef: React.RefObject<HTMLDivElement>,
    emblaApi: any,
    type: 'movie' | 'tv'
  ) => (
    <div className="max-w-8xl mt-4 mx-auto">
      <div className="flex items-center justify-between mb-4 ml-2">
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            className="md:flex bg-white/10 backdrop-blur-md hover:bg-white/20 border-0 rounded-full w-10 h-10"
            onClick={() => scrollPrev(emblaApi)}
          >
            <ChevronLeft className="h-5 w-5 text-white" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="md:flex bg-white/10 backdrop-blur-md hover:bg-white/20 border-0 rounded-full w-10 h-10"
            onClick={() => scrollNext(emblaApi)}
          >
            <ChevronRight className="h-5 w-5 text-white" />
          </Button>
        </div>
      </div>
      <div className="relative">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex pl-4">
          {items.map((item) => (
              <div
                key={item.id}
                className="flex-[0_0_50%] sm:flex-[0_0_50%] md:flex-[0_0_33.33%] lg:flex-[0_0_20%] xl:flex-[0_0_14.5%] px-2 mb-4"
              >
                <MovieCard
                  id={item.id}
                  type={type}
                  title={type === 'movie' ? (item as Movie).title : (item as TVShow).name}
                  posterPath={item.poster_path}
                  voteAverage={item.vote_average}
                  runtime={type === 'movie' ? (item as Movie).runtime : undefined}
                  releaseDate={type === 'movie' ? (item as Movie).release_date : (item as TVShow).first_air_date}
                  genreIds={item.genre_ids}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <MovieBanner />
      <div className="w-full space-y-10">
        {renderCarousel(
          "Popular Movies",
          popularMovies,
          popularMoviesEmblaRef,
          popularMoviesEmblaApi,
          'movie'
        )}

        {renderCarousel(
          "Top Rated Movies",
          topRatedMovies,
          topRatedMoviesEmblaRef,
          topRatedMoviesEmblaApi,
          'movie'
        )}

        {renderCarousel(
          "Top Rated TV Shows",
          popularTVShows,
          popularTVShowsEmblaRef,
          popularTVShowsEmblaApi,
          'tv'
        )}

        <p className="hidden sm:flex justify-center items-center mt-6 mb-6 text-gray-600">
          This site does not store any files on the server; we only link to the media hosted on 3rd party services.
        </p>
      </div>
    </div>
  );
}

