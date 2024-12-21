import { useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Check, Plus } from 'lucide-react';
import axios from 'axios';
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

export default function PlusWatchlistButton({ currentMovie, watchlist, setWatchlist }) {
  const { user } = useAuth();

  const handleAddToWatchlist = useCallback(async (movie) => {
    try {
      if (!user?.uuid) {
        toast.error('Please log in to add to watchlist');
        return;
      }

      await axios.post(
        'http://localhost:3003/api/users/watchlist',
        {
          uuid: user.uuid,
          movie: {
            id: movie.id,
            title: movie.title,
            release_date: movie.release_date,
            poster_path: movie.poster_path,
            media_type: 'movie'
          }
        }
      );

      toast.success('Added to Watchlist');
      setWatchlist((prev) => [...prev, movie.id]);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 400) {
        toast.error('Movie is already in your watchlist');
      } else {
        toast.error('Failed to add movie to watchlist');
      }
    }
  }, [user, setWatchlist]);

  return (
    <Button
      onClick={() => handleAddToWatchlist(currentMovie)}
      variant="outline"
      size="sm"
      className="h-10 px-6 rounded-full border-white/20 bg-white/10 hover:bg-white/20 text-white font-semibold transition-all duration-300"
    >
      {watchlist.includes(currentMovie.id) ? (
        <Check className="mr-2 h-4 w-4" />
      ) : (
        <Plus className="mr-2 h-4 w-4" />
      )}
      {watchlist.includes(currentMovie.id) ? 'Added' : 'Watchlist'}
    </Button>
  );
}
