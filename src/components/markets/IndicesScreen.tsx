import React, { useState } from 'react';
import { ArrowUpRight, ArrowDownRight, Globe } from 'lucide-react';
import { SymbolData } from '../../types/market';
import { SparklineChart } from '../common/SparklineChart';

interface IndicesScreenProps {
  symbols: SymbolData[];
  flashingTicks: Record<string, 'up' | 'down'>;
  onSelectSymbol: (symbol: SymbolData) => void;
}

export const IndicesScreen: React.FC<IndicesScreenProps> = ({
  symbols,
  flashingTicks,
  onSelectSymbol,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'Americas' | 'Europe' | 'Asia'>('all');

  const indices = symbols.filter((s) => s.category === 'index');
  const filtered = activeTab === 'all' ? indices : indices.filter((i) => i.subCategory === activeTab);

  return (
    <div className="py-6 px-4 lg:px-8 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">World Stock Indices</h1>
        <p className="text-sm text-[#787b86] mt-1">
          Monitor benchmark equity indices across Americas, Europe, and Asia-Pacific in real-time.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-[#1e222d] p-1.5 rounded-xl border border-[#2a2e39] overflow-x-auto no-scrollbar">
        {[
          { id: 'all', label: 'All Global Indices' },
          { id: 'Americas', label: 'Americas (US)' },
          { id: 'Europe', label: 'Europe (EMEA)' },
          { id: 'Asia', label: 'Asia-Pacific' },
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

      {/* Indices Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((item) => {
          const isUp = item.change >= 0;
          const flash = flashingTicks[item.ticker];

          return (
            <div
              key={item.ticker}
              onClick={() => onSelectSymbol(item)}
              className={`p-5 rounded-xl bg-[#1e222d] border border-[#2a2e39] hover:border-[#3b4255] cursor-pointer transition-colors shadow-xs ${
                flash === 'up'
                  ? 'bg-[#089981]/10'
                  : flash === 'down'
                  ? 'bg-[#f23645]/10'
                  : ''
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-base text-white">{item.ticker}</span>
                    <span className="text-[11px] px-1.5 py-0.5 rounded bg-[#131722] text-[#787b86] border border-[#2a2e39]">
                      {item.exchange}
                    </span>
                  </div>
                  <h3 className="text-xs text-[#787b86] mt-0.5">{item.name}</h3>
                </div>
                <div className="text-right">
                  <span className="text-xs text-[#787b86] font-medium">{item.country}</span>
                </div>
              </div>

              <div className="flex items-baseline justify-between mt-4">
                <div className="font-mono tabular-nums text-2xl font-bold text-white">
                  {item.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div
                  className={`flex items-center gap-0.5 font-mono tabular-nums text-sm font-bold ${
                    isUp ? 'text-[#089981]' : 'text-[#f23645]'
                  }`}
                >
                  {isUp ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                  <span>{isUp ? '+' : ''}{item.changePercent.toFixed(2)}%</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#2a2e39]/60 flex items-center justify-between">
                <span className="text-xs text-[#787b86]">Day Vol: {item.volume}</span>
                <SparklineChart
                  data={item.sparkline}
                  width={100}
                  height={28}
                  isPositive={isUp}
                  showFill={true}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
