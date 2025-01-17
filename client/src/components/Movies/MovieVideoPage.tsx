import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Play, User2, ImageIcon } from 'lucide-react';
import PlusWatchlistButton from '../PlusWatchlistButton';
import { Button } from '../ui/button';
import { SecureIframe } from '@/components/SecureIframe';
import type { Movie, CastMember, ImageData } from 'types';
import { useMovieData } from '@/hooks/useMovieData';

export default function MovieVideoPage() {
  const { movieId } = useParams<{ movieId: string }>();
  const navigate = useNavigate();
  const [watchlist, setWatchlist] = useState<number[]>([]);
  const [showVideo, setShowVideo] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const { data, isLoading, error } = useMovieData(movieId || '');

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
    navigate(`/videopage/${similarMovieId}`);
    window.scrollTo(0, 0);
  };

  if (isLoading) return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-[#13141A] to-[#1a1c25]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#3d59ad]"></div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#13141A] to-[#1a1c25]">
      <div className="bg-red-900/20 text-red-100 p-4 rounded-lg">
        Error: {error.message}
      </div>
    </div>
  );

  if (!data) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#13141A] to-[#1a1c25]">
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={`https://image.tmdb.org/t/p/original${selectedImage}`}
            alt="Gallery"
            className="max-w-full max-h-[90vh] object-contain"
          />
        </div>
      )}

      <div className="relative min-h-screen md:h-screen">
        <div
          className="absolute inset-0 bg-cover bg-center rounded-2xl"
          style={{
            backgroundImage: `url(https://image.tmdb.org/t/p/original${data.movie.backdrop_path})`
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#13141A] via-[#13141A]/70 to-transparent">
            <div className="absolute inset-0 bg-gradient-to-t from-[#13141A] via-[#13141A]/30 to-transparent" />
          </div>
        </div>

        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 py-12 flex flex-col justify-center">
          {showVideo ? (
            <div className="aspect-video w-full max-w-7xl mx-auto bg-black rounded-xl overflow-hidden shadow-2xl">
              <SecureIframe
                src={`https://vidlink.pro/movie/${movieId}/?primaryColor=3d59ad&secondaryColor=697ab0&iconColor=697ab0&icons=vid&player=default&title=true&poster=true&autoplay=true&nextbutton=true`}
                className="aspect-video w-full h-full rounded-lg relative"
                width="1280"
                height="720"
                title="Video player"
              />
            </div>
          ) : (
            <>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4">{data.movie.title}</h1>
              <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-6 sm:mb-8">
                <span className="text-[#3d59ad] font-medium">{data.movie.release_date.split('-')[0]}</span>
                <span className="text-gray-400 hidden sm:inline">•</span>
                <span className="text-gray-400">{data.movie.runtime} min</span>
                <span className="text-gray-400 hidden sm:inline">•</span>
                <div className="flex items-center">
                  <span className="bg-gradient-to-r from-[#3d59ad] to-[#4c6ac2] text-white px-2 py-0.5 rounded text-sm">HD</span>
                </div>
              </div>
              <p className="text-gray-300 max-w-2xl mb-8 text-sm sm:text-base">{data.movie.overview}</p>
              <div className='flex items-center gap-3 pt-2'>
                <Button
                  onClick={() => setShowVideo(true)}
                  size="sm"
                  className="h-10 px-6 rounded-full bg-gradient-to-r from-[#3d59ad] to-[#4c6ac2] hover:bg-white/90 text-black font-semibold transition-all duration-300"
                >
                  <Play className="mr-2 h-4 w-4 fill-black" />
                  Watch Now
                </Button>
                <PlusWatchlistButton
                  currentMovie={data.movie}
                  watchlist={watchlist}
                  setWatchlist={setWatchlist}
                />
              </div>
            </>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Cast</h2>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-3 sm:gap-4">
          {data.cast.map((actor: CastMember) => (
            <div key={actor.id} className="space-y-1 sm:space-y-2">
              {actor.profile_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
                  alt={actor.name}
                  className="w-full h-24 sm:h-32 md:h-40 object-cover rounded-lg"
                />
              ) : (
                <div className="w-full h-24 sm:h-32 md:h-40 bg-[#13141A] rounded-lg flex items-center justify-center">
                  <User2 className="h-6 w-6 sm:h-8 sm:w-8 text-gray-600" />
                </div>
              )}
              <p className="text-white text-xs sm:text-sm font-medium truncate">{actor.name}</p>
              <p className="text-gray-400 text-xs truncate">{actor.character}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Gallery</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
          {data.images.backdrops.map((image: ImageData, index: number) => (
            <button
              key={index}
              onClick={() => setSelectedImage(image.file_path)}
              className="relative group aspect-video bg-[#13141A] rounded-lg overflow-hidden"
            >
              <img
                src={`https://image.tmdb.org/t/p/w780${image.file_path}`}
                alt={`Scene ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                <ImageIcon className="text-white/0 group-hover:text-white/100 transition-colors h-6 w-6 sm:h-8 sm:w-8" />
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Similar movies</h2>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 sm:gap-4">
          {data.similar.map((movie: Movie) => (
            <button
              key={movie.id}
              onClick={() => handleSimilarMovieClick(movie.id)}
              className="space-y-1 sm:space-y-2 text-left group"
            >
              <div className="relative overflow-hidden rounded-lg">
                <img
                  src={`https://image.tmdb.org/t/p/w342${movie.poster_path}`}
                  alt={movie.title}
                  className="w-full h-36 sm:h-48 md:h-64 object-cover transform group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                  <Play className="text-white/0 group-hover:text-white/100 transition-colors h-6 w-6 sm:h-8 sm:w-8" />
                </div>
              </div>
              <p className="text-white text-xs sm:text-sm font-medium truncate">{movie.title}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}