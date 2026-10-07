import React, { useState } from 'react';
import { ArrowUpRight, ArrowDownRight, ChevronRight, TrendingUp, Newspaper, Calendar, Flame } from 'lucide-react';
import { SymbolData, MarketNews, EconomicEvent } from '../../types/market';
import { SparklineChart } from '../common/SparklineChart';
import { SymbolAvatar } from '../common/SymbolAvatar';
import { MARKET_NEWS, ECONOMIC_CALENDAR } from '../../data/marketData';

interface OverviewScreenProps {
  symbols: SymbolData[];
  flashingTicks: Record<string, 'up' | 'down'>;
  onSelectSymbol: (symbol: SymbolData) => void;
  onNavigateToCategory: (category: any) => void;
}

export const OverviewScreen: React.FC<OverviewScreenProps> = ({
  symbols,
  flashingTicks,
  onSelectSymbol,
  onNavigateToCategory,
}) => {
  const [moversTab, setMoversTab] = useState<'active' | 'gainers' | 'losers'>('gainers');

  // Filter stocks
  const stockSymbols = symbols.filter((s) => s.category === 'stock');
  
  // Movers lists
  const mostActive = [...stockSymbols].sort(
    (a, b) => (b.volumeRaw || 0) - (a.volumeRaw || 0)
  ).slice(0, 5);

  const topGainers = [...stockSymbols].sort(
    (a, b) => b.changePercent - a.changePercent
  ).slice(0, 5);

  const topLosers = [...stockSymbols].sort(
    (a, b) => a.changePercent - b.changePercent
  ).slice(0, 5);

  const currentMovers = moversTab === 'active' ? mostActive : moversTab === 'gainers' ? topGainers : topLosers;

  // Major Indices
  const indices = symbols.filter((s) => s.category === 'index').slice(0, 6);

  // Top Crypto
  const cryptos = symbols.filter((s) => s.category === 'crypto').slice(0, 4);

  // Top Currencies & Commodities
  const forexCommodities = symbols.filter((s) => s.category === 'forex' || s.category === 'futures').slice(0, 4);

  return (
    <div className="space-y-8 py-6 px-4 lg:px-8 max-w-7xl mx-auto">
      {/* 1. Global Indices Grid */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-white tracking-tight">World Indices</h2>
            <span className="text-xs text-[#787b86]">· Major benchmarks</span>
          </div>
          <button
            onClick={() => onNavigateToCategory('indices')}
            className="text-xs font-semibold text-[#2962ff] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>See all indices</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {indices.map((idx) => {
            const isUp = idx.change >= 0;
            const flash = flashingTicks[idx.ticker];

            return (
              <div
                key={idx.ticker}
                onClick={() => onSelectSymbol(idx)}
                className={`p-3 rounded-lg bg-[#1e222d] border border-[#2a2e39] hover:border-[#3b4255] cursor-pointer transition-colors ${
                  flash === 'up'
                    ? 'bg-[#089981]/10'
                    : flash === 'down'
                    ? 'bg-[#f23645]/10'
                    : ''
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-xs text-white tracking-tight">{idx.ticker}</span>
                  <span className="text-[10px] text-[#787b86]">{idx.country}</span>
                </div>
                <div className="font-mono tabular-nums text-sm font-bold text-white">
                  {idx.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div
                  className={`flex items-center gap-0.5 font-mono tabular-nums text-[11px] font-semibold mt-0.5 ${
                    isUp ? 'text-[#089981]' : 'text-[#f23645]'
                  }`}
                >
                  {isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  <span>{isUp ? '+' : ''}{idx.changePercent.toFixed(2)}%</span>
                </div>
                <div className="mt-2 pt-1 border-t border-[#2a2e39]/40">
                  <SparklineChart
                    data={idx.sparkline}
                    width={90}
                    height={20}
                    isPositive={isUp}
                    showFill={false}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 2. Main Two-Column Layout: Stock Movers & Crypto/Forex snapshot */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Stock Movers Widget (7 cols) */}
        <section className="lg:col-span-7 bg-[#1e222d] rounded-xl border border-[#2a2e39] p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-[#2a2e39]">
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">Stock Market Movers</h2>
              <p className="text-xs text-[#787b86]">Today's leading US equities by performance & volume</p>
            </div>

            {/* Segmented Movers Tabs */}
            <div className="flex items-center gap-1 p-1 bg-[#131722] rounded-lg border border-[#2a2e39]">
              <button
                onClick={() => setMoversTab('gainers')}
                className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                  moversTab === 'gainers'
                    ? 'bg-[#089981] text-white shadow-xs'
                    : 'text-[#787b86] hover:text-white'
                }`}
              >
                Top Gainers
              </button>
              <button
                onClick={() => setMoversTab('losers')}
                className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                  moversTab === 'losers'
                    ? 'bg-[#f23645] text-white shadow-xs'
                    : 'text-[#787b86] hover:text-white'
                }`}
              >
                Top Losers
              </button>
              <button
                onClick={() => setMoversTab('active')}
                className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                  moversTab === 'active'
                    ? 'bg-[#2962ff] text-white shadow-xs'
                    : 'text-[#787b86] hover:text-white'
                }`}
              >
                Most Active
              </button>
            </div>
          </div>

          {/* Movers Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[11px] font-semibold text-[#787b86] border-b border-[#2a2e39]/60">
                  <th className="py-2 px-2">Symbol</th>
                  <th className="py-2 px-2 text-right">Price</th>
                  <th className="py-2 px-2 text-right">Change %</th>
                  <th className="py-2 px-2 text-right hidden sm:table-cell">Volume</th>
                  <th className="py-2 px-2 text-right hidden md:table-cell">Market Cap</th>
                  <th className="py-2 px-2 text-right">Technical</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2a2e39]/40">
                {currentMovers.map((stock) => {
                  const isUp = stock.change >= 0;
                  const flash = flashingTicks[stock.ticker];

                  return (
                    <tr
                      key={stock.ticker}
                      onClick={() => onSelectSymbol(stock)}
                      className={`hover:bg-[#252a37] transition-colors cursor-pointer text-xs ${
                        flash === 'up'
                          ? 'bg-[#089981]/10'
                          : flash === 'down'
                          ? 'bg-[#f23645]/10'
                          : ''
                      }`}
                    >
                      <td className="py-2.5 px-2">
                        <div className="flex items-center gap-2.5">
                          <SymbolAvatar
                            ticker={stock.ticker}
                            name={stock.name}
                            category={stock.category}
                            logoUrl={stock.logoUrl}
                            size="sm"
                          />
                          <div>
                            <div className="font-bold text-white tracking-tight">{stock.ticker}</div>
                            <div className="text-[11px] text-[#787b86] truncate max-w-[120px]">{stock.name}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-2.5 px-2 text-right font-mono tabular-nums font-semibold text-white">
                        ${stock.price.toFixed(2)}
                      </td>

                      <td className="py-2.5 px-2 text-right">
                        <span
                          className={`font-mono tabular-nums font-semibold inline-flex items-center gap-0.5 ${
                            isUp ? 'text-[#089981]' : 'text-[#f23645]'
                          }`}
                        >
                          {isUp ? '+' : ''}{stock.changePercent.toFixed(2)}%
                        </span>
                      </td>

                      <td className="py-2.5 px-2 text-right font-mono tabular-nums text-[#787b86] hidden sm:table-cell">
                        {stock.volume}
                      </td>

                      <td className="py-2.5 px-2 text-right font-mono tabular-nums text-[#d1d4dc] hidden md:table-cell">
                        {stock.marketCap}
                      </td>

                      <td className="py-2.5 px-2 text-right">
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                            stock.rating.includes('Buy')
                              ? 'text-[#089981] bg-[#089981]/10 border-[#089981]/20'
                              : stock.rating.includes('Sell')
                              ? 'text-[#f23645] bg-[#f23645]/10 border-[#f23645]/20'
                              : 'text-slate-400 bg-slate-500/10 border-slate-500/20'
                          }`}
                        >
                          {stock.rating}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-4 pt-3 border-t border-[#2a2e39] flex items-center justify-between text-xs">
            <span className="text-[#787b86]">Real-time quotes via BATS</span>
            <button
              onClick={() => onNavigateToCategory('stocks')}
              className="text-[#2962ff] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Full Stock Screener</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </section>

        {/* Right Column: Crypto Dominance & Commodities snapshot (5 cols) */}
        <section className="lg:col-span-5 space-y-5">
          {/* Crypto Snapshot */}
          <div className="bg-[#1e222d] rounded-xl border border-[#2a2e39] p-4.5">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#2a2e39]">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white tracking-tight">Crypto Leaders</h3>
                <span className="text-[11px] text-[#787b86]">Total Cap: $2.31T</span>
              </div>
              <button
                onClick={() => onNavigateToCategory('crypto')}
                className="text-xs font-semibold text-[#2962ff] hover:underline"
              >
                More
              </button>
            </div>

            {/* Crypto Dominance Bar */}
            <div className="mb-3.5">
              <div className="flex items-center justify-between text-[11px] font-mono text-[#787b86] mb-1">
                <span>BTC Dominance: <strong className="text-amber-400">56.2%</strong></span>
                <span>ETH: <strong className="text-blue-400">14.1%</strong></span>
                <span>Altcoins: <strong className="text-[#d1d4dc]">29.7%</strong></span>
              </div>
              <div className="w-full h-2 rounded-full overflow-hidden flex bg-[#131722]">
                <div className="bg-amber-500 h-full" style={{ width: '56.2%' }} title="BTC 56.2%" />
                <div className="bg-blue-500 h-full" style={{ width: '14.1%' }} title="ETH 14.1%" />
                <div className="bg-emerald-500 h-full" style={{ width: '29.7%' }} title="Alts 29.7%" />
              </div>
            </div>

            <div className="space-y-2">
              {cryptos.map((coin) => {
                const isUp = coin.change >= 0;
                return (
                  <div
                    key={coin.ticker}
                    onClick={() => onSelectSymbol(coin)}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-[#252a37] cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <SymbolAvatar
                        ticker={coin.ticker}
                        category="crypto"
                        logoUrl={coin.logoUrl}
                        size="sm"
                      />
                      <div>
                        <div className="font-bold text-xs text-white">{coin.ticker.replace('USD', '')}</div>
                        <div className="text-[10px] text-[#787b86]">{coin.name.split('/')[0]}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono tabular-nums text-xs font-semibold text-white">
                        ${coin.price.toLocaleString()}
                      </div>
                      <div
                        className={`font-mono tabular-nums text-[11px] font-semibold ${
                          isUp ? 'text-[#089981]' : 'text-[#f23645]'
                        }`}
                      >
                        {isUp ? '+' : ''}{coin.changePercent.toFixed(2)}%
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Currencies & Commodities Snapshot */}
          <div className="bg-[#1e222d] rounded-xl border border-[#2a2e39] p-4.5">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#2a2e39]">
              <h3 className="text-sm font-bold text-white tracking-tight">Forex & Commodities</h3>
              <button
                onClick={() => onNavigateToCategory('futures')}
                className="text-xs font-semibold text-[#2962ff] hover:underline"
              >
                More
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {forexCommodities.map((item) => {
                const isUp = item.change >= 0;
                return (
                  <div
                    key={item.ticker}
                    onClick={() => onSelectSymbol(item)}
                    className="p-2.5 rounded-lg bg-[#181c27] border border-[#2a2e39]/60 hover:border-[#3b4255] cursor-pointer transition-colors"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs text-white">{item.ticker}</span>
                      <span
                        className={`text-[10px] font-mono tabular-nums font-semibold ${
                          isUp ? 'text-[#089981]' : 'text-[#f23645]'
                        }`}
                      >
                        {isUp ? '+' : ''}{item.changePercent.toFixed(2)}%
                      </span>
                    </div>
                    <div className="text-[11px] text-[#787b86] truncate mb-1">{item.name}</div>
                    <div className="font-mono tabular-nums text-xs font-bold text-white">
                      {item.price < 5 ? item.price.toFixed(4) : item.price.toFixed(2)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </div>

      {/* 3. Heatmap Preview Banner */}
      <section className="bg-gradient-to-r from-[#1e222d] via-[#232836] to-[#1e222d] rounded-xl border border-[#2a2e39] p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-400" />
              <h3 className="text-base font-bold text-white tracking-tight">Interactive Market Heatmap</h3>
            </div>
            <p className="text-xs text-[#787b86] mt-1 max-w-xl">
              Visualize market cap distribution and sector momentum across the S&P 500 and Top Cryptocurrencies.
            </p>
          </div>
          <button
            onClick={() => onNavigateToCategory('heatmap')}
            className="self-start md:self-auto px-4 py-2 rounded-lg bg-[#2962ff] hover:bg-[#1e53e5] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <span>Launch Heatmap</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        {/* Mini Treemap Preview Bar */}
        <div className="grid grid-cols-6 gap-2 mt-4 pt-3 border-t border-[#2a2e39]/60">
          <div className="col-span-2 p-3 rounded-lg bg-[#089981]/25 border border-[#089981]/40 flex flex-col justify-between">
            <span className="text-[11px] font-bold text-white">Technology</span>
            <span className="text-sm font-bold font-mono text-[#089981]">+2.14%</span>
          </div>
          <div className="col-span-1 p-3 rounded-lg bg-[#089981]/15 border border-[#089981]/30 flex flex-col justify-between">
            <span className="text-[11px] font-bold text-white truncate">Healthcare</span>
            <span className="text-sm font-bold font-mono text-[#089981]">+0.82%</span>
          </div>
          <div className="col-span-1 p-3 rounded-lg bg-[#089981]/10 border border-[#089981]/20 flex flex-col justify-between">
            <span className="text-[11px] font-bold text-white truncate">Financials</span>
            <span className="text-sm font-bold font-mono text-[#089981]">+0.45%</span>
          </div>
          <div className="col-span-1 p-3 rounded-lg bg-[#f23645]/20 border border-[#f23645]/40 flex flex-col justify-between">
            <span className="text-[11px] font-bold text-white truncate">Consumer</span>
            <span className="text-sm font-bold font-mono text-[#f23645]">-1.15%</span>
          </div>
          <div className="col-span-1 p-3 rounded-lg bg-[#089981]/20 border border-[#089981]/35 flex flex-col justify-between">
            <span className="text-[11px] font-bold text-white truncate">Energy</span>
            <span className="text-sm font-bold font-mono text-[#089981]">+1.68%</span>
          </div>
        </div>
      </section>

      {/* 4. News & Economic Calendar Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* News Feed */}
        <div className="bg-[#1e222d] rounded-xl border border-[#2a2e39] p-5">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#2a2e39]">
            <div className="flex items-center gap-2">
              <Newspaper className="w-4 h-4 text-[#2962ff]" />
              <h3 className="text-sm font-bold text-white tracking-tight">Market News & Disclosures</h3>
            </div>
            <span className="text-xs text-[#787b86]">Streaming headlines</span>
          </div>

          <div className="space-y-3.5">
            {MARKET_NEWS.map((item) => (
              <div
                key={item.id}
                className="group p-2.5 rounded-lg hover:bg-[#252a37] transition-colors cursor-pointer border border-transparent hover:border-[#2a2e39]"
              >
                <div className="flex items-center gap-2 text-[11px] text-[#787b86] mb-1">
                  <span className="font-semibold text-[#2962ff]">{item.source}</span>
                  <span aria-hidden="true">·</span>
                  <span>{item.time}</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-slate-400">{item.category}</span>
                </div>
                <h4 className="text-xs font-semibold text-white group-hover:text-[#2962ff] transition-colors leading-relaxed">
                  {item.title}
                </h4>
                <div className="flex items-center gap-1.5 mt-2">
                  {item.symbols.map((sym) => (
                    <span
                      key={sym}
                      className="px-1.5 py-0.5 rounded text-[10px] font-mono font-medium bg-[#131722] text-[#d1d4dc] border border-[#2a2e39]"
                    >
                      {sym}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Economic Calendar */}
        <div className="bg-[#1e222d] rounded-xl border border-[#2a2e39] p-5">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#2a2e39]">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white tracking-tight">Economic Calendar</h3>
            </div>
            <span className="text-xs text-[#787b86]">Key Macro Releases</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="text-[11px] font-semibold text-[#787b86] border-b border-[#2a2e39]/60">
                  <th className="py-2 px-2">Time</th>
                  <th className="py-2 px-2">Event</th>
                  <th className="py-2 px-2 text-right">Actual</th>
                  <th className="py-2 px-2 text-right">Forecast</th>
                  <th className="py-2 px-2 text-right">Prior</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2a2e39]/40">
                {ECONOMIC_CALENDAR.map((ev) => (
                  <tr key={ev.id} className="hover:bg-[#252a37]/50">
                    <td className="py-3 px-2 font-mono text-[11px] text-[#787b86] whitespace-nowrap">
                      {ev.time}
                    </td>
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-1.5">
                        <span>{ev.flag}</span>
                        <span className="font-medium text-white truncate max-w-[180px]">{ev.event}</span>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-right font-mono font-bold text-emerald-400">
                      {ev.actual}
                    </td>
                    <td className="py-3 px-2 text-right font-mono text-[#787b86]">
                      {ev.forecast}
                    </td>
                    <td className="py-3 px-2 text-right font-mono text-[#787b86]">
                      {ev.previous}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 pt-3 border-t border-[#2a2e39] text-xs text-[#787b86] flex items-center justify-between">
            <span>High-impact FOMC & BLS data series</span>
            <span className="text-emerald-400 font-medium">All times in EDT</span>
          </div>
        </div>
      </div>
    </div>
  );
};
