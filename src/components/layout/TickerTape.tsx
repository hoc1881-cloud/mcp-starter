import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { SymbolData } from '../../types/market';
import { SparklineChart } from '../common/SparklineChart';

interface TickerTapeProps {
  symbols: SymbolData[];
  flashingTicks: Record<string, 'up' | 'down'>;
  onSelectSymbol: (symbol: SymbolData) => void;
}

export const TickerTape: React.FC<TickerTapeProps> = ({
  symbols,
  flashingTicks,
  onSelectSymbol,
}) => {
  // Select top marquee tickers
  const featuredTickers = ['SPX', 'NDX', 'DJI', 'BTCUSD', 'ETHUSD', 'NVDA', 'TSLA', 'GC1!', 'CL1!', 'EURUSD'];
  const tickerItems = featuredTickers
    .map((t) => symbols.find((s) => s.ticker === t))
    .filter(Boolean) as SymbolData[];

  return (
    <div className="w-full bg-[#181c27] border-b border-[#2a2e39] overflow-x-auto no-scrollbar py-1.5 px-4">
      <div className="flex items-center gap-6 min-w-max">
        {tickerItems.map((item) => {
          const isUp = item.change >= 0;
          const flash = flashingTicks[item.ticker];
          
          let flashClass = '';
          if (flash === 'up') flashClass = 'bg-[#089981]/25 text-[#089981]';
          if (flash === 'down') flashClass = 'bg-[#f23645]/25 text-[#f23645]';

          return (
            <button
              key={item.ticker}
              onClick={() => onSelectSymbol(item)}
              className={`flex items-center gap-2.5 px-2 py-0.5 rounded transition-all text-xs cursor-pointer hover:bg-[#202533] ${flashClass}`}
            >
              <div className="flex items-center gap-1.5 font-medium">
                <span className="text-[#d1d4dc] font-bold tracking-tight">{item.ticker}</span>
                <span className="text-[#787b86] text-[11px] hidden sm:inline truncate max-w-[80px]">
                  {item.name.split(' ')[0]}
                </span>
              </div>

              <span className="font-mono tabular-nums text-[#d1d4dc] font-semibold">
                {item.price.toLocaleString(undefined, {
                  minimumFractionDigits: item.price < 5 ? 4 : 2,
                  maximumFractionDigits: item.price < 5 ? 4 : 2,
                })}
              </span>

              <div
                className={`flex items-center gap-0.5 font-mono tabular-nums text-[11px] font-semibold ${
                  isUp ? 'text-[#089981]' : 'text-[#f23645]'
                }`}
              >
                {isUp ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                <span>
                  {isUp ? '+' : ''}
                  {item.changePercent.toFixed(2)}%
                </span>
              </div>

              <div className="w-12 h-4 hidden md:block opacity-70">
                <SparklineChart
                  data={item.sparkline}
                  width={48}
                  height={16}
                  isPositive={isUp}
                  showFill={false}
                />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
