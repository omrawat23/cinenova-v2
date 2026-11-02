import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Sparkles } from 'lucide-react';
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
    <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-white/[0.06] bg-[#10131a]/90 px-4 py-4 backdrop-blur-xl sm:px-6">
      {/* Search and Category Selection */}
      <div className="flex min-w-0 items-center gap-3">
        <Select defaultValue="all" onValueChange={handleChange}>
          <SelectTrigger className="hidden h-10 w-[115px] rounded-full border-white/10 bg-white/[0.05] pl-4 text-sm sm:flex">
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="movies">Movies</SelectItem>
            <SelectItem value="tv">TV Shows</SelectItem>
          </SelectContent>
        </Select>

        <div
          className="relative flex min-w-0 w-[min(48vw,360px)]"
          onClick={() => setIsSearchActive(true)}
        >
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" />
          <Input
            type="text"
            placeholder="Search ..."
            readOnly
            className="h-10 w-full rounded-full border-white/10 bg-white/[0.05] pl-10 text-white placeholder:text-white/35 focus:border-[#6B97FF] focus:ring-0"
          />
        </div>
      </div>

      {/* Login or User Dropdown and Support Button */}
      <div className="flex items-center gap-2">
        {!user ? (
          <Button variant="outline" className="rounded-full border-white/15 bg-transparent" onClick={() => setLoginOpen(true)}>Login</Button>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="ghost" className="flex items-center gap-2 rounded-full">
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
            <Button variant="outline" className="rounded-full border-[#6B97FF]/40 text-[#b8caff]"><Sparkles className="mr-2 h-4 w-4" />Support</Button>
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
