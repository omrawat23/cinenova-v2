import React from "react"
import { Analytics } from "@vercel/analytics/react"
import { NavigationLinks, SearchProvider } from "./components/NavigationLinks"
import { Header } from "./components/Header"
import { MobileNav } from "./components/mobile-nav"
import { Bookmark, History, Sparkles } from "lucide-react"
import { Link } from "react-router-dom"
import CinenovaLogo from "./components/CinenovaLogo"

interface LayoutProps {
  children: React.ReactNode
}


const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#0b0d12] text-white">
      <div className="mx-auto flex min-h-screen max-w-[1600px] gap-4 px-3 py-3 sm:px-5 lg:px-6">
        <aside className="hidden w-60 shrink-0 flex-col rounded-[28px] border border-white/[0.08] bg-white/[0.035] p-4 backdrop-blur-xl md:flex">
          <div className="px-3 py-3">
            <CinenovaLogo />
            <div className="mt-4 flex items-center gap-2 text-xs text-white/45">
              <Sparkles className="h-3.5 w-3.5 text-[#6B97FF]" />
              <span>Curated for your next watch</span>
            </div>
          </div>
          <div className="mt-7 flex-1">
            <SearchProvider>
              <NavigationLinks />
            </SearchProvider>
          </div>
          <div className="space-y-1 border-t border-white/[0.08] pt-4">
            <Link to="/history" className="nav-item">
              <History className="h-4 w-4" />
              <span>History</span>
            </Link>
            <Link to="/watchlist" className="nav-item">
              <Bookmark className="h-4 w-4" />
              <span>Watchlist</span>
            </Link>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-[28px] border border-white/[0.08] bg-[#10131a]/80">
          <div className="scrollbar-hide flex-1 overflow-y-auto">
          <main>
            <Header />
            {children}
            <Analytics />
          </main>

          <div className="mt-12 md:hidden">
            <MobileNav />
          </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Layout
