import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from 'lucide-react';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { LoginDialog } from "@/components/LoginButton";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import SearchComponent from "./SearchComponent";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import image from '../assets/qr.jpg'

export const Header: React.FC = () => {
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleWatchList = () => {
    navigate(`/watchlist`);
  };

  const handleChange = (value: string) => {
    const urlMap: Record<string, string> = {
      all: '/',
      movies: '/movies',
      tv: '/tv-series',
    };

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

      {/* Login or User Dropdown and Support Button */}
      <div className="flex items-center space-x-4 sm:mr-4">
        {!user ? (
          <Button variant="outline" onClick={() => setLoginOpen(true)}>Login</Button>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="ghost" className="flex items-center space-x-2">
                <img
                  src={user.imageUrl}
                  
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

        {/* Support Button and Dialog */}
        <div className="hidden sm:flex">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Support 💗</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-[#1a1b1e] border-gray-800">
            <DialogHeader className="relative">
              <DialogTitle className="text-center text-xl font-semibold text-white">Donate Money</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col items-center space-y-4 px-4 pb-6">
              <p className="text-center text-gray-200">
                Support us by donating money to the following UPI address:
              </p>
              <div className="bg-[#2a2b2e] w-full p-3 rounded text-center">
              <code className="text-purple-400 text-sm break-all">
              <a
                href="https://buymeacoffee.com/omrawat23"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-purple-300"
              >
                https://buymeacoffee.com/omrawat23
              </a>
            </code>
              </div>
              <img
                src={image}
                alt="Bitcoin QR Code"
                className="w-48 h-48"
              />
            </div>
          </DialogContent>
        </Dialog>
        </div>
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

