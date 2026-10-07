import React, { useState, useMemo } from 'react';
import { ArrowUpRight, ArrowDownRight, Search, Star, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { SymbolData } from '../../types/market';
import { SymbolAvatar } from '../common/SymbolAvatar';
import { SparklineChart } from '../common/SparklineChart';

interface StocksScreenProps {
  symbols: SymbolData[];
  flashingTicks: Record<string, 'up' | 'down'>;
  watchlistTickers: string[];
  onToggleWatchlist: (ticker: string) => void;
  onSelectSymbol: (symbol: SymbolData) => void;
}

export const StocksScreen: React.FC<StocksScreenProps> = ({
  symbols,
  flashingTicks,
  watchlistTickers,
  onToggleWatchlist,
  onSelectSymbol,
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'gainers' | 'losers' | 'active' | '52whigh'>('all');
  const [selectedSector, setSelectedSector] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'marketCap' | 'changePercent' | 'volume' | 'price'>('marketCap');
  const [sortAsc, setSortAsc] = useState<boolean>(false);

  const stockList = useMemo(() => {
    let list = symbols.filter((s) => s.category === 'stock');

    // Filter by sector
    if (selectedSector !== 'All') {
      list = list.filter((s) => s.sector === selectedSector);
    }

    // Filter by tab
    if (activeFilter === 'gainers') {
      list = list.filter((s) => s.changePercent > 0).sort((a, b) => b.changePercent - a.changePercent);
    } else if (activeFilter === 'losers') {
      list = list.filter((s) => s.changePercent < 0).sort((a, b) => a.changePercent - b.changePercent);
    } else if (activeFilter === 'active') {
      list = [...list].sort((a, b) => (b.volumeRaw || 0) - (a.volumeRaw || 0));
    } else if (activeFilter === '52whigh') {
      list = list.filter((s) => s.price >= s.high52w * 0.95);
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((s) => s.ticker.toLowerCase().includes(q) || s.name.toLowerCase().includes(q));
    }

    // Sort
    list = [...list].sort((a, b) => {
      let valA = 0;
      let valB = 0;
      if (sortBy === 'marketCap') {
        valA = a.marketCapRaw || 0;
        valB = b.marketCapRaw || 0;
      } else if (sortBy === 'changePercent') {
        valA = a.changePercent;
        valB = b.changePercent;
      } else if (sortBy === 'volume') {
        valA = a.volumeRaw || 0;
        valB = b.volumeRaw || 0;
      } else if (sortBy === 'price') {
        valA = a.price;
        valB = b.price;
      }
      return sortAsc ? valA - valB : valB - valA;
    });

    return list;
  }, [symbols, selectedSector, activeFilter, searchQuery, sortBy, sortAsc]);

  const sectors = ['All', 'Technology', 'Healthcare', 'Financial', 'Consumer Cyclical', 'Communication Services'];

  const handleSort = (field: 'marketCap' | 'changePercent' | 'volume' | 'price') => {
    if (sortBy === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortBy(field);
      setSortAsc(false);
    }
  };

  return (
    <div className="py-6 px-4 lg:px-8 max-w-7xl mx-auto space-y-6">
      {/* Title & Description */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Stocks & Equities Screener</h1>
          <p className="text-sm text-[#787b86] mt-1">
            Real-time scanner across United States and global equity markets with fundamental and technical indicators.
          </p>
        </div>

        {/* Search input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#787b86]" />
          <input
            type="text"
            placeholder="Filter stocks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#1e222d] border border-[#2a2e39] rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-[#787b86] focus:outline-none focus:border-[#2962ff]"
          />
        </div>
      </div>

      {/* Filter Tabs & Sector Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#1e222d] p-3 rounded-xl border border-[#2a2e39]">
        {/* Preset Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
          {[
            { id: 'all', label: 'All Equities' },
            { id: 'gainers', label: 'Top Gainers' },
            { id: 'losers', label: 'Top Losers' },
            { id: 'active', label: 'Most Active' },
            { id: '52whigh', label: '52W Highs' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id as any)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${
                activeFilter === tab.id
                  ? 'bg-[#2962ff] text-white shadow-xs'
                  : 'text-[#787b86] hover:text-white hover:bg-[#2a2e39]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Sector Filter */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-xs text-[#787b86] flex items-center gap-1">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Sector:
          </span>
          <select
            value={selectedSector}
            onChange={(e) => setSelectedSector(e.target.value)}
            className="bg-[#131722] border border-[#2a2e39] text-[#d1d4dc] text-xs rounded-md px-2.5 py-1 focus:outline-none focus:border-[#2962ff]"
          >
            {sectors.map((sec) => (
              <option key={sec} value={sec}>
                {sec}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Stock Data Table */}
      <div className="bg-[#1e222d] rounded-xl border border-[#2a2e39] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#2a2e39] bg-[#181c27] text-[#787b86] font-semibold text-[11px]">
                <th className="py-3 px-3 w-10 text-center">★</th>
                <th className="py-3 px-3">Symbol & Name</th>
                <th
                  onClick={() => handleSort('price')}
                  className="py-3 px-3 text-right cursor-pointer hover:text-white"
                >
                  <div className="inline-flex items-center gap-1">
                    <span>Price</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('changePercent')}
                  className="py-3 px-3 text-right cursor-pointer hover:text-white"
                >
                  <div className="inline-flex items-center gap-1">
                    <span>Change %</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('volume')}
                  className="py-3 px-3 text-right cursor-pointer hover:text-white hidden sm:table-cell"
                >
                  <div className="inline-flex items-center gap-1">
                    <span>Volume</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('marketCap')}
                  className="py-3 px-3 text-right cursor-pointer hover:text-white hidden md:table-cell"
                >
                  <div className="inline-flex items-center gap-1">
                    <span>Market Cap</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-3 text-right hidden lg:table-cell">P/E Ratio</th>
                <th className="py-3 px-3 text-center hidden lg:table-cell">52W Range</th>
                <th className="py-3 px-3 text-center">Technical</th>
                <th className="py-3 px-3 text-center hidden sm:table-cell">Trend</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#2a2e39]/50">
              {stockList.map((stock) => {
                const isUp = stock.change >= 0;
                const flash = flashingTicks[stock.ticker];
                const isWatched = watchlistTickers.includes(stock.ticker);

                // 52W range progress
                const range52 = stock.high52w - stock.low52w || 1;
                const pos52 = Math.min(100, Math.max(0, ((stock.price - stock.low52w) / range52) * 100));

                return (
                  <tr
                    key={stock.ticker}
                    onClick={() => onSelectSymbol(stock)}
                    className={`hover:bg-[#252a37] transition-colors cursor-pointer ${
                      flash === 'up'
                        ? 'bg-[#089981]/10'
                        : flash === 'down'
                        ? 'bg-[#f23645]/10'
                        : ''
                    }`}
                  >
                    {/* Watchlist star */}
                    <td
                      className="py-3 px-3 text-center"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleWatchlist(stock.ticker);
                      }}
                    >
                      <button className="text-[#787b86] hover:text-amber-400 transition-colors">
                        <Star
                          className={`w-4 h-4 ${
                            isWatched ? 'fill-amber-400 text-amber-400' : ''
                          }`}
                        />
                      </button>
                    </td>

                    {/* Symbol & Name */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2.5">
                        <SymbolAvatar
                          ticker={stock.ticker}
                          name={stock.name}
                          category={stock.category}
                          logoUrl={stock.logoUrl}
                          size="md"
                        />
                        <div>
                          <div className="font-bold text-white tracking-tight flex items-center gap-1.5">
                            <span>{stock.ticker}</span>
                            <span className="text-[10px] text-[#787b86] font-normal">{stock.exchange}</span>
                          </div>
                          <div className="text-[11px] text-[#787b86] truncate max-w-[150px]">
                            {stock.name}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Price */}
                    <td className="py-3 px-3 text-right font-mono tabular-nums font-bold text-white text-sm">
                      ${stock.price.toFixed(2)}
                    </td>

                    {/* Change % */}
                    <td className="py-3 px-3 text-right">
                      <div
                        className={`font-mono tabular-nums font-bold inline-flex items-center gap-0.5 ${
                          isUp ? 'text-[#089981]' : 'text-[#f23645]'
                        }`}
                      >
                        {isUp ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                        <span>
                          {isUp ? '+' : ''}
                          {stock.changePercent.toFixed(2)}%
                        </span>
                      </div>
                      <div className="text-[10px] text-[#787b86] font-mono tabular-nums">
                        {isUp ? '+' : ''}
                        {stock.change.toFixed(2)}
                      </div>
                    </td>

                    {/* Volume */}
                    <td className="py-3 px-3 text-right font-mono tabular-nums text-[#d1d4dc] hidden sm:table-cell">
                      {stock.volume}
                    </td>

                    {/* Market Cap */}
                    <td className="py-3 px-3 text-right font-mono tabular-nums text-white font-medium hidden md:table-cell">
                      {stock.marketCap}
                    </td>

                    {/* P/E Ratio */}
                    <td className="py-3 px-3 text-right font-mono tabular-nums text-[#787b86] hidden lg:table-cell">
                      {stock.peRatio ? stock.peRatio.toFixed(1) : '-'}
                    </td>

                    {/* 52W Range Bar */}
                    <td className="py-3 px-3 text-center hidden lg:table-cell">
                      <div className="w-24 mx-auto">
                        <div className="flex justify-between text-[9px] font-mono text-[#787b86] mb-0.5">
                          <span>${stock.low52w.toFixed(0)}</span>
                          <span>${stock.high52w.toFixed(0)}</span>
                        </div>
                        <div className="w-full h-1.5 bg-[#131722] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#2962ff] rounded-full"
                            style={{ width: `${pos52}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Technical Rating */}
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded border whitespace-nowrap ${
                          stock.rating.includes('Buy')
                            ? 'text-[#089981] bg-[#089981]/10 border-[#089981]/25'
                            : stock.rating.includes('Sell')
                            ? 'text-[#f23645] bg-[#f23645]/10 border-[#f23645]/25'
                            : 'text-slate-400 bg-slate-500/10 border-slate-500/20'
                        }`}
                      >
                        {stock.rating}
                      </span>
                    </td>

                    {/* Sparkline */}
                    <td className="py-3 px-3 text-center hidden sm:table-cell">
                      <SparklineChart
                        data={stock.sparkline}
                        width={64}
                        height={20}
                        isPositive={isUp}
                        showFill={false}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
