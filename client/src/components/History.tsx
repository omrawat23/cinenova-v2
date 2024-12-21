import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Trash2 } from 'lucide-react';

interface MediaData {
  id: number;
  type: 'tv' | 'movie';
  title: string;
  poster_path: string;
  progress: {
    watched: number;
    duration: number;
  };
  last_episode_watched?: string;
  last_season_watched?: string;
  last_updated: number;
}

const WatchHistoryCard: React.FC<{
  media: MediaData,
  onRemove: (id: number) => void
}> = ({ media, onRemove }) => {
  const progressPercentage = (media.progress.watched / media.progress.duration) * 100;

  return (
    <div className="relative group ">
      <div
        className="relative rounded-lg overflow-hidden cursor-pointer"
      >
        <img
          src={`https://image.tmdb.org/t/p/w500${media.poster_path}`}
          alt={media.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700">
          <div
            className="h-full bg-blue-500"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Link
            to={media.type === 'movie' ? `/videopage/${media.id}` : `/tv-videopage/${media.id}`}
            className="bg-white/20 hover:bg-white/30 p-3 rounded-full"
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-transform hover:scale-110">
                  <div className="w-12 h-12 rounded-full bg-white/30 flex items-center justify-center backdrop-blur-sm">
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                      <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-black border-b-[6px] border-b-transparent ml-1" />
                    </div>
                  </div>
                </div>
          </Link>
        </div>
      </div>

      <div className="p-3">
          <div className="flex justify-between items-start mb-1">
            <h4 className="text-sm font-medium truncate flex-1">{media.title}</h4>
            <button
              onClick={() => onRemove(media.id)}
              className="text-muted-foreground hover:text-destructive transition-colors ml-2"
              aria-label="Remove from Watch History"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-muted-foreground">
            {media.type === 'tv' ? 'TV Show' : 'Movie'}
            {media.type === 'tv' && media.last_episode_watched &&
              ` • Episode ${media.last_episode_watched}`}
          </p>
        </div>
    </div>
  );
};

const WatchHistory: React.FC = () => {
  const [watchHistoryList, setWatchHistoryList] = useState<MediaData[]>([]);

  useEffect(() => {
    const storedData = localStorage.getItem('vidLinkProgress');
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      const mediaList = Object.values(parsedData) as MediaData[];

      // Sort the list by last_updated in descending order (most recent first)
      const sortedList = mediaList.sort((a, b) => b.last_updated - a.last_updated);

      setWatchHistoryList(sortedList.slice(0, 5));
    }
  }, []);

  const removeFromWatchHistory = (id: number) => {
    const storedData = localStorage.getItem('vidLinkProgress');
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      delete parsedData[id];
      localStorage.setItem('vidLinkProgress', JSON.stringify(parsedData));

      setWatchHistoryList(prev => prev.filter(media => media.id !== id));
    }
  };

  // Empty state
  if (watchHistoryList.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] text-center">
        <img
          src="/api/placeholder/400/300"
          alt="No Watch History"
          className="opacity-50 mb-4"
        />
        <h2 className="text-2xl font-semibold mb-2">You haven't watched anything yet!</h2>
        <p className="text-gray-500 mb-4">
          Start watching something to see your history
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Watch History</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {watchHistoryList.map((media) => (
          <WatchHistoryCard
            key={media.id}
            media={media}
            onRemove={removeFromWatchHistory}
          />
        ))}
      </div>
    </div>
  );
};

export default WatchHistory;