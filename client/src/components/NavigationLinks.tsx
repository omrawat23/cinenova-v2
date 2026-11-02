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
    <div className="space-y-1">
      <Link to="/" className="nav-item">
        <House className="w-5 h-5" />
        <span>Home</span>
      </Link>

      <button
        onClick={(e) => {
          e.preventDefault();
          setIsSearchActive(true);
        }}
        className="nav-item w-full"
      >
        <Search className="w-5 h-5" />
        <span>Search</span>
      </button>

      <Link to="/movies" className="nav-item">
        <Film className="w-5 h-5" />
        <span>Movies</span>
      </Link>

      <Link to="/tv-series" className="nav-item">
        <Tv className="w-5 h-5" />
        <span>TV Series</span>
      </Link>

      <Link to="/anime" className="nav-item">
        <Tv className="w-5 h-5" />
        <span>Anime</span>
      </Link>
    </div>
  );
};