import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Play } from 'lucide-react'
import { motion, AnimatePresence } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { type Movie } from 'types'
import { useContentFetch } from "@/hooks/useContentFetch"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import PlusWatchlistButton from "../PlusWatchlistButton"

export default function TvHomePage() {

  const navigate = useNavigate()
  const [currentMovieIndex, setCurrentMovieIndex] = useState(0)
  const [watchlist, setWatchlist] = useState<number[]>([])

  const {
      popularTVShows,
      isLoading
    } = useContentFetch();

    const moviesData = popularTVShows;

  // Rotate background every 5 seconds
  useEffect(() => {
    if (moviesData.length === 0) return

    const interval = setInterval(() => {
      setCurrentMovieIndex((prev) => (prev + 1) % moviesData.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [moviesData])

  const handleMovieClick = useCallback((movieId: number) => {
    navigate(`/tv-videopage/${movieId}`)
  }, [navigate])


  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  const currentMovie = moviesData[currentMovieIndex]
  const nextMovies = [
    moviesData[(currentMovieIndex + 1) % moviesData.length],
    moviesData[(currentMovieIndex + 2) % moviesData.length],
    moviesData[(currentMovieIndex + 3) % moviesData.length],
  ]


  return (
    <main className="min-h-screen bg-[#0a1929] text-white overflow-hidden rounded-2xl">
      {/* Hero Section */}
      <section className="relative h-[80vh] mb-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentMovie.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0"
          >
            <img
              src={`https://image.tmdb.org/t/p/original${currentMovie.backdrop_path}`}
              alt={currentMovie.name}
              className="object-cover w-full h-full"
            />
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a1929] via-[#0a1929]/50 to-transparent" />

        <div className="absolute bottom-8 left-0 p-8 w-full">
          <div className="flex items-end justify-between -mt-96">
            <div className="max-w-2xl">
              <h2 className="text-4xl font-bold mb-4 line-clamp-1">{currentMovie.name}</h2>
              <div className="text-sm text-gray-300 mb-2 line-clamp-3">{currentMovie.overview}</div>
              <div className="flex items-center gap-3 pt-2">
                <Button
                  onClick={() => handleMovieClick(currentMovie.id)}
                  size="sm"
                  className="h-10 px-6 rounded-full bg-white hover:bg-white/90 text-black font-semibold transition-all duration-300"
                >
                  <Play className="mr-2 h-4 w-4 fill-black" />
                  Watch
                </Button>
                <PlusWatchlistButton
                  currentTv={currentMovie}
                  watchlist={watchlist}
                  setWatchlist={setWatchlist}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Next Movies Section */}
      <div className="px-8 -mt-72 mb-12 relative z-10">
        <div className="flex gap-4">
          {nextMovies.map((movie, index) => (
            <motion.div
              key={movie.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="relative w-80 h-44 rounded-2xl overflow-hidden cursor-pointer"
              onClick={() => handleMovieClick(movie.id)}
            >
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.backdrop_path}`}
                alt={movie.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
              {index === 0 && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-transform hover:scale-110">
                <div className="w-12 h-12 rounded-full bg-white/30 flex items-center justify-center backdrop-blur-sm">
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                    <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-black border-b-[6px] border-b-transparent ml-1" />
                  </div>
                </div>
              </div>
              )}
              <div className="absolute bottom-0 p-4">
                <h4 className="text-base font-medium line-clamp-1">{movie.name}</h4>
                <div className="text-sm text-gray-300 mt-1">Coming Next</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Trending This Week Section */}
      <section className="px-8 mb-12 mt-24">
        <h3 className="text-xl font-semibold mb-6">🔥 TRENDING THIS WEEK</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {moviesData.map((movie: Movie) => (
            <div
              key={movie.id}
              className="relative group cursor-pointer"
              onClick={() => handleMovieClick(movie.id)}
            >
              <div className="relative aspect-[2/3] rounded-lg overflow-hidden">
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.name}
                  className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="mt-2">
                <h4 className="font-semibold truncate">{movie.name}</h4>
                <div className="flex items-center justify-between text-sm text-gray-400">
                  <span>
                    {new Date(movie.first_air_date).toLocaleDateString('en-US', {
                      year: 'numeric',
                    })}
                  </span>
                  <span className="px-2 py-1 bg-white/10 rounded">⭐ {movie.vote_average.toFixed(1)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Coming Up Next Section */}
      <section className="px-8 mb-12">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold">🎬 COMING UP NEXT</h3>
        </div>
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {moviesData.slice(6).map((movie: Movie) => (
              <CarouselItem key={movie.id} className="pl-4 md:basis-1/2 lg:basis-1/6">
                <div
                  onClick={() => handleMovieClick(movie.id)}
                  className="relative group cursor-pointer"
                >
                  <div className="relative aspect-[2/3] rounded-lg overflow-hidden">
                    <img
                      src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                      alt={movie.name}
                      className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="mt-2">
                    <h4 className="font-semibold truncate">{movie.name}</h4>
                    <div className="flex items-center justify-between text-sm text-gray-400">
                      <span>
                        {new Date(movie.first_air_date).toLocaleDateString('en-US', {
                          year: 'numeric',
                        })}
                      </span>
                      <span className="px-2 py-1 bg-white/10 rounded">⭐ {movie.vote_average.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-8 bg-white/10 hover:bg-white/20 border-0" />
          <CarouselNext className="absolute right-0 top-1/2 -translate-y-1/2 h-8 w-8 bg-white/10 hover:bg-white/20 border-0" />
        </Carousel>
      </section>
    </main>
  )
}

