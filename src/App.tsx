/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { MarketCategory, Region, SymbolData } from './types/market';
import { useLiveMarketData } from './hooks/useLiveMarketData';
import { Header } from './components/layout/Header';
import { TickerTape } from './components/layout/TickerTape';
import { MarketsSubNav } from './components/layout/MarketsSubNav';
import { HeroMarketPulse } from './components/markets/HeroMarketPulse';
import { OverviewScreen } from './components/markets/OverviewScreen';
import { StocksScreen } from './components/markets/StocksScreen';
import { CryptoScreen } from './components/markets/CryptoScreen';
import { ForexScreen } from './components/markets/ForexScreen';
import { IndicesScreen } from './components/markets/IndicesScreen';
import { FuturesScreen } from './components/markets/FuturesScreen';
import { HeatmapScreen } from './components/markets/HeatmapScreen';
import { SymbolChartModal } from './components/modals/SymbolChartModal';
import { SymbolSearchModal } from './components/modals/SymbolSearchModal';
import { WatchlistDrawer } from './components/watchlist/WatchlistDrawer';
import { Footer } from './components/layout/Footer';
import { Bell, X } from 'lucide-react';

export default function App() {
  const {
    symbols,
    isLive,
    setIsLive,
    flashingTicks,
    watchlistTickers,
    toggleWatchlist,
    paperBalance,
    paperPositions,
    executePaperTrade,
    alerts,
    addAlert,
    removeAlert,
    triggeredAlerts,
    dismissAlert,
  } = useLiveMarketData();

  // Navigation state
  const [activeCategory, setActiveCategory] = useState<MarketCategory>('overview');
  const [selectedRegion, setSelectedRegion] = useState<Region>('us');
  const [activeHeaderNav, setActiveHeaderNav] = useState<string>('Markets');

  // Modals & Drawers state
  const [selectedSymbol, setSelectedSymbol] = useState<SymbolData | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isWatchlistOpen, setIsWatchlistOpen] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);

  // Keyboard shortcut: Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Update selectedSymbol reference if its live price updates
  const currentModalSymbol = selectedSymbol
    ? symbols.find((s) => s.ticker === selectedSymbol.ticker) || selectedSymbol
    : null;

  return (
    <div className={`min-h-screen flex flex-col ${isDarkMode ? 'dark bg-[#131722] text-[#d1d4dc]' : 'bg-[#f8f9fd] text-[#131722]'}`}>
      {/* 1. Top Header */}
      <Header
        onOpenSearch={() => setIsSearchOpen(true)}
        onToggleWatchlist={() => setIsWatchlistOpen(!isWatchlistOpen)}
        watchlistCount={watchlistTickers.length}
        isLive={isLive}
        onToggleLive={() => setIsLive(!isLive)}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        activeNav={activeHeaderNav}
        onSelectNav={(nav) => {
          setActiveHeaderNav(nav);
          if (nav === 'Markets') setActiveCategory('overview');
        }}
      />

      {/* 2. Live Streaming Ticker Tape */}
      <TickerTape
        symbols={symbols}
        flashingTicks={flashingTicks}
        onSelectSymbol={(sym) => setSelectedSymbol(sym)}
      />

      {/* 3. Sub-navigation tabs (Overview, Stocks, Crypto, Forex, Indices, Futures, Heatmap) */}
      <MarketsSubNav
        activeCategory={activeCategory}
        onSelectCategory={(cat) => setActiveCategory(cat)}
        selectedRegion={selectedRegion}
        onSelectRegion={(reg) => setSelectedRegion(reg)}
      />

      {/* Triggered Alerts Notification Banner */}
      {triggeredAlerts.length > 0 && (
        <div className="w-full bg-amber-500/15 border-b border-amber-500/30 px-4 py-2 flex items-center justify-between text-xs text-amber-300">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-amber-400 animate-bounce" />
            <span className="font-semibold">{triggeredAlerts[0]}</span>
          </div>
          <button
            onClick={() => dismissAlert(0)}
            className="text-amber-400 hover:text-white p-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Screens Content */}
      <main className="flex-1">
        {/* Hero Pulse Bar (Shown on overview and whenever user wants top macro pulse) */}
        {activeCategory === 'overview' && (
          <HeroMarketPulse
            symbols={symbols}
            flashingTicks={flashingTicks}
            onSelectSymbol={(sym) => setSelectedSymbol(sym)}
          />
        )}

        {/* View Routing */}
        {activeCategory === 'overview' && (
          <OverviewScreen
            symbols={symbols}
            flashingTicks={flashingTicks}
            onSelectSymbol={(sym) => setSelectedSymbol(sym)}
            onNavigateToCategory={(cat) => setActiveCategory(cat)}
          />
        )}

        {activeCategory === 'stocks' && (
          <StocksScreen
            symbols={symbols}
            flashingTicks={flashingTicks}
            watchlistTickers={watchlistTickers}
            onToggleWatchlist={toggleWatchlist}
            onSelectSymbol={(sym) => setSelectedSymbol(sym)}
          />
        )}

        {activeCategory === 'crypto' && (
          <CryptoScreen
            symbols={symbols}
            flashingTicks={flashingTicks}
            watchlistTickers={watchlistTickers}
            onToggleWatchlist={toggleWatchlist}
            onSelectSymbol={(sym) => setSelectedSymbol(sym)}
          />
        )}

        {activeCategory === 'forex' && (
          <ForexScreen
            symbols={symbols}
            flashingTicks={flashingTicks}
            watchlistTickers={watchlistTickers}
            onToggleWatchlist={toggleWatchlist}
            onSelectSymbol={(sym) => setSelectedSymbol(sym)}
          />
        )}

        {activeCategory === 'indices' && (
          <IndicesScreen
            symbols={symbols}
            flashingTicks={flashingTicks}
            onSelectSymbol={(sym) => setSelectedSymbol(sym)}
          />
        )}

        {activeCategory === 'futures' && (
          <FuturesScreen
            symbols={symbols}
            flashingTicks={flashingTicks}
            onSelectSymbol={(sym) => setSelectedSymbol(sym)}
          />
        )}

        {activeCategory === 'bonds' && (
          <FuturesScreen
            symbols={symbols}
            flashingTicks={flashingTicks}
            onSelectSymbol={(sym) => setSelectedSymbol(sym)}
          />
        )}

        {activeCategory === 'heatmap' && (
          <HeatmapScreen
            symbols={symbols}
            onSelectSymbol={(sym) => setSelectedSymbol(sym)}
          />
        )}
      </main>

      {/* TradingView Interactive Chart Modal */}
      {currentModalSymbol && (
        <SymbolChartModal
          symbol={currentModalSymbol}
          onClose={() => setSelectedSymbol(null)}
          isWatched={watchlistTickers.includes(currentModalSymbol.ticker)}
          onToggleWatchlist={toggleWatchlist}
          onAddAlert={addAlert}
          onExecuteTrade={executePaperTrade}
          paperBalance={paperBalance}
        />
      )}

      {/* Symbol Search Modal (Ctrl+K) */}
      <SymbolSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        symbols={symbols}
        onSelectSymbol={(sym) => setSelectedSymbol(sym)}
      />

      {/* Slide-out Watchlist Drawer */}
      <WatchlistDrawer
        isOpen={isWatchlistOpen}
        onClose={() => setIsWatchlistOpen(false)}
        watchlistTickers={watchlistTickers}
        symbols={symbols}
        flashingTicks={flashingTicks}
        onSelectSymbol={(sym) => setSelectedSymbol(sym)}
        onRemoveFromWatchlist={toggleWatchlist}
        paperBalance={paperBalance}
        paperPositions={paperPositions}
        alerts={alerts}
        onRemoveAlert={removeAlert}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}
