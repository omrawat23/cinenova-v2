import { Card } from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import { type Movie } from "types";
import { Link } from "react-router-dom";

interface CardProps {
  movie: Movie;
  onRemove: (movieId: number) => void;
  onNavigate: (movieId: number) => void;
}

const WatchListCard: React.FC<CardProps> = ({ movie, onRemove }) => {
  return (
    <div>
    <Card key={movie.id} className="overflow-hidden group relative border-none">
      <img
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        alt={movie.title}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
      />


      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Link
                  to={movie.media_type === 'movie' ? `/videopage/${movie.id}` : `/tv-videopage/${movie.id}`}
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

    </Card>
    <div className="p-3">
    <div className="flex justify-between items-start mb-1">
      <h4 className="text-sm font-medium truncate flex-1">{movie.title}</h4>
      <button
        onClick={() => onRemove(movie.id)}
        className="text-muted-foreground hover:text-destructive transition-colors ml-2"
        aria-label="Remove from Watch History"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
    <p className="text-xs text-muted-foreground">

      {movie.media_type === 'tv' ? 'TV Show' : 'Movie'}

    </p>
  </div>
  </div>
  );
};

export default WatchListCard;



