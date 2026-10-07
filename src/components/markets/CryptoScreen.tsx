import React, { useState, useMemo } from 'react';
import { ArrowUpRight, ArrowDownRight, Star, ShieldCheck, Flame, Compass } from 'lucide-react';
import { SymbolData } from '../../types/market';
import { SymbolAvatar } from '../common/SymbolAvatar';
import { SparklineChart } from '../common/SparklineChart';

interface CryptoScreenProps {
  symbols: SymbolData[];
  flashingTicks: Record<string, 'up' | 'down'>;
  watchlistTickers: string[];
  onToggleWatchlist: (ticker: string) => void;
  onSelectSymbol: (symbol: SymbolData) => void;
}

export const CryptoScreen: React.FC<CryptoScreenProps> = ({
  symbols,
  flashingTicks,
  watchlistTickers,
  onToggleWatchlist,
  onSelectSymbol,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const cryptoSymbols = useMemo(() => {
    let list = symbols.filter((s) => s.category === 'crypto');
    if (activeCategory === 'l1') {
      list = list.filter((s) => s.subCategory === 'Layer 1' || s.ticker === 'BTCUSD' || s.ticker === 'SOLUSD');
    } else if (activeCategory === 'payments') {
      list = list.filter((s) => s.subCategory === 'Payments');
    }
    return list;
  }, [symbols, activeCategory]);

  return (
    <div className="py-6 px-4 lg:px-8 max-w-7xl mx-auto space-y-6">
      {/* Top Banner & Crypto Metrics */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Cryptocurrency Market</h1>
          <p className="text-sm text-[#787b86] mt-1">
            Real-time cryptocurrency prices, market capitalization, 24-hour volume, and blockchain dominance.
          </p>
        </div>
      </div>

      {/* 4 Crypto Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Market Cap */}
        <div className="p-4 rounded-xl bg-[#1e222d] border border-[#2a2e39]">
          <div className="text-xs text-[#787b86] font-medium">Total Crypto Market Cap</div>
          <div className="text-xl font-bold text-white font-mono tabular-nums mt-1">$2.31T</div>
          <div className="text-xs font-mono font-semibold text-[#089981] mt-1 flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            +2.41% (24h)
          </div>
        </div>

        {/* 24h Volume */}
        <div className="p-4 rounded-xl bg-[#1e222d] border border-[#2a2e39]">
          <div className="text-xs text-[#787b86] font-medium">24h Trading Volume</div>
          <div className="text-xl font-bold text-white font-mono tabular-nums mt-1">$84.6B</div>
          <div className="text-xs text-[#787b86] mt-1">Across 1,200+ exchanges</div>
        </div>

        {/* BTC Dominance */}
        <div className="p-4 rounded-xl bg-[#1e222d] border border-[#2a2e39]">
          <div className="text-xs text-[#787b86] font-medium">Bitcoin Dominance</div>
          <div className="text-xl font-bold text-amber-400 font-mono tabular-nums mt-1">56.2%</div>
          <div className="w-full bg-[#131722] h-1.5 rounded-full overflow-hidden mt-2">
            <div className="bg-amber-400 h-full rounded-full" style={{ width: '56.2%' }} />
          </div>
        </div>

        {/* Fear & Greed Index */}
        <div className="p-4 rounded-xl bg-[#1e222d] border border-[#2a2e39] flex items-center justify-between">
          <div>
            <div className="text-xs text-[#787b86] font-medium">Fear & Greed Index</div>
            <div className="text-xl font-bold text-emerald-400 font-mono tabular-nums mt-1">74</div>
            <div className="text-xs font-semibold text-emerald-400">Greed</div>
          </div>
          <div className="w-12 h-12 rounded-full border-4 border-emerald-500/40 border-t-emerald-400 flex items-center justify-center font-bold text-xs font-mono text-emerald-400">
            74
          </div>
        </div>
      </div>

      {/* Category selector */}
      <div className="flex items-center gap-1 bg-[#1e222d] p-1.5 rounded-xl border border-[#2a2e39] overflow-x-auto no-scrollbar">
        {[
          { id: 'all', label: 'All Cryptocurrencies' },
          { id: 'l1', label: 'Layer 1 & Smart Contracts' },
          { id: 'payments', label: 'Payment Protocols' },
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${
              activeCategory === cat.id
                ? 'bg-[#2962ff] text-white'
                : 'text-[#787b86] hover:text-white hover:bg-[#2a2e39]'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Crypto Table */}
      <div className="bg-[#1e222d] rounded-xl border border-[#2a2e39] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#2a2e39] bg-[#181c27] text-[#787b86] font-semibold text-[11px]">
                <th className="py-3 px-3 w-10 text-center">★</th>
                <th className="py-3 px-3 w-10 text-center">#</th>
                <th className="py-3 px-3">Name</th>
                <th className="py-3 px-3 text-right">Price</th>
                <th className="py-3 px-3 text-right">24h Change</th>
                <th className="py-3 px-3 text-right hidden sm:table-cell">24h Volume</th>
                <th className="py-3 px-3 text-right hidden md:table-cell">Market Cap</th>
                <th className="py-3 px-3 text-center">Rating</th>
                <th className="py-3 px-3 text-center hidden sm:table-cell">7D Chart</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#2a2e39]/50">
              {cryptoSymbols.map((coin, index) => {
                const isUp = coin.change >= 0;
                const flash = flashingTicks[coin.ticker];
                const isWatched = watchlistTickers.includes(coin.ticker);

                return (
                  <tr
                    key={coin.ticker}
                    onClick={() => onSelectSymbol(coin)}
                    className={`hover:bg-[#252a37] transition-colors cursor-pointer ${
                      flash === 'up'
                        ? 'bg-[#089981]/10'
                        : flash === 'down'
                        ? 'bg-[#f23645]/10'
                        : ''
                    }`}
                  >
                    {/* Star */}
                    <td
                      className="py-3 px-3 text-center"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleWatchlist(coin.ticker);
                      }}
                    >
                      <button className="text-[#787b86] hover:text-amber-400 transition-colors">
                        <Star className={`w-4 h-4 ${isWatched ? 'fill-amber-400 text-amber-400' : ''}`} />
                      </button>
                    </td>

                    {/* Rank */}
                    <td className="py-3 px-3 text-center font-mono text-[#787b86]">
                      {index + 1}
                    </td>

                    {/* Name */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2.5">
                        <SymbolAvatar
                          ticker={coin.ticker}
                          name={coin.name}
                          category="crypto"
                          logoUrl={coin.logoUrl}
                          size="md"
                        />
                        <div>
                          <div className="font-bold text-white tracking-tight flex items-center gap-1.5">
                            <span>{coin.ticker.replace('USD', '')}</span>
                            <span className="text-[10px] text-[#787b86] font-normal">{coin.subCategory}</span>
                          </div>
                          <div className="text-[11px] text-[#787b86] truncate max-w-[140px]">
                            {coin.name.split('/')[0]}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Price */}
                    <td className="py-3 px-3 text-right font-mono tabular-nums font-bold text-white text-sm">
                      ${coin.price < 5 ? coin.price.toFixed(4) : coin.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>

                    {/* 24h Change */}
                    <td className="py-3 px-3 text-right">
                      <div
                        className={`font-mono tabular-nums font-bold inline-flex items-center gap-0.5 ${
                          isUp ? 'text-[#089981]' : 'text-[#f23645]'
                        }`}
                      >
                        {isUp ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                        <span>{isUp ? '+' : ''}{coin.changePercent.toFixed(2)}%</span>
                      </div>
                    </td>

                    {/* Volume */}
                    <td className="py-3 px-3 text-right font-mono tabular-nums text-[#d1d4dc] hidden sm:table-cell">
                      {coin.volume}
                    </td>

                    {/* Market Cap */}
                    <td className="py-3 px-3 text-right font-mono tabular-nums text-white font-medium hidden md:table-cell">
                      {coin.marketCap}
                    </td>

                    {/* Rating */}
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded border whitespace-nowrap ${
                          coin.rating.includes('Buy')
                            ? 'text-[#089981] bg-[#089981]/10 border-[#089981]/25'
                            : coin.rating.includes('Sell')
                            ? 'text-[#f23645] bg-[#f23645]/10 border-[#f23645]/25'
                            : 'text-slate-400 bg-slate-500/10 border-slate-500/20'
                        }`}
                      >
                        {coin.rating}
                      </span>
                    </td>

                    {/* 7D Chart */}
                    <td className="py-3 px-3 text-center hidden sm:table-cell">
                      <SparklineChart
                        data={coin.sparkline}
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
