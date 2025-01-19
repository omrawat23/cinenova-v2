import { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import WatchListCard from "@/components/WatchListCard";
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { type Movie } from 'types'

export default function Watchlist() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [watchlist, setWatchlist] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)
  const baseUrl = import.meta.env.VITE_BASE_URL;

  // Fetch user's watchlist
  const fetchWatchlist = async () => {
    try {
      if (!user?.uuid) {
        toast.error('Please log in to view watchlist')
        setLoading(false)
        return
      }

      const response = await axios.get(`${baseUrl}/api/users/watchlist/${user.uuid}`)
      setWatchlist(response.data.watchlist)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching watchlist:', error)
      toast.error('Failed to fetch watchlist')
      setLoading(false)
    }
  }

  // Remove movie from watchlist
  const removeFromWatchlist = async (movieId: number) => {
    try {
      if (!user?.uuid) {
        toast.error('Please log in')
        return
      }

      await axios.delete(`${baseUrl}/api/users/watchlist/${user.uuid}/${movieId}`)

      setWatchlist(prev => prev.filter(movie => movie.id !== movieId))
      toast.success('Removed from watchlist')
    } catch (error) {
      console.error('Error removing from watchlist:', error)
      toast.error('Failed to remove movie')
    }
  }

  // Navigate to movie details
  const handleMovieClick = (movieId: number) => {
    navigate(`/movie/${movieId}`)
  }

  // Fetch watchlist on component mount
  useEffect(() => {
    fetchWatchlist()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.uuid])

  // Loading state
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4">
        {[...Array(5)].map((_, index) => (
          <div
            key={index}
            className="bg-gray-200 animate-pulse rounded-lg h-64"
          />
        ))}
      </div>
    )
  }

  // Empty watchlist state
  if (watchlist.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] text-center">
        <img
          src="/api/placeholder/400/300"
          alt="Empty Watchlist"
          className="opacity-50 mb-4"
        />
        <h2 className="text-2xl font-semibold mb-2">Your Watchlist is Empty</h2>
        <p className="text-gray-500 mb-4">
          Explore movies and add them to your watchlist
        </p>
        <Button onClick={() => navigate('/movies')}>
          Discover Movies
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">My Watchlist</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {watchlist.map((movie) => (
        <WatchListCard
          key={movie.id}
          movie={movie}
          onRemove={removeFromWatchlist}
          onNavigate={handleMovieClick}
        />
      ))}
      </div>
    </div>
  )
}