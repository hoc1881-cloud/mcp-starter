import React, { useState } from 'react';
import { ArrowUpRight, ArrowDownRight, Layers, Flame } from 'lucide-react';
import { HeatmapItem, SymbolData } from '../../types/market';
import { SP500_HEATMAP, CRYPTO_HEATMAP } from '../../data/marketData';

interface HeatmapScreenProps {
  symbols: SymbolData[];
  onSelectSymbol: (symbol: SymbolData) => void;
}

export const HeatmapScreen: React.FC<HeatmapScreenProps> = ({
  symbols,
  onSelectSymbol,
}) => {
  const [heatmapType, setHeatmapType] = useState<'stocks' | 'crypto'>('stocks');
  const [selectedSector, setSelectedSector] = useState<string>('All');
  const [hoveredItem, setHoveredItem] = useState<HeatmapItem | null>(null);

  const rawItems = heatmapType === 'stocks' ? SP500_HEATMAP : CRYPTO_HEATMAP;

  // Filter items
  const items = rawItems.filter((item) => {
    if (selectedSector === 'All') return true;
    return item.sector === selectedSector;
  });

  const totalCap = items.reduce((acc, curr) => acc + curr.marketCap, 0);

  // Group by sector
  const sectors = ['All', ...Array.from(new Set(rawItems.map((i) => i.sector)))];

  // Helper for heatmap background color
  const getTileBg = (change: number) => {
    if (change >= 4) return 'bg-[#089981] border-[#0aa88f]';
    if (change >= 2) return 'bg-[#089981]/80 border-[#089981]';
    if (change > 0) return 'bg-[#089981]/50 border-[#089981]/60';
    if (change === 0) return 'bg-[#2a2e39] border-[#363c4e]';
    if (change > -2) return 'bg-[#f23645]/50 border-[#f23645]/60';
    if (change > -4) return 'bg-[#f23645]/80 border-[#f23645]';
    return 'bg-[#f23645] border-[#f44754]';
  };

  const handleClick = (item: HeatmapItem) => {
    // Find matching symbol in symbol list
    const found =
      symbols.find((s) => s.ticker === item.ticker) ||
      symbols.find((s) => s.ticker.startsWith(item.ticker));
    if (found) {
      onSelectSymbol(found);
    }
  };

  return (
    <div className="py-6 px-4 lg:px-8 max-w-7xl mx-auto space-y-6">
      {/* Title & Controls */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Flame className="w-6 h-6 text-amber-400" />
            <h1 className="text-2xl font-bold text-white tracking-tight">Market Treemap Heatmap</h1>
          </div>
          <p className="text-sm text-[#787b86] mt-1">
            Visual map of market capitalizations and daily returns. Size represents market cap; color indicates performance.
          </p>
        </div>

        {/* Heatmap Type Switcher */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-[#1e222d] p-1 rounded-lg border border-[#2a2e39]">
            <button
              onClick={() => {
                setHeatmapType('stocks');
                setSelectedSector('All');
              }}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                heatmapType === 'stocks'
                  ? 'bg-[#2962ff] text-white shadow-xs'
                  : 'text-[#787b86] hover:text-white'
              }`}
            >
              S&P 500 Stocks
            </button>
            <button
              onClick={() => {
                setHeatmapType('crypto');
                setSelectedSector('All');
              }}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                heatmapType === 'crypto'
                  ? 'bg-[#2962ff] text-white shadow-xs'
                  : 'text-[#787b86] hover:text-white'
              }`}
            >
              Top Cryptos
            </button>
          </div>
        </div>
      </div>

      {/* Sector filter & Legend */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#1e222d] p-3 rounded-xl border border-[#2a2e39]">
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
          {sectors.map((sec) => (
            <button
              key={sec}
              onClick={() => setSelectedSector(sec)}
              className={`px-2.5 py-1 text-xs rounded-md font-medium whitespace-nowrap transition-colors ${
                selectedSector === sec
                  ? 'bg-[#2a2e39] text-white'
                  : 'text-[#787b86] hover:text-white'
              }`}
            >
              {sec}
            </button>
          ))}
        </div>

        {/* Color Legend */}
        <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#787b86] self-end sm:self-auto shrink-0">
          <span>-3%</span>
          <div className="flex h-3 w-28 rounded overflow-hidden">
            <div className="bg-[#f23645] w-1/4 h-full" />
            <div className="bg-[#f23645]/50 w-1/4 h-full" />
            <div className="bg-[#089981]/50 w-1/4 h-full" />
            <div className="bg-[#089981] w-1/4 h-full" />
          </div>
          <span>+3%</span>
        </div>
      </div>

      {/* Interactive Treemap Canvas Container */}
      <div className="relative min-h-[500px] bg-[#131722] p-2 rounded-xl border border-[#2a2e39] overflow-hidden">
        {/* Responsive Grid layout sized by weighting */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 min-h-[480px]">
          {items.map((item) => {
            const isUp = item.changePercent >= 0;
            const weightShare = (item.marketCap / totalCap) * 100;

            // Determine relative tile size class
            let colSpan = 'col-span-1 row-span-1';
            if (weightShare > 15) {
              colSpan = 'col-span-2 row-span-2 sm:col-span-2 sm:row-span-2';
            } else if (weightShare > 8) {
              colSpan = 'col-span-2 row-span-1 sm:col-span-1 sm:row-span-2';
            }

            return (
              <div
                key={item.ticker}
                onClick={() => handleClick(item)}
                onMouseEnter={() => setHoveredItem(item)}
                onMouseLeave={() => setHoveredItem(null)}
                className={`${colSpan} ${getTileBg(
                  item.changePercent
                )} rounded-lg border p-3 flex flex-col justify-between cursor-pointer hover:scale-[1.01] hover:brightness-110 transition-all duration-150 relative group shadow-sm`}
              >
                <div>
                  <div className="flex items-start justify-between">
                    <span className="font-extrabold text-sm md:text-base text-white tracking-tight drop-shadow-xs">
                      {item.ticker}
                    </span>
                    <span className="text-[10px] text-white/70 font-mono hidden sm:inline">
                      {item.sector}
                    </span>
                  </div>
                  <div className="text-[11px] text-white/80 truncate max-w-[120px] drop-shadow-xs">
                    {item.name}
                  </div>
                </div>

                <div className="mt-2">
                  <div className="font-mono tabular-nums text-xs md:text-sm font-bold text-white drop-shadow-xs">
                    ${item.price < 5 ? item.price.toFixed(3) : item.price.toLocaleString()}
                  </div>
                  <div className="font-mono tabular-nums text-xs font-bold text-white flex items-center gap-0.5 drop-shadow-xs">
                    {isUp ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                    <span>{isUp ? '+' : ''}{item.changePercent.toFixed(2)}%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Hover Floating Details Tooltip */}
        {hoveredItem && (
          <div className="pointer-events-none absolute bottom-4 left-4 z-20 p-3 rounded-lg bg-[#1e222d]/95 backdrop-blur-md border border-[#2a2e39] text-xs shadow-xl min-w-[200px]">
            <div className="flex items-center justify-between font-bold text-white mb-1">
              <span>{hoveredItem.ticker}</span>
              <span className="text-[10px] text-[#787b86]">{hoveredItem.sector}</span>
            </div>
            <div className="text-[#d1d4dc] text-[11px] mb-2">{hoveredItem.name}</div>
            <div className="flex justify-between text-[#787b86] text-[11px] font-mono">
              <span>Market Cap:</span>
              <span className="text-white">${hoveredItem.marketCap}B</span>
            </div>
            <div className="flex justify-between text-[#787b86] text-[11px] font-mono mt-0.5">
              <span>Price:</span>
              <span className="text-white font-bold">${hoveredItem.price.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-[#787b86] text-[11px] font-mono mt-0.5">
              <span>Day Return:</span>
              <span className={hoveredItem.changePercent >= 0 ? 'text-[#089981] font-bold' : 'text-[#f23645] font-bold'}>
                {hoveredItem.changePercent >= 0 ? '+' : ''}{hoveredItem.changePercent.toFixed(2)}%
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
