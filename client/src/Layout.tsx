import React from "react"
import { Analytics } from "@vercel/analytics/react"
import { NavigationLinks, SearchProvider } from "./components/NavigationLinks"
import { Header } from "./components/Header"
import { MobileNav } from "./components/mobile-nav"
import { Bookmark,History } from "lucide-react"
import { Link } from "react-router-dom"
import CinenovaLogo from "./components/CinenovaLogo"

interface LayoutProps {
  children: React.ReactNode
}


const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen bg-neoDark text-white overflow-hidden">
    {/* Sidebar */}
    <div className="hidden flex-shrink-0 md:flex flex-col w-44 lg:w-64 my-8 ml-8 mr-4 rounded-2xl shadow-2xl relative overflow-hidden bg-[#1E1E1E]">
      {/* Gradient overlay */}
      <div
        className="absolute top-0 left-0 w-full h-full opacity-90 pointer-events-none"
      ></div>

      {/* Logo Section */}
      <div className="relative z-10 px-6 pt-6">
        <CinenovaLogo />
      </div>

      {/* Navigation Links */}
      <div className="px-4 mt-6 space-y-2">
      <SearchProvider>
        <NavigationLinks />
      </SearchProvider>
      </div>

      {/* Footer Section */}
      <div className="mt-auto px-4 pb-6 space-y-2">
        <div className="border-t border-gray-700 pt-4 space-y-2">
          <Link
            to="/history"
            className="flex items-center space-x-3 p-3 text-gray-400 hover:text-white hover:bg-blue-500/10 rounded-xl transition-all duration-200 group"
          >
            <History className="w-5 h-5 text-gray-500 group-hover:text-blue-500 transition-colors" />
            <span className="font-medium group-hover:text-white">History</span>
          </Link>
          <Link
            to="/watchlist"
            className="flex items-center space-x-3 p-3 text-gray-400 hover:text-white hover:bg-blue-500/10 rounded-xl transition-all duration-200 group"
          >
            <Bookmark className="w-5 h-5 text-gray-500 group-hover:text-blue-500 transition-colors" />
            <span className="font-medium group-hover:text-white">Watchlist</span>
          </Link>
        </div>
      </div>
    </div>

      {/* Middle Section */}
      <div className="my-4 p-4 flex-grow flex flex-col overflow-hidden">

        <div className="flex-grow overflow-y-auto scrollbar-hide scroll-smooth rounded-2xl">
          <main>
            <Header />
            {children}
            <Analytics />
          </main>

          <div className="md:hidden mt-12">

          <MobileNav />


          </div>
        </div>
      </div>
    </div>
  )
}

export default Layout
