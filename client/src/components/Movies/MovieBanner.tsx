import { useState, useEffect, useMemo } from "react";
import PlusWatchlistButton from "../PlusWatchlistButton";
import { Button } from "@/components/ui/button";
import { Play, MoreHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Movie } from "types";

type MovieBannerProps = {
  movies: Movie[];
};

export default function MovieBanner({ movies }: MovieBannerProps) {
  const [currentMovieIndex, setCurrentMovieIndex] = useState(0);
  const [watchlist, setWatchlist] = useState<number[]>([]);
  const navigate = useNavigate();

  const currentMovie = useMemo(
    () => movies[currentMovieIndex],
    [movies, currentMovieIndex]
  );

  // Automatic sliding logic
  useEffect(() => {
    if (movies.length < 2) return;
    const interval = setInterval(() => {
      setCurrentMovieIndex((prevIndex) =>
        (prevIndex + 1) % movies.length
      );
    }, 5000); // Slide every 5 seconds
    return () => clearInterval(interval); // Cleanup
  }, [movies.length]);

  const handleMovieClick = (movieId: number) => {
    navigate(`/videopage/${movieId}`);
  };

  if (movies.length === 0 || !currentMovie) {
    return (
      <div className="w-full h-[300px] sm:h-[400px] md:h-[500px] bg-gradient-to-br from-purple-900/10 to-pink-600/5 animate-pulse rounded-2xl sm:rounded-3xl">
        <div className="h-full w-full bg-muted/20 backdrop-blur-xl rounded-2xl sm:rounded-3xl" />
      </div>
    );
  }

  return (
    <div className="relative w-full h-[300px] sm:h-[400px] md:h-[415px] lg:h-[480px] xl:h-[500px] overflow-hidden rounded-[28px] border border-white/10">
      <div className="absolute inset-0 transition-opacity duration-1000 ease-in-out">
        <img
          src={`https://image.tmdb.org/t/p/original${currentMovie.backdrop_path}`}
          alt={currentMovie.title}
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0b0d12] via-[#0b0d12]/65 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0d12] via-transparent to-black/20" />
      </div>

      <div className="relative h-full flex flex-col justify-end p-4 sm:p-6 md:p-8 lg:p-10">
        <div className="max-w-3xl space-y-2 sm:space-y-4">
          <div className="mb-3 inline-flex w-fit items-center gap-2 rounded-full border border-[#6B97FF]/30 bg-[#6B97FF]/10 px-3 py-1 text-xs font-medium text-[#cbd7ff]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#6B97FF]" />
            Featured tonight
          </div>
          <h1 className="text-2xl font-medium leading-[0.98] tracking-[-0.04em] text-white sm:text-3xl md:text-5xl lg:text-6xl">
            {currentMovie.title}
          </h1>

          <p className="max-w-2xl text-sm font-normal leading-relaxed text-white/70 sm:text-base md:text-lg">
            {currentMovie.overview}
          </p>

          <div className="flex items-center gap-3 pt-2">
            <Button
              onClick={() => handleMovieClick(currentMovie.id)}
              size="sm"
              className="h-10 rounded-full bg-[#6B97FF] px-6 font-medium text-[#0b0d12] transition-all duration-300 hover:bg-[#86aaff] hover:shadow-[0_0_30px_rgba(107,151,255,0.25)]"
            >
              <Play className="mr-2 h-4 w-4 fill-black" />
              Watch
            </Button>

            <PlusWatchlistButton
              currentMovie={currentMovie}
              watchlist={watchlist}
              setWatchlist={setWatchlist}
            />

            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 text-white"
            >
              <MoreHorizontal className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
