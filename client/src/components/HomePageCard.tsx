'use client'

import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import { Play } from 'lucide-react'

const GENRE_MAP: { [key: number]: string } = {
  28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy", 80: "Crime",
  99: "Documentary", 18: "Drama", 10751: "Family", 14: "Fantasy", 36: "History",
  27: "Horror", 10402: "Music", 9648: "Mystery", 10749: "Romance", 878: "Science Fiction",
  10770: "TV Movie", 53: "Thriller", 10752: "War", 37: "Western", 10766: "Soap",
  10759: "Action & Adventure", 10762: "Kids", 10763: "News", 10764: "Reality",
  10765: "Sci-Fi & Fantasy", 10767: "Talk", 10768: "War & Politics"
}

interface MovieCardProps {
  type: 'movie' | 'tv'
  id: number
  title: string
  posterPath: string
  voteAverage: number
  releaseDate: string
  genreIds: number[]
}


export default function MovieCard({
  type,
  id,
  title,
  posterPath,
  voteAverage,
  releaseDate,
  genreIds,
}: MovieCardProps) {
  const router = useNavigate()
  const [, setIsHovered] = useState(false)

  const year = new Date(releaseDate).getFullYear()
  const ratingProgress = (voteAverage / 10) * 100
  const primaryGenre = genreIds?.length > 0 ? GENRE_MAP[genreIds[0]] : ''


  const handleMovieClick = useCallback(() => {
    if (type === 'tv') {
      router(`/tv-videopage/${id}`)
    } else {
      router(`/videopage/${id}`)
    }
  }, [id, router, type])

  return (
    <Card
      onClick={handleMovieClick}
      className="group relative w-full cursor-pointer border-none bg-transparent transition-transform duration-300 ease-out hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-[2/3] overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] shadow-[0_18px_50px_rgba(0,0,0,0.22)]">
        <img
          src={`https://image.tmdb.org/t/p/w500${posterPath}`}
          alt={title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105 group-hover:opacity-45"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="flex h-full flex-col items-center justify-end p-4">
            <div className="absolute left-2 top-2">
              <span className="rounded-full border border-[#6B97FF]/40 bg-[#6B97FF]/15 px-2 py-0.5 text-xs font-medium text-[#cbd7ff]">
                HD
              </span>
            </div>
            <div className="absolute right-2 top-2">
              <div className="relative h-12 w-12">
                <svg className="h-full w-full" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.2)"
                    strokeWidth="3"
                  />
                  <path
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#6B97FF"
                    strokeWidth="3"
                    strokeDasharray={`${ratingProgress}, 100`}
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-white">
                  {voteAverage.toFixed(1)}
                </span>
              </div>
            </div>

            <button
              className="mb-4 rounded-full border border-white/20 bg-white/10 p-3 backdrop-blur-md transition-transform hover:scale-110"
              aria-label={`Play ${title}`}
            >
              <Play className="h-5 w-5 fill-white text-white" />
            </button>

            <div className="w-full space-y-1 text-white">
              <h3 className="text-base font-medium line-clamp-2">{title}</h3>
              <div className="flex items-center gap-2 text-sm opacity-75 flex-wrap">
                <span>{year}</span>
                {primaryGenre && (
                  <>
                    <span>•</span>
                    <span>{primaryGenre}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* <div className="mt-2 space-y-0.5 p-2">
        <h3 className="text-sm font-medium text-white line-clamp-1">{title}</h3>
        <p className="text-xs text-gray-400">{year}</p>
      </div> */}
    </Card>
  )
}
