import React from 'react';
import { Search, Bookmark, Radio, Moon, Sun, ArrowUpRight } from 'lucide-react';
import { TradingViewLogo } from '../common/TradingViewLogo';

interface HeaderProps {
  onOpenSearch: () => void;
  onToggleWatchlist: () => void;
  watchlistCount: number;
  isLive: boolean;
  onToggleLive: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  activeNav?: string;
  onSelectNav?: (nav: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSearch,
  onToggleWatchlist,
  watchlistCount,
  isLive,
  onToggleLive,
  isDarkMode,
  onToggleDarkMode,
  activeNav = 'Markets',
  onSelectNav,
}) => {
  const navItems = ['Products', 'Community', 'Markets', 'News', 'Brokers'];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#2a2e39] bg-[#131722]/95 backdrop-blur-md px-4 lg:px-8 py-2.5">
      <div className="mx-auto flex h-10 items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark with TradingView Logo */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onSelectNav?.('Markets')}
            className="flex items-center gap-2 hover:opacity-90 transition-opacity focus:outline-none"
          >
            <TradingViewLogo />
          </button>
        </div>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#787b86]">
          {navItems.map((item) => {
            const isActive = item === activeNav;
            return (
              <button
                key={item}
                onClick={() => onSelectNav?.(item)}
                className={`transition-colors whitespace-nowrap hover:text-white ${
                  isActive ? 'text-white font-semibold' : ''
                }`}
              >
                {item}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1-2 primary actions + Search + Watchlist */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Quick Search Button */}
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-md bg-[#1e222d] hover:bg-[#2a2e39] text-[#787b86] hover:text-[#d1d4dc] border border-[#2a2e39] transition-colors text-xs font-medium cursor-pointer"
            title="Search symbols (Ctrl+K)"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Search markets</span>
            <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono rounded bg-[#131722] text-[#787b86] border border-[#2a2e39]">
              ⌘K
            </kbd>
          </button>

          {/* Live Data Stream Status / Toggle */}
          <button
            onClick={onToggleLive}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors border ${
              isLive
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
            }`}
            title={isLive ? 'Live streaming feed active' : 'Live stream paused'}
          >
            <Radio className={`w-3.5 h-3.5 ${isLive ? 'animate-pulse' : ''}`} />
            <span className="hidden lg:inline">{isLive ? 'Live' : 'Paused'}</span>
          </button>

          {/* Watchlist Drawer Trigger */}
          <button
            onClick={onToggleWatchlist}
            className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#1e222d] hover:bg-[#2a2e39] text-[#d1d4dc] border border-[#2a2e39] transition-colors text-xs font-medium"
            title="Open Watchlist"
          >
            <Bookmark className="w-3.5 h-3.5 text-[#2962ff]" />
            <span className="hidden sm:inline">Watchlist</span>
            {watchlistCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-[#2962ff] text-white text-[10px] flex items-center justify-center font-bold">
                {watchlistCount}
              </span>
            )}
          </button>

          {/* Dark / Light Toggle */}
          <button
            onClick={onToggleDarkMode}
            className="p-1.5 rounded-md text-[#787b86] hover:text-[#d1d4dc] hover:bg-[#1e222d] transition-colors"
            title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            aria-label="Toggle theme"
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Primary CTA */}
          <button
            onClick={() => onSelectNav?.('Products')}
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-[#2962ff] hover:bg-[#1e53e5] rounded-md transition-colors whitespace-nowrap shadow-sm shadow-blue-500/20"
          >
            <span>Get started</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
