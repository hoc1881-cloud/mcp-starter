import React, { useState } from 'react';
import { ArrowUpRight, ArrowDownRight, Fuel, Coins, Landmark } from 'lucide-react';
import { SymbolData } from '../../types/market';
import { SparklineChart } from '../common/SparklineChart';

interface FuturesScreenProps {
  symbols: SymbolData[];
  flashingTicks: Record<string, 'up' | 'down'>;
  onSelectSymbol: (symbol: SymbolData) => void;
}

export const FuturesScreen: React.FC<FuturesScreenProps> = ({
  symbols,
  flashingTicks,
  onSelectSymbol,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'energy' | 'metals' | 'bonds'>('all');

  const items = symbols.filter((s) => s.category === 'futures' || s.category === 'bond');
  
  const filtered = items.filter((item) => {
    if (activeTab === 'energy') return item.sector === 'Energy';
    if (activeTab === 'metals') return item.sector === 'Metals';
    if (activeTab === 'bonds') return item.category === 'bond';
    return true;
  });

  return (
    <div className="py-6 px-4 lg:px-8 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Futures, Commodities & Bonds</h1>
        <p className="text-sm text-[#787b86] mt-1">
          Energy contracts, precious metals, industrial commodities, and sovereign government bond yields.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-[#1e222d] p-1.5 rounded-xl border border-[#2a2e39] overflow-x-auto no-scrollbar">
        {[
          { id: 'all', label: 'All Contracts' },
          { id: 'energy', label: 'Energy (Oil & Gas)' },
          { id: 'metals', label: 'Precious Metals' },
          { id: 'bonds', label: 'Treasuries & Yields' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? 'bg-[#2962ff] text-white'
                : 'text-[#787b86] hover:text-white hover:bg-[#2a2e39]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-[#1e222d] rounded-xl border border-[#2a2e39] overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-[#2a2e39] bg-[#181c27] text-[#787b86] font-semibold text-[11px]">
              <th className="py-3 px-3">Contract / Asset</th>
              <th className="py-3 px-3">Sector</th>
              <th className="py-3 px-3 text-right">Last Price</th>
              <th className="py-3 px-3 text-right">Change</th>
              <th className="py-3 px-3 text-right">Change %</th>
              <th className="py-3 px-3 text-right hidden sm:table-cell">Volume</th>
              <th className="py-3 px-3 text-center">Technical</th>
              <th className="py-3 px-3 text-center hidden sm:table-cell">Chart</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2a2e39]/50">
            {filtered.map((item) => {
              const isUp = item.change >= 0;
              const flash = flashingTicks[item.ticker];

              return (
                <tr
                  key={item.ticker}
                  onClick={() => onSelectSymbol(item)}
                  className={`hover:bg-[#252a37] transition-colors cursor-pointer ${
                    flash === 'up'
                      ? 'bg-[#089981]/10'
                      : flash === 'down'
                      ? 'bg-[#f23645]/10'
                      : ''
                  }`}
                >
                  <td className="py-3 px-3">
                    <div className="font-bold text-white tracking-tight">{item.ticker}</div>
                    <div className="text-[11px] text-[#787b86]">{item.name}</div>
                  </td>

                  <td className="py-3 px-3 text-[#d1d4dc]">
                    {item.sector}
                  </td>

                  <td className="py-3 px-3 text-right font-mono tabular-nums font-bold text-white">
                    {item.price < 5 ? item.price.toFixed(3) : item.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    {item.currency === '%' && '%'}
                  </td>

                  <td className="py-3 px-3 text-right font-mono tabular-nums text-[#787b86]">
                    {isUp ? '+' : ''}{item.change.toFixed(item.price < 5 ? 3 : 2)}
                  </td>

                  <td className="py-3 px-3 text-right">
                    <span
                      className={`font-mono tabular-nums font-bold inline-flex items-center gap-0.5 ${
                        isUp ? 'text-[#089981]' : 'text-[#f23645]'
                      }`}
                    >
                      {isUp ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                      {isUp ? '+' : ''}{item.changePercent.toFixed(2)}%
                    </span>
                  </td>

                  <td className="py-3 px-3 text-right font-mono tabular-nums text-[#d1d4dc] hidden sm:table-cell">
                    {item.volume}
                  </td>

                  <td className="py-3 px-3 text-center">
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                        item.rating.includes('Buy')
                          ? 'text-[#089981] bg-[#089981]/10 border-[#089981]/25'
                          : item.rating.includes('Sell')
                          ? 'text-[#f23645] bg-[#f23645]/10 border-[#f23645]/25'
                          : 'text-slate-400 bg-slate-500/10 border-slate-500/20'
                      }`}
                    >
                      {item.rating}
                    </span>
                  </td>

                  <td className="py-3 px-3 text-center hidden sm:table-cell">
                    <SparklineChart
                      data={item.sparkline}
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
