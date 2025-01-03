import React, { useState, useRef, useCallback } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Search, Film, Tv } from 'lucide-react';
import axios from 'axios';
import debounce from 'lodash/debounce';
import { Movie, SearchResponse } from 'types';

interface SearchComponentProps {
  onClose?: () => void;
  isActive: boolean;
}

const SearchComponent: React.FC<SearchComponentProps> = ({ onClose, isActive }) => {
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [mediaFilter, setMediaFilter] = useState<'all' | 'movie' | 'tv'>('all');
  const searchInputRef = useRef<HTMLInputElement>(null);

  const searchMovies = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const apiKey = import.meta.env.VITE_TMDB_API_KEY;
      const response = await axios.get<SearchResponse>(
        `https://api.themoviedb.org/3/search/multi`,
        {
          params: {
            query,
            include_adult: false,
            language: 'en-US',
            page: 1,
          },
          headers: {
            accept: 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
        }
      );

      let filteredResults = response.data.results.filter((movie) => {
        if (movie.media_type === 'tv') {
          return movie.name.toLowerCase().includes(query.toLowerCase()) || movie.first_air_date;
        } else if (movie.media_type === 'movie') {
          return movie.title.toLowerCase().includes(query.toLowerCase()) || movie.release_date;
        }
        return false;
      });

      if (mediaFilter !== 'all') {
        filteredResults = filteredResults.filter(item => item.media_type === mediaFilter);
      }

      setSearchResults(filteredResults);
    } catch (error) {
      console.error('Error searching movies:', error);
      setSearchResults([]);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce((query: string) => searchMovies(query), 250),
    [mediaFilter]
  );

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = event.target.value;
    setSearchTerm(newSearchTerm);
    debouncedSearch(newSearchTerm);
  };

  const handleCardClick = (movie: { id: number; media_type: string }) => {
    if (movie.media_type === 'movie') {
      window.location.href = `/videopage/${movie.id}`;
    } else if (movie.media_type === 'tv') {
      window.location.href = `/tv-videopage/${movie.id}`;
    }
  };

  const FilterButton = ({ type, icon: Icon, label }: { type: 'all' | 'movie' | 'tv', icon?: any, label: string }) => (
    <button
      onClick={() => {
        setMediaFilter(type);
        if (searchTerm) searchMovies(searchTerm);
      }}
      className={`px-3 py-1.5 rounded-lg flex items-center gap-2 transition-all ${
        mediaFilter === type
          ? 'bg-blue-500 text-white'
          : 'bg-gray-700/50 text-gray-400 hover:bg-gray-700'
      }`}
    >
      {Icon && <Icon className="w-4 h-4" />}
      {label}
    </button>
  );

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start md:items-center justify-center px-4 md:px-0 pt-16 md:pt-0">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-[#1C1E26]/95 backdrop-blur-xl border border-gray-800/50 rounded-xl shadow-lg shadow-black/20 w-full max-w-[500px] mx-auto">
        <div className="p-4 space-y-3">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              ref={searchInputRef}
              type="text"
              placeholder="Search ..."
              value={searchTerm}
              autoFocus
              onChange={handleSearchChange}
              className="w-full bg-gray-700/50 border-gray-600 focus:border-blue-500 text-white placeholder-gray-400 pl-10"
            />
          </div>

          <div className="flex gap-2">
            <FilterButton type="all" label="All" />
            <FilterButton type="movie" icon={Film} label="Movies" />
            <FilterButton type="tv" icon={Tv} label="TV Shows" />
          </div>
        </div>

        <ScrollArea className="h-[calc(100vh-40vh)] md:h-[calc(100vh-40vh)]">
          <div className="p-2 space-y-1">
            {searchResults.map((movie) => (
              <button
                key={movie.id}
                className="w-full flex items-center gap-4 p-3 hover:bg-blue-500/10 transition-colors rounded-xl group"
                onClick={() => handleCardClick(movie)}
              >
                <img
                  src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                  alt={movie.media_type}
                  className="w-12 h-[72px] object-cover rounded-lg shadow-md"
                />
                <div className="flex flex-col items-start text-left">
                  <span className="text-sm font-medium text-white group-hover:text-blue-400 transition-colors">
                    {movie.media_type === 'tv' ? movie.name : movie.title}
                  </span>
                  <span className="text-xs text-gray-400">
                    {movie.media_type === 'tv'
                      ? new Date(movie.first_air_date).getFullYear()
                      : new Date(movie.release_date).getFullYear()}
                  </span>
                  <span className="text-xs text-gray-500 mt-1">
                    {movie.media_type === 'tv' ? 'TV Show' : 'Movie'}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default SearchComponent;