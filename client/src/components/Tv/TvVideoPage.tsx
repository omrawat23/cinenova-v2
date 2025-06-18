import { useState,useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Play, User2, ImageIcon, ChevronDown} from 'lucide-react'
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { Episode, TvShow, CastMember, ImageData, Season } from 'types'
import { useTvShowData, useEpisodes } from '@/hooks/useTvShowData'
import PlusWatchlistButton from '../PlusWatchlistButton'
import SecureIframePlayer from '@/components/SecureIframePlayer'

export default function TvVideoPage() {
  const { movieId } = useParams<{ movieId: string }>()
  const navigate = useNavigate()
  const [showVideo, setShowVideo] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [selectedSeason, setSelectedSeason] = useState<number>(1)
  const [selectedEpisode, setSelectedEpisode] = useState<number>(1)
  const [displayedEpisodes, setDisplayedEpisodes] = useState<number>(25)
  const [showSeasonSelect, setShowSeasonSelect] = useState(false)
  const [showEpisodeSelect, setShowEpisodeSelect] = useState(false)
  const [watchlist, setWatchlist] = useState<number[]>([])

  const { data: tvShowData, isLoading, error } = useTvShowData(movieId || '')
  const { data: episodes = [] } = useEpisodes(movieId || '', selectedSeason)

    useEffect(() => {
      const handleMessage = (event: MessageEvent) => {
        if (event.origin !== 'https://vidlink.pro') return;

        if (event.data?.type === 'MEDIA_DATA') {
          const mediaData = event.data.data;
          localStorage.setItem('vidLinkProgress', JSON.stringify(mediaData));
        }
      };

      window.addEventListener('message', handleMessage);

      return () => {
        window.removeEventListener('message', handleMessage);
      };
    }, []);

  const handleSimilarMovieClick = (similarMovieId: number) => {
    navigate(`/tv-videopage/${similarMovieId}`)
  }

  const handleLoadMore = () => {
    setDisplayedEpisodes(prev => prev + 25)
  }

  if (isLoading) return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
    </div>
  )

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-red-900 text-red-100 p-4 rounded-lg">
        Error: {error.message}
      </div>
    </div>
  )

  if (!tvShowData) return null

  const { tvShow, cast, similar, images } = tvShowData

  const videoUrl = `https://vidlink.pro/tv/${movieId}/${selectedSeason}/${selectedEpisode}/?primaryColor=ec4899&secondaryColor=dd9dbd&iconColor=d991b5&icons=vid&player=default&title=true&poster=true&autoplay=true&nextbutton=true`

  return (
    <div className="min-h-screen bg-gray-900">
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={`https://image.tmdb.org/t/p/original${selectedImage}`}
            alt="Gallery"
            className="max-w-full max-h-[90vh] object-contain "
          />
        </div>
      )}

      <div className="relative min-h-screen ">
        <div
          className="absolute inset-0 bg-cover bg-center "
          style={{
            backgroundImage: `url(https://image.tmdb.org/t/p/original${tvShow.backdrop_path})`
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/70 to-transparent">
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/30 to-transparent" />
          </div>
        </div>

        <div className="relative max-w-[90rem] mx-auto px-2 sm:px-4 md:px-6 py-6 sm:py-8 md:py-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-2 sm:mb-4 mt-44">{tvShow.name}</h1>
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-4 sm:mb-8">
            <span className="text-pink-500 font-medium text-sm sm:text-base">{tvShow.first_air_date.split('-')[0]}</span>
            <span className="text-gray-400 hidden sm:inline">•</span>
            <span className="text-gray-400 text-sm sm:text-base">{tvShow.episode_run_time[0]} min</span>
            <span className="text-gray-400 hidden sm:inline">•</span>
            <div className="flex items-center gap-2">
              <span className="bg-pink-500 text-white px-2 py-0.5 rounded text-xs sm:text-sm">HD</span>
            </div>
          </div>

          <p className="text-gray-300 max-w-2xl mb-8 text-sm sm:text-base">{tvShow.overview}</p>
          <div className='flex items-center gap-3 pt-2 mt-[-20px] mb-10'>
            <Button
              onClick={() => setShowVideo(true)}
              size="sm"
              className="h-10 px-6 rounded-full bg-pink-500 hover:bg-white/90 text-black font-semibold transition-all duration-300"
            >
              <Play className="mr-2 h-4 w-4 fill-black" />
              Watch Now
            </Button>
            <PlusWatchlistButton
              currentTv={tvShow}
              watchlist={watchlist}
              setWatchlist={setWatchlist}
            />
          </div>

          {/* Mobile Season & Episode Select */}
          <div className="block md:hidden space-y-3 mb-6">
            <button
              onClick={() => setShowSeasonSelect(!showSeasonSelect)}
              className="w-full bg-black/50 backdrop-blur-sm text-white px-4 py-3 rounded-lg flex justify-between items-center"
            >
              Season {selectedSeason}
              <ChevronDown className="h-4 w-4" />
            </button>

            <button
              onClick={() => setShowEpisodeSelect(!showEpisodeSelect)}
              className="w-full bg-black/50 backdrop-blur-sm text-white px-4 py-3 rounded-lg flex justify-between items-center"
            >
              Episode {selectedEpisode}
              <ChevronDown className="h-4 w-4" />
            </button>

            {showSeasonSelect && (
              <div className="fixed inset-0 z-50 bg-black/80 flex items-end ">
                <div className="mb-20 w-full bg-gray-900 rounded-t-xl max-h-[80vh] overflow-y-auto">
                  <div className="sticky top-0 bg-gray-900 p-4 border-b border-gray-800 flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-white">Select Season</h3>
                    <Button variant="ghost" onClick={() => setShowSeasonSelect(false)}>Close</Button>
                  </div>
                  <div className="p-2 ">
                    {tvShow?.seasons.map((season: Season) => (
                      <button
                        key={season.season_number}
                        onClick={() => {
                          setSelectedSeason(season.season_number);
                          setDisplayedEpisodes(25);
                          setShowSeasonSelect(false);
                        }}
                        className={cn(
                          "w-full px-4 py-3 text-left text-white hover:bg-gray-800 rounded-lg",
                          selectedSeason === season.season_number && "bg-pink-500 hover:bg-pink-600"
                        )}
                      >
                        {season.name}
                        <span className="text-sm ml-2 opacity-70">({season.episode_count} episodes)</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {showEpisodeSelect && (
              <div className="fixed inset-0 z-50 bg-black/80 flex items-end">
                <div className="mb-20 w-full bg-gray-900 rounded-t-xl max-h-[80vh] overflow-y-auto">
                  <div className="sticky top-0 bg-gray-900 p-4 border-b border-gray-800 flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-white">Select Episode</h3>
                    <Button variant="ghost" onClick={() => setShowEpisodeSelect(false)}>Close</Button>
                  </div>
                  <div className="p-2">
                    {episodes.map((episode:Episode) => (
                      <button
                        key={episode.episode_number}
                        onClick={() => {
                          setSelectedEpisode(episode.episode_number);
                          setShowVideo(true);
                          setShowEpisodeSelect(false);
                        }}
                        className={cn(
                          "w-full px-4 py-3 text-left text-white hover:bg-gray-800 rounded-lg",
                          selectedEpisode === episode.episode_number && "bg-pink-500 hover:bg-pink-600"
                        )}
                      >
                        Episode {episode.episode_number}: {episode.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Desktop Seasons Section */}
          <div className="hidden md:block mb-8">
            <div className="flex flex-wrap gap-2">
              {tvShow?.seasons.map((season:Season) => (
                <Button
                  key={season.season_number}
                  variant={selectedSeason === season.season_number ? "default" : "outline"}
                  onClick={() => {
                    setSelectedSeason(season.season_number)
                    setDisplayedEpisodes(25)
                  }}
                  className={cn(
                    "bg-gray-800/50 text-white hover:bg-gray-700/50 text-sm sm:text-base px-4 py-2",
                    selectedSeason === season.season_number && "bg-pink-500 hover:bg-pink-600"
                  )}
                >
                  {season.name}
                  <span className="text-xs ml-1 opacity-70">({season.episode_count})</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Episodes Section */}
          <div className="space-y-6">
            <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6">
              {episodes.slice(0, displayedEpisodes).map((episode:Episode) => (
                <button
                  key={episode.episode_number}
                  onClick={() => {
                    setSelectedEpisode(episode.episode_number);
                    setShowVideo(true);
                  }}
                  className="group relative aspect-video overflow-hidden rounded-lg bg-gray-800 w-full"
                >
                  <img
                    src={episode.still_path
                      ? `https://image.tmdb.org/t/p/w500${episode.still_path}`
                      : '/placeholder.svg?height=280&width=500'}
                    alt={episode.name}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex flex-col justify-end p-3 sm:p-4">
                    <div className="text-sm sm:text-base text-gray-300">Episode {episode.episode_number}</div>
                    <div className="text-base sm:text-lg font-medium text-white line-clamp-2 mt-1">{episode.name}</div>
                  </div>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                    <Play className="text-white/0 group-hover:text-white/100 transition-colors h-8 w-8" />
                  </div>
                </button>
              ))}
            </div>

            {episodes.length > displayedEpisodes && (
              <div className="flex justify-center pt-4">
                <Button
                  onClick={handleLoadMore}
                  variant="outline"
                  size="lg"
                  className="hidden md:flex bg-gray-800/50 text-white hover:bg-gray-700/50 gap-2 px-8"
                >
                  Load More Episodes
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Video Modal */}
          {showVideo && selectedEpisode && (
            <SecureIframePlayer
              src={videoUrl}
              onClose={() => setShowVideo(false)}
            />
          )}
        </div>
      </div>

      {/* Cast Section */}
      <div className="max-w-[90rem] mx-auto px-4 sm:px-6 py-12">
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-6">Cast</h2>
        <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-3 sm:gap-4">
          {cast.map((actor:CastMember) => (
            <div key={actor.id} className="space-y-1 sm:space-y-2">
              {actor.profile_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
                  alt={actor.name}
                  className="w-full h-32 sm:h-40 object-cover rounded-lg"
                />
              ) : (
                <div className="w-full h-32 sm:h-40 bg-gray-800 rounded-lg flex items-center justify-center">
                  <User2 className="h-6 w-6 sm:h-8 sm:w-8 text-gray-600" />
                </div>
              )}
              <p className="text-white text-xs sm:text-sm font-medium line-clamp-1">{actor.name}</p>
              <p className="text-gray-400 text-[10px] sm:text-xs line-clamp-1">{actor.character}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Gallery Section */}
      <div className="max-w-[90rem] mx-auto px-2 sm:px-4 md:px-6 py-6 sm:py-8 md:py-12">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-4 sm:mb-6">Gallery</h2>
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4">
          {images.backdrops.map((image:ImageData, index:number) => (
            <button
              key={index}
              onClick={() => setSelectedImage(image.file_path)}
              className="relative group aspect-video bg-gray-800 rounded-lg overflow-hidden"
            >
              <img
                src={`https://image.tmdb.org/t/p/w780${image.file_path}`}
                alt={`Scene ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                <ImageIcon className="text-white/0 group-hover:text-white/100 transition-colors h-8 w-8" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Similar Shows */}
      <div className="max-w-[90rem] mx-auto px-2 sm:px-4 md:px-6 py-6 sm:py-8 md:py-12">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-4 sm:mb-6">Similar shows</h2>
        <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-4">
          {similar.map((show:TvShow) => (
            <button
              key={show.id}
              onClick={() => handleSimilarMovieClick(show.id)}
              className="space-y-2 text-left group"
            >
              <div className="relative overflow-hidden rounded-lg">
                <img
                  src={`https://image.tmdb.org/t/p/w342${show.poster_path}`}
                  alt={show.name}
                  className="w-full h-48 sm:h-64 object-cover transform group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                  <Play className="text-white/0 group-hover:text-white/100 transition-colors h-8 w-8" />
                </div>
              </div>
              <p className="text-white text-sm font-medium truncate">{show.name}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

