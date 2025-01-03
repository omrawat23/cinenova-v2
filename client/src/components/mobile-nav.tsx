import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Home, Search, Grid, Film, Tv, Bookmark, History } from 'lucide-react';
import { cn } from "@/lib/utils";
import SearchComponent from './SearchComponent';

export function MobileNav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);

  const menuItems = [
    { icon: Film, label: 'Movies', to: '/movies' },
    { icon: Tv, label: 'TV', to: '/tv-series' },
    { icon: Bookmark, label: 'Watchlist', to: '/watchlist' },
    { icon: History, label: 'History', to: '/history' },
  ];

  const handleSearchClick = () => {
    setIsSearchActive(true);
    // Close the menu if it's open when search is activated
    if (isMenuOpen) {
      setIsMenuOpen(false);
    }
  };

  return (
    <>
      {/* Search Modal */}
      <SearchComponent
        isActive={isSearchActive}
        onClose={() => setIsSearchActive(false)}
      />

      {/* Menu Overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Menu Grid */}
      <div className={cn(
        "fixed inset-x-0 z-50 transition-transform duration-300 ease-in-out transform rounded-lg",
        isMenuOpen ? "translate-y-0 bottom-20" : "translate-y-full"
      )}>
        <div className="bg-black/80 backdrop-blur-md mx-4 rounded-xl p-4">
          <div className="grid grid-cols-4 gap-4">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                className="flex flex-col items-center justify-center p-3 rounded-xl hover:bg-white/10 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <item.icon className="w-6 h-6 text-gray-200" />
                <span className="text-xs text-gray-200 mt-1">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/10 backdrop-blur-lg text-white z-50">
        <nav className="flex justify-around p-4">
          <Link to="/" className="flex flex-col items-center">
            <Home className="w-6 h-6" />
            <span className="text-xs mt-1">Home</span>
          </Link>
          <button
            onClick={handleSearchClick}
            className="flex flex-col items-center"
          >
            <Search className="w-6 h-6" />
            <span className="text-xs mt-1">Search</span>
          </button>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex flex-col items-center"
          >
            <Grid className="w-6 h-6" />
            <span className="text-xs mt-1">Menu</span>
          </button>
        </nav>
      </div>
    </>
  );
}

export default MobileNav;