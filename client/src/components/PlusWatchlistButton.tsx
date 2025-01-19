import { useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Check, Plus } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import type { Movie, TvShow } from "types";

interface User {
  uuid: string;
}

interface PlusWatchlistButtonProps {
  currentMovie?: Movie;
  currentTv?: TvShow;
  watchlist: number[];
  setWatchlist: React.Dispatch<React.SetStateAction<number[]>>; // Setter for watchlist
}

export default function PlusWatchlistButton({
  currentMovie,
  currentTv,
  watchlist,
  setWatchlist,
}: PlusWatchlistButtonProps) {

  const { user } = useAuth() as { user: User | null }; // Assuming user can be null if unauthenticated
  const baseUrl = import.meta.env.VITE_BASE_URL;

  const handleAddToWatchlist = useCallback(
    async () => {
      if (!user?.uuid) {
        toast.error("Please log in to add to watchlist");
        return;
      }

      const movie = currentMovie || currentTv; // Determine the media type
      if (!movie) {
        toast.error("No media selected");
        return;
      }

      const mediaType = currentMovie ? "movie" : "tv";

      try {
        await axios.post(`${baseUrl}/api/users/watchlist`, {
          uuid: user.uuid,
          movie: {
            id: movie.id, // Use media.id to handle both movies and TV shows
            title: movie.title || movie.name, // Adjust for TV shows
            release_date: movie.release_date || movie.first_air_date, // Adjust for TV shows
            poster_path: movie.poster_path,
            media_type: mediaType,
          },
        });

        toast.success("Added to Watchlist");
        setWatchlist((prev) => [...prev, movie.id]);
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 400) {
          toast.error("This item is already in your watchlist");
        } else {
          toast.error("Failed to add item to watchlist");
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user, currentMovie, currentTv, setWatchlist]
  );


  const movie = currentMovie || currentTv;
  const isAdded = movie ? watchlist.includes(movie.id) : false;

  return (
    <Button
      onClick={handleAddToWatchlist}
      variant="outline"
      size="sm"
      className="h-10 px-6 rounded-full border-white/20 bg-white/10 hover:bg-white/20 text-white font-semibold transition-all duration-300"
    >
      {isAdded ? (
        <Check className="mr-2 h-4 w-4" />
      ) : (
        <Plus className="mr-2 h-4 w-4" />
      )}
      {isAdded ? "Added" : "Watchlist"}
    </Button>
  );
}
