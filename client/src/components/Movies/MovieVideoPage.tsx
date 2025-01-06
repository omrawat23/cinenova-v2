import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Play, User2, ImageIcon } from 'lucide-react';
import PlusWatchlistButton from '../PlusWatchlistButton';
import { Button } from '../ui/button';
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
    setShowVideo(false);
    setSelectedImage(null);

    const blockedScripts = [
      'https://www.intellipopup.com/PCslGU/E/xexceljs.min.js',
      'https://d3mr7y154d2qg5.cloudfront.net/udotdotdot.js',
      'https://dvxrxm-cxo.top/script/ut.js?cb=1735910227421',
      'https://youradexchange.com/script/suurl5.php?r=8802910&chu=%22Google%20Chrome%22%3Bv%3D131%2C%20%22Chromium%22%3Bv%3D131%2C%20%22Not_A%20Brand%22%3Bv%3D24&chmob=%3F0&chp=Windows&chpv=10.0.0&chuafv=131.0.6778.205&cbur=0.774850577069796&cbiframe=1&cbWidth=1232&cbHeight=693&cbtitle=&cbpage=&cbref=&cbdescription=&cbkeywords=&cbcdn=dvxrxm-cxo.top&ufp=Win32%2FMozilla%2FNetscape%2Ftrue%2Ffalse%2FGoogle%20Inc.1920x1080-330en-US81224%20bits&ts=1735910227555&srs=cb29b0593aebb14b62480a58acd05d54&atv=57.0&abtg=1&adbv=3-cdn',
      'https://ejitmssx-rk.icu/eg?7VLn02vw9NlQswer0rnQh=Y2JkZXNjcmlwdGlvbj0mYWRidj0zLWNkbiZmbXQ9c3V2NSZjYmlmcmFtZT0xJmNiSGVpZ2h0PTY5MyZjaG1vYj0lM0YwJnNycz1jYjI5YjA1OTNhZWJiMTRiNjI0ODBhNThhY2QwNWQ1NCZ1ZnA9V2luMzIlMkZNb3ppbGxhJTJGTmV0c2NhcGUlMkZ0cnVlJTJGZmFsc2UlMkZHb29nbGUlMjBJbmMuMTkyMHgxMDgwLTMzMGVuLVVTODEyMjQlMjBiaXRzJmNia2V5d29yZHM9JmNocD1XaW5kb3dzJmNocHY9MTAuMC4wJnNhZGJsPTImY2h1YWZ2PTEzMS4wLjY3NzguMjA1JmF0dj01Ny4wJmNiV2lkdGg9MTIzMiZhYnRnPTEmY2J0aXRsZT0mY2J1cj0wLjA4MjQ0MTc0MjI5MDY5NzEyJnRzPTE3MzU5MTAyMjc1NTgmcj04ODAyOTEwJmNiY2RuPWR2eHJ4bS1jeG8udG9wJmNicGFnZT0mY2h1PSUyMkdvb2dsZSUyMENocm9tZSUyMiUzQnYlM0QxMzElMkMlMjAlMjJDaHJvbWl1bSUyMiUzQnYlM0QxMzElMkMlMjAlMjJOb3RfQSUyMEJyYW5kJTIyJTNCdiUzRDI0JmNicmVmPQ%3D%3D',
      'https://www.pkgphtvnsfxfni.com/ydotdotdot.js',
    ];

    const iframe = document.querySelector('iframe');

    const preventNewTabOpening = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      return false;
    };

    const blockScripts = () => {
      if (!iframe) return;

      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
      if (iframeDoc) {
        // Block unwanted scripts
        const scripts = iframeDoc.querySelectorAll('script');
        scripts.forEach((script) => {
          const src = script.getAttribute('src');
          if (src && blockedScripts.includes(src)) {
            script.parentNode?.removeChild(script);
            console.warn(`Blocked script: ${src}`);
          }
        });

        // Block new tab/window openings
        try {
          // Prevent target="_blank" links
          const links = iframeDoc.getElementsByTagName('a');
          Array.from(links).forEach(link => {
            link.setAttribute('target', '_self');
            link.addEventListener('click', preventNewTabOpening);
            link.addEventListener('auxclick', preventNewTabOpening); // Prevents middle-click
          });

          // Override window.open
          if (iframe.contentWindow) {
            iframe.contentWindow.open = () => null;
          }

          // Add CSS to prevent clickable overlays
          const style = iframeDoc.createElement('style');
          style.textContent = `
            * { pointer-events: none !important; }
            video, .video-controls { pointer-events: auto !important; }
          `;
          iframeDoc.head.appendChild(style);
        } catch (error) {
          console.warn('Failed to modify iframe content:', error);
        }
      }
    };

    const intervalId = setInterval(blockScripts, 1000);

    // Cleanup
    return () => {
      clearInterval(intervalId);
      if (iframe?.contentDocument) {
        const links = iframe.contentDocument.getElementsByTagName('a');
        Array.from(links).forEach(link => {
          link.removeEventListener('click', preventNewTabOpening);
          link.removeEventListener('auxclick', preventNewTabOpening);
        });
      }
    };
  }, [movieId]);

  useEffect(() => {
    const handleMediaDataMessage = (event: MessageEvent) => {
      if (event.origin !== 'https://vidlink.pro') return;

      if (event.data?.type === 'MEDIA_DATA') {
        const mediaData = event.data.data;
        localStorage.setItem('vidLinkProgress', JSON.stringify(mediaData));
      }
    };

    window.addEventListener('message', handleMediaDataMessage);

    return () => {
      window.removeEventListener('message', handleMediaDataMessage);
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
            className="max-w-full max-h-[90vh] object-contain "
          />
        </div>
      )}

      <div className="relative min-h-screen md:h-screen ">
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

        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 py-12 flex flex-col justify-center ">
          {showVideo ? (
            <div className="aspect-video w-full max-w-7xl mx-auto bg-black rounded-xl overflow-hidden shadow-2xl">
              <iframe
                src={`https://vidlink.pro/movie/${movieId}/?primaryColor=3d59ad&secondaryColor=697ab0&iconColor=697ab0&icons=vid&player=default&title=true&poster=true&autoplay=true&nextbutton=true`}
                className="aspect-video w-full h-full rounded-lg relative"
                width="1280"
                height="720"
                title="Video player"
                frameBorder="0"
                allowFullScreen
                referrerPolicy="no-referrer"
              ></iframe>
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