import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { SymbolData, AssetCategory } from '../../types/market';
import { SymbolAvatar } from '../common/SymbolAvatar';

interface SymbolSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  symbols: SymbolData[];
  onSelectSymbol: (symbol: SymbolData) => void;
}

export const SymbolSearchModal: React.FC<SymbolSearchModalProps> = ({
  isOpen,
  onClose,
  symbols,
  onSelectSymbol,
}) => {
  const [query, setQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  const filtered = symbols.filter((s) => {
    if (filterCategory !== 'all' && s.category !== filterCategory) return false;
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return s.ticker.toLowerCase().includes(q) || s.name.toLowerCase().includes(q);
  });

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, filtered.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filtered[selectedIndex]) {
          onSelectSymbol(filtered[selectedIndex]);
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filtered, selectedIndex, onSelectSymbol, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/70 backdrop-blur-xs p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-[#1e222d] border border-[#2a2e39] shadow-2xl overflow-hidden flex flex-col max-h-[75vh]">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-[#2a2e39] bg-[#181c27]">
          <Search className="w-5 h-5 text-[#787b86]" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Search any symbol, coin, index or currency (e.g. NVDA, BTC, SPX)..."
            className="w-full bg-transparent text-white placeholder-[#787b86] text-sm focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 rounded text-[#787b86] hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 px-4 py-2 border-b border-[#2a2e39]/60 bg-[#131722] overflow-x-auto no-scrollbar">
          {[
            { id: 'all', label: 'All' },
            { id: 'stock', label: 'Stocks' },
            { id: 'crypto', label: 'Crypto' },
            { id: 'index', label: 'Indices' },
            { id: 'forex', label: 'Forex' },
            { id: 'futures', label: 'Futures' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setFilterCategory(cat.id);
                setSelectedIndex(0);
              }}
              className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors ${
                filterCategory === cat.id
                  ? 'bg-[#2962ff] text-white'
                  : 'text-[#787b86] hover:text-white hover:bg-[#1e222d]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto divide-y divide-[#2a2e39]/40 p-2">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-[#787b86] text-xs">
              No matching symbols found for "{query}".
            </div>
          ) : (
            filtered.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              const isUp = item.change >= 0;

              return (
                <div
                  key={item.ticker}
                  onClick={() => {
                    onSelectSymbol(item);
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between p-2.5 rounded-lg cursor-pointer transition-colors ${
                    isSelected ? 'bg-[#2962ff]/15 text-white' : 'hover:bg-[#252a37]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <SymbolAvatar
                      ticker={item.ticker}
                      name={item.name}
                      category={item.category}
                      logoUrl={item.logoUrl}
                      size="sm"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-xs">{item.ticker}</span>
                        <span className="text-[10px] text-[#787b86] font-mono uppercase">
                          {item.exchange}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#787b86] truncate max-w-xs">{item.name}</p>
                    </div>
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
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2 border-t border-[#2a2e39] bg-[#181c27] flex items-center justify-between text-[11px] text-[#787b86]">
          <div className="flex items-center gap-2">
            <span>↑↓ Navigate</span>
            <span aria-hidden="true">·</span>
            <span>↵ Select</span>
            <span aria-hidden="true">·</span>
            <span>Esc Close</span>
          </div>
          <span>TradingView Markets Search</span>
        </div>
      </div>
    </div>
  );
};
