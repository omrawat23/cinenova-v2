import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { type Movie } from '@/types/movie';

interface MovieCarouselProps {
  movies: Movie[];
  onMovieClick: (movieId: number) => void;
}

const MovieCarousel: React.FC<MovieCarouselProps> = ({ movies, onMovieClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 6;

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex + 1 >= movies.length - itemsPerPage ? 0 : prevIndex + 1
    );
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex - 1 < 0 ? movies.length - itemsPerPage - 1 : prevIndex - 1
    );
  };

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-4">
      <h3 className="text-xl font-semibold mb-6">🎬 COMING UP NEXT</h3>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 text-white"
            onClick={handlePrev}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 text-white"
            onClick={handleNext}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="overflow-hidden">
      <motion.div
          className="flex gap-6"
          animate={{
            x: `${-currentIndex * (100 / itemsPerPage)}%`
          }}
          transition={{
            duration: 0.5,
            ease: "easeInOut"
          }}
        >
          {movies.map((movie) => (
            <motion.div
              key={movie.id}
              className="relative flex-none w-[calc(100%-16px)] sm:w-[calc(50%-12px)] md:w-[calc(33.333%-16px)] lg:w-[calc(25%-18px)] xl:w-[calc(16.666%-20px)]"
              onClick={() => onMovieClick(movie.id)}
            >
              <div className="relative aspect-[2/3] rounded-lg overflow-hidden group cursor-pointer">
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="mt-2">
                <h4 className="font-semibold text-sm text-white truncate">
                  {movie.title}
                </h4>
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>
                    {new Date(movie.release_date).getFullYear()}
                  </span>
                  <span className="px-2 py-1 bg-white/10 rounded">
                    ⭐ {movie.vote_average.toFixed(1)}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default MovieCarousel;

