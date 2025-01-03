import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { HomeIcon as House, Film, Tv, Search } from 'lucide-react';
import SearchComponent from './SearchComponent';

// First, create a context to manage search state
import { createContext, useState } from 'react';

interface SearchContextType {
  isSearchActive: boolean;
  setIsSearchActive: (active: boolean) => void;
}

// eslint-disable-next-line react-refresh/only-export-components
export const SearchContext = createContext<SearchContextType>({
  isSearchActive: false,
  setIsSearchActive: () => {},
});

// Provider component
export const SearchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSearchActive, setIsSearchActive] = useState(false);

  return (
    <SearchContext.Provider value={{ isSearchActive, setIsSearchActive }}>
      {children}
      <SearchComponent
        isActive={isSearchActive}
        onClose={() => setIsSearchActive(false)}
      />
    </SearchContext.Provider>
  );
};

// Updated NavigationLinks component
export const NavigationLinks = () => {
  const { setIsSearchActive } = useContext(SearchContext);

  return (
    <div>
      <Link to="/" className="flex items-center space-x-3 p-4 text-gray-300 hover:text-blue-400 hover:bg-blue-500/10 rounded-xl transition-all duration-200">
        <House className="w-5 h-5" />
        <span className="font-medium">Home</span>
      </Link>

      <button
        onClick={(e) => {
          e.preventDefault();
          setIsSearchActive(true);
        }}
        className="w-full flex items-center space-x-3 p-4 text-gray-300 hover:text-blue-400 hover:bg-blue-500/10 rounded-xl transition-all duration-200"
      >
        <Search className="w-5 h-5" />
        <span className="font-medium">Search</span>
      </button>

      <Link to="/movies" className="flex items-center space-x-3 p-4 text-gray-300 hover:text-blue-400 hover:bg-blue-500/10 rounded-xl transition-all duration-200">
        <Film className="w-5 h-5" />
        <span className="font-medium">Movies</span>
      </Link>

      <Link to="/tv-series" className="flex items-center space-x-3 p-4 text-gray-300 hover:text-blue-400 hover:bg-blue-500/10 rounded-xl transition-all duration-200">
        <Tv className="w-5 h-5" />
        <span className="font-medium">TV Series</span>
      </Link>

      <Link to="/anime" className="flex items-center space-x-3 p-4 text-gray-300 hover:text-blue-400 hover:bg-blue-500/10 rounded-xl transition-all duration-200">
        <Tv className="w-5 h-5" />
        <span className="font-medium">Anime</span>
      </Link>
    </div>
  );
};