import React, { useState } from 'react';
import { ArrowUpRight, ArrowDownRight, TrendingUp } from 'lucide-react';
import { SymbolData } from '../../types/market';
import { SparklineChart } from '../common/SparklineChart';
import { SymbolAvatar } from '../common/SymbolAvatar';

interface HeroMarketPulseProps {
  symbols: SymbolData[];
  flashingTicks: Record<string, 'up' | 'down'>;
  onSelectSymbol: (symbol: SymbolData) => void;
}

export const HeroMarketPulse: React.FC<HeroMarketPulseProps> = ({
  symbols,
  flashingTicks,
  onSelectSymbol,
}) => {
  const [timeframes, setTimeframes] = useState<Record<string, string>>({
    SPX: '1D',
    NDX: '1D',
    BTCUSD: '1D',
    'GC1!': '1D',
  });

  const featuredTickers = ['SPX', 'NDX', 'BTCUSD', 'GC1!'];
  const featured = featuredTickers
    .map((t) => symbols.find((s) => s.ticker === t))
    .filter(Boolean) as SymbolData[];

  const handleTimeframeClick = (e: React.MouseEvent, ticker: string, tf: string) => {
    e.stopPropagation();
    setTimeframes((prev) => ({ ...prev, [ticker]: tf }));
  };

  return (
    <section className="w-full py-6 px-4 lg:px-8 border-b border-[#2a2e39]/60">
      <div className="mx-auto max-w-7xl">
        {/* Section Editorial Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white font-sans">
              Markets overview
            </h1>
            <p className="text-sm text-[#787b86] mt-1 max-w-2xl text-balance">
              Track global macro benchmarks, equities, cryptocurrencies, currencies, and commodities in real-time.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#787b86]">
            <span>Data updated real-time</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-400 font-medium">BATS & CME Streaming</span>
          </div>
        </div>

        {/* 4 Benchmark Hero Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {featured.map((item) => {
            const isUp = item.change >= 0;
            const flash = flashingTicks[item.ticker];
            const currentTf = timeframes[item.ticker] || '1D';

            // Slight variations for simulated timeframes
            let displayData = item.sparkline;
            if (currentTf === '5D') {
              displayData = [
                item.sparkline[0] * 0.985,
                ...item.sparkline,
                item.sparkline[item.sparkline.length - 1],
              ];
            } else if (currentTf === '1M') {
              displayData = [
                item.sparkline[0] * 0.95,
                item.sparkline[2] * 0.97,
                ...item.sparkline,
              ];
            } else if (currentTf === '1Y') {
              displayData = [
                item.low52w,
                (item.low52w + item.price) / 2,
                ...item.sparkline,
              ];
            }

            return (
              <div
                key={item.ticker}
                onClick={() => onSelectSymbol(item)}
                className={`group relative rounded-xl bg-[#1e222d] border border-[#2a2e39] hover:border-[#363c4e] p-4.5 transition-all duration-200 cursor-pointer shadow-xs hover:shadow-md flex flex-col justify-between ${
                  flash === 'up'
                    ? 'ring-1 ring-[#089981]/50 bg-[#089981]/5'
                    : flash === 'down'
                    ? 'ring-1 ring-[#f23645]/50 bg-[#f23645]/5'
                    : ''
                }`}
              >
                {/* Header: Logo, Ticker, Name, Timeframe buttons */}
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2.5">
                      <SymbolAvatar
                        ticker={item.ticker}
                        name={item.name}
                        category={item.category}
                        logoUrl={item.logoUrl}
                        size="md"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-white text-base tracking-tight group-hover:text-[#2962ff] transition-colors">
                            {item.ticker}
                          </span>
                          <span className="text-[11px] text-[#787b86] uppercase font-mono">
                            {item.exchange?.split(' ')[0]}
                          </span>
                        </div>
                        <p className="text-xs text-[#787b86] truncate max-w-[140px]">
                          {item.name}
                        </p>
                      </div>
                    </div>

                    {/* Timeframe pill selector */}
                    <div className="flex items-center gap-1 bg-[#131722] p-0.5 rounded border border-[#2a2e39]/60">
                      {['1D', '5D', '1M', '1Y'].map((tf) => (
                        <button
                          key={tf}
                          onClick={(e) => handleTimeframeClick(e, item.ticker, tf)}
                          className={`px-1.5 py-0.5 text-[10px] font-medium rounded transition-colors ${
                            currentTf === tf
                              ? 'bg-[#2962ff] text-white font-semibold'
                              : 'text-[#787b86] hover:text-[#d1d4dc]'
                          }`}
                        >
                          {tf}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Price & Change */}
                  <div className="flex items-baseline justify-between gap-2 mt-2">
                    <div className="font-mono tabular-nums text-xl lg:text-2xl font-bold text-white tracking-tight">
                      {item.price.toLocaleString(undefined, {
                        minimumFractionDigits: item.price < 5 ? 4 : 2,
                        maximumFractionDigits: item.price < 5 ? 4 : 2,
                      })}
                      {item.currency === '%' && '%'}
                    </div>

                    <div
                      className={`flex items-center gap-0.5 font-mono tabular-nums text-xs font-semibold ${
                        isUp ? 'text-[#089981]' : 'text-[#f23645]'
                      }`}
                    >
                      {isUp ? (
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      ) : (
                        <ArrowDownRight className="w-3.5 h-3.5" />
                      )}
                      <span>
                        {isUp ? '+' : ''}
                        {item.changePercent.toFixed(2)}%
                      </span>
                    </div>
                  </div>

                  <div className="text-[11px] text-[#787b86] font-mono tabular-nums mt-0.5">
                    {isUp ? '+' : ''}
                    {item.change.toFixed(2)} pts today
                  </div>
                </div>

                {/* Sparkline Visual */}
                <div className="mt-4 pt-3 border-t border-[#2a2e39]/40 flex items-center justify-between">
                  <div className="text-[11px] text-[#787b86]">
                    Vol: <span className="text-[#d1d4dc] font-mono">{item.volume}</span>
                  </div>
                  <SparklineChart
                    data={displayData}
                    width={110}
                    height={32}
                    isPositive={isUp}
                    showFill={true}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
