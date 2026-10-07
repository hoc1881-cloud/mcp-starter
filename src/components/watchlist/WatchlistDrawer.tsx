import React from 'react';
import { X, Trash2, ArrowUpRight, ArrowDownRight, Bell, DollarSign } from 'lucide-react';
import { SymbolData, PaperPosition, WatchlistAlert } from '../../types/market';
import { SparklineChart } from '../common/SparklineChart';
import { SymbolAvatar } from '../common/SymbolAvatar';

interface WatchlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  watchlistTickers: string[];
  symbols: SymbolData[];
  flashingTicks: Record<string, 'up' | 'down'>;
  onSelectSymbol: (symbol: SymbolData) => void;
  onRemoveFromWatchlist: (ticker: string) => void;
  paperBalance: number;
  paperPositions: PaperPosition[];
  alerts: WatchlistAlert[];
  onRemoveAlert: (id: string) => void;
}

export const WatchlistDrawer: React.FC<WatchlistDrawerProps> = ({
  isOpen,
  onClose,
  watchlistTickers,
  symbols,
  flashingTicks,
  onSelectSymbol,
  onRemoveFromWatchlist,
  paperBalance,
  paperPositions,
  alerts,
  onRemoveAlert,
}) => {
  if (!isOpen) return null;

  const watchedSymbols = watchlistTickers
    .map((t) => symbols.find((s) => s.ticker === t))
    .filter(Boolean) as SymbolData[];

  // Portfolio total value
  const positionsValue = paperPositions.reduce((acc, pos) => {
    const sym = symbols.find((s) => s.ticker === pos.ticker);
    return acc + (sym ? sym.price * pos.shares : pos.avgPrice * pos.shares);
  }, 0);

  const totalPortfolioValue = paperBalance + positionsValue;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md h-full bg-[#1e222d] border-l border-[#2a2e39] shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#2a2e39] bg-[#181c27]">
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">Watchlist & Portfolio</h2>
            <p className="text-xs text-[#787b86]">Streaming watchlist & paper positions</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#787b86] hover:text-white hover:bg-[#2a2e39] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Paper Portfolio Card */}
          <div className="p-4 rounded-xl bg-[#181c27] border border-[#2a2e39]">
            <div className="flex items-center justify-between text-xs text-[#787b86] mb-1">
              <span>Paper Trading Net Worth</span>
              <span className="text-emerald-400 font-mono font-bold">Virtual Account</span>
            </div>
            <div className="text-2xl font-extrabold text-white font-mono tabular-nums">
              ${totalPortfolioValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="flex items-center justify-between text-xs font-mono text-[#787b86] mt-2 pt-2 border-t border-[#2a2e39]/60">
              <span>Cash: ${paperBalance.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
              <span>Positions: ${positionsValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
            </div>

            {/* Active holdings */}
            {paperPositions.length > 0 && (
              <div className="mt-3 pt-2 border-t border-[#2a2e39]/60 space-y-1.5">
                <span className="text-[11px] text-[#787b86] block font-semibold">Open Positions:</span>
                {paperPositions.map((p) => {
                  const sym = symbols.find((s) => s.ticker === p.ticker);
                  const curPrice = sym ? sym.price : p.avgPrice;
                  const pl = (curPrice - p.avgPrice) * p.shares;
                  const plPct = ((curPrice - p.avgPrice) / p.avgPrice) * 100;

                  return (
                    <div
                      key={p.ticker}
                      className="flex items-center justify-between text-xs py-1 px-2 rounded bg-[#131722]"
                    >
                      <div>
                        <span className="font-bold text-white mr-1.5">{p.ticker}</span>
                        <span className="text-[10px] text-[#787b86]">{p.shares} units</span>
                      </div>
                      <div className="text-right font-mono tabular-nums">
                        <div className={pl >= 0 ? 'text-[#089981] font-bold' : 'text-[#f23645] font-bold'}>
                          {pl >= 0 ? '+' : ''}${pl.toFixed(2)} ({plPct.toFixed(1)}%)
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Watchlist Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-white tracking-tight">Pinned Symbols</h3>
              <span className="text-xs text-[#787b86] font-mono">{watchedSymbols.length} tracked</span>
            </div>

            {watchedSymbols.length === 0 ? (
              <div className="text-center py-8 text-xs text-[#787b86] bg-[#181c27] rounded-xl border border-[#2a2e39]">
                Your watchlist is empty. Click the star ★ on any market asset to track it here.
              </div>
            ) : (
              <div className="space-y-2">
                {watchedSymbols.map((item) => {
                  const isUp = item.change >= 0;
                  const flash = flashingTicks[item.ticker];

                  return (
                    <div
                      key={item.ticker}
                      onClick={() => onSelectSymbol(item)}
                      className={`group flex items-center justify-between p-3 rounded-xl bg-[#181c27] border border-[#2a2e39] hover:border-[#3b4255] cursor-pointer transition-colors ${
                        flash === 'up'
                          ? 'bg-[#089981]/15'
                          : flash === 'down'
                          ? 'bg-[#f23645]/15'
                          : ''
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <SymbolAvatar
                          ticker={item.ticker}
                          name={item.name}
                          category={item.category}
                          logoUrl={item.logoUrl}
                          size="sm"
                        />
                        <div>
                          <div className="font-bold text-xs text-white group-hover:text-[#2962ff] transition-colors">
                            {item.ticker}
                          </div>
                          <div className="text-[10px] text-[#787b86] truncate max-w-[100px]">
                            {item.name}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-16 h-5 hidden sm:block">
                          <SparklineChart
                            data={item.sparkline}
                            width={64}
                            height={20}
                            isPositive={isUp}
                            showFill={false}
                          />
                        </div>

                        <div className="text-right">
                          <div className="font-mono tabular-nums text-xs font-bold text-white">
                            ${item.price < 5 ? item.price.toFixed(4) : item.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </div>
                          <div
                            className={`font-mono tabular-nums text-[10px] font-semibold flex items-center justify-end gap-0.5 ${
                              isUp ? 'text-[#089981]' : 'text-[#f23645]'
                            }`}
                          >
                            {isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                            <span>{isUp ? '+' : ''}{item.changePercent.toFixed(2)}%</span>
                          </div>
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onRemoveFromWatchlist(item.ticker);
                          }}
                          className="opacity-0 group-hover:opacity-100 p-1 text-[#787b86] hover:text-[#f23645] transition-opacity"
                          title="Remove from watchlist"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Active Alerts */}
          {alerts.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-bold text-white tracking-tight flex items-center gap-1.5">
                  <Bell className="w-3.5 h-3.5 text-amber-400" />
                  Price Alerts ({alerts.length})
                </h3>
              </div>
              <div className="space-y-1.5">
                {alerts.map((al) => (
                  <div
                    key={al.id}
                    className="flex items-center justify-between p-2 rounded-lg bg-[#181c27] text-xs font-mono"
                  >
                    <div>
                      <span className="font-bold text-white mr-1.5">{al.ticker}</span>
                      <span className="text-[#787b86]">
                        {al.condition} ${al.targetPrice}
                      </span>
                    </div>
                    <button
                      onClick={() => onRemoveAlert(al.id)}
                      className="text-[#787b86] hover:text-[#f23645]"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
