import React from 'react';
import { ArrowUpRight, ArrowDownRight, Star } from 'lucide-react';
import { SymbolData } from '../../types/market';
import { SparklineChart } from '../common/SparklineChart';

interface ForexScreenProps {
  symbols: SymbolData[];
  flashingTicks: Record<string, 'up' | 'down'>;
  watchlistTickers: string[];
  onToggleWatchlist: (ticker: string) => void;
  onSelectSymbol: (symbol: SymbolData) => void;
}

export const ForexScreen: React.FC<ForexScreenProps> = ({
  symbols,
  flashingTicks,
  watchlistTickers,
  onToggleWatchlist,
  onSelectSymbol,
}) => {
  const forexPairs = symbols.filter((s) => s.category === 'forex');

  // Currency Strength Meter
  const currencyStrengths = [
    { code: 'USD', name: 'US Dollar', score: 82, trend: '+0.45%', positive: true },
    { code: 'JPY', name: 'Japanese Yen', score: 74, trend: '+0.32%', positive: true },
    { code: 'CHF', name: 'Swiss Franc', score: 58, trend: '+0.08%', positive: true },
    { code: 'EUR', name: 'Euro', score: 42, trend: '-0.16%', positive: false },
    { code: 'GBP', name: 'British Pound', score: 38, trend: '-0.32%', positive: false },
    { code: 'AUD', name: 'Australian Dollar', score: 26, trend: '-0.52%', positive: false },
  ];

  return (
    <div className="py-6 px-4 lg:px-8 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Forex & Currencies</h1>
        <p className="text-sm text-[#787b86] mt-1">
          Real-time foreign exchange rates, major and minor currency cross pairs, bid/ask spreads, and relative strength.
        </p>
      </div>

      {/* Currency Strength Matrix */}
      <div className="bg-[#1e222d] rounded-xl border border-[#2a2e39] p-5">
        <h2 className="text-sm font-bold text-white tracking-tight mb-3">Relative Currency Strength (24h Index)</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {currencyStrengths.map((curr) => (
            <div key={curr.code} className="p-3 rounded-lg bg-[#181c27] border border-[#2a2e39]/60">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-sm text-white">{curr.code}</span>
                <span
                  className={`text-[11px] font-mono font-semibold ${
                    curr.positive ? 'text-[#089981]' : 'text-[#f23645]'
                  }`}
                >
                  {curr.trend}
                </span>
              </div>
              <div className="text-[11px] text-[#787b86] truncate">{curr.name}</div>
              <div className="w-full bg-[#131722] h-1.5 rounded-full overflow-hidden mt-2">
                <div
                  className={`h-full rounded-full ${curr.positive ? 'bg-[#089981]' : 'bg-[#f23645]'}`}
                  style={{ width: `${curr.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Forex Table */}
      <div className="bg-[#1e222d] rounded-xl border border-[#2a2e39] overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-[#2a2e39] bg-[#181c27] text-[#787b86] font-semibold text-[11px]">
              <th className="py-3 px-3 w-10 text-center">★</th>
              <th className="py-3 px-3">Pair</th>
              <th className="py-3 px-3 text-right">Bid Price</th>
              <th className="py-3 px-3 text-right">Ask Price</th>
              <th className="py-3 px-3 text-right">Spread</th>
              <th className="py-3 px-3 text-right">Change %</th>
              <th className="py-3 px-3 text-center">Technical Rating</th>
              <th className="py-3 px-3 text-center hidden sm:table-cell">Intraday</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2a2e39]/50">
            {forexPairs.map((pair) => {
              const isUp = pair.change >= 0;
              const flash = flashingTicks[pair.ticker];
              const isWatched = watchlistTickers.includes(pair.ticker);
              const spread = (pair.price * 0.00015).toFixed(4);

              return (
                <tr
                  key={pair.ticker}
                  onClick={() => onSelectSymbol(pair)}
                  className={`hover:bg-[#252a37] transition-colors cursor-pointer ${
                    flash === 'up'
                      ? 'bg-[#089981]/10'
                      : flash === 'down'
                      ? 'bg-[#f23645]/10'
                      : ''
                  }`}
                >
                  <td
                    className="py-3 px-3 text-center"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleWatchlist(pair.ticker);
                    }}
                  >
                    <button className="text-[#787b86] hover:text-amber-400">
                      <Star className={`w-4 h-4 ${isWatched ? 'fill-amber-400 text-amber-400' : ''}`} />
                    </button>
                  </td>

                  <td className="py-3 px-3">
                    <div className="font-bold text-white tracking-tight">{pair.ticker}</div>
                    <div className="text-[11px] text-[#787b86]">{pair.name}</div>
                  </td>

                  <td className="py-3 px-3 text-right font-mono tabular-nums font-bold text-white">
                    {pair.price.toFixed(4)}
                  </td>

                  <td className="py-3 px-3 text-right font-mono tabular-nums text-[#d1d4dc]">
                    {(pair.price + Number(spread)).toFixed(4)}
                  </td>

                  <td className="py-3 px-3 text-right font-mono tabular-nums text-[#787b86]">
                    {spread}
                  </td>

                  <td className="py-3 px-3 text-right">
                    <span
                      className={`font-mono tabular-nums font-bold inline-flex items-center gap-0.5 ${
                        isUp ? 'text-[#089981]' : 'text-[#f23645]'
                      }`}
                    >
                      {isUp ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                      {isUp ? '+' : ''}{pair.changePercent.toFixed(2)}%
                    </span>
                  </td>

                  <td className="py-3 px-3 text-center">
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                        pair.rating.includes('Buy')
                          ? 'text-[#089981] bg-[#089981]/10 border-[#089981]/25'
                          : pair.rating.includes('Sell')
                          ? 'text-[#f23645] bg-[#f23645]/10 border-[#f23645]/25'
                          : 'text-slate-400 bg-slate-500/10 border-slate-500/20'
                      }`}
                    >
                      {pair.rating}
                    </span>
                  </td>

                  <td className="py-3 px-3 text-center hidden sm:table-cell">
                    <SparklineChart
                      data={pair.sparkline}
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
  );
};
