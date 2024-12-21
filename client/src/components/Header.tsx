import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { LoginDialog } from "@/components/login";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import SearchComponent from "./SearchComponent";

export const Header: React.FC = () => {
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleWatchList = () => {
    navigate(`/watchlist`);
  };

  const handleChange = (value: string) => {
    // Define URLs for each option with proper typing
    const urlMap: Record<string, string> = {
      all: '/',
      movies: '/movies',
      tv: '/tv-series',
    };

    // Check if the value exists in the map
    if (value in urlMap) {
      navigate(urlMap[value]);
    }
  };

  return (
    <header className="flex justify-between mb-4">
      {/* Search and Category Selection */}
      <div className="flex space-x-6">
        <Select defaultValue="all" onValueChange={handleChange}>
          <SelectTrigger className="w-16 bg-[#2c2c2c] border-none rounded-3xl pl-4">
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="movies">Movies</SelectItem>
            <SelectItem value="tv">TV Shows</SelectItem>
          </SelectContent>
        </Select>

        <div
          className="relative md:flex sm:w-96 xs:w-44 xxs:w-32"
          onClick={() => setIsSearchActive(true)}
        >
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Search ..."
            readOnly
            className="w-full bg-[#2c2c2c] border-none rounded-3xl focus:border-blue-500 text-white placeholder-gray-400 h-10"
          />
        </div>
      </div>

      {/* Login or User Dropdown */}
      <div className="flex items-center space-x-4">
        {!user ? (
          <Button onClick={() => setLoginOpen(true)}>Login</Button>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="ghost" className="flex items-center space-x-2">
                <img
                  src={user.imageUrl}
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className="hidden md:inline">{user.username}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-56 bg-gray-900 rounded-lg shadow-lg border border-gray-700"
              align="end"
              forceMount
            >
              <DropdownMenuItem className="flex flex-col items-start gap-1 px-4 py-3 border-b border-gray-700">
                <p className="font-semibold text-gray-100">{user.username}</p>
                <p className="text-xs text-gray-400">{user.email}</p>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={handleWatchList}
                className="px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-gray-300 transition rounded-md"
              >
                Watchlist
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={logout}
                className="px-4 py-2 text-red-500 hover:bg-red-600 hover:text-white transition rounded-md"
              >
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* Search Component */}
      <SearchComponent
        isActive={isSearchActive}
        onClose={() => setIsSearchActive(false)}
      />

      {/* Login Dialog */}
      <LoginDialog open={loginOpen} onOpenChange={setLoginOpen} />
    </header>
  );
};

export default Header;