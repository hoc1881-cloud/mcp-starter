import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Globe, Flame, Clock } from 'lucide-react';
import { MarketCategory, Region } from '../../types/market';

interface MarketsSubNavProps {
  activeCategory: MarketCategory;
  onSelectCategory: (category: MarketCategory) => void;
  selectedRegion: Region;
  onSelectRegion: (region: Region) => void;
}

export const MarketsSubNav: React.FC<MarketsSubNavProps> = ({
  activeCategory,
  onSelectCategory,
  selectedRegion,
  onSelectRegion,
}) => {
  const [regionMenuOpen, setRegionMenuOpen] = useState(false);
  const regionRef = useRef<HTMLDivElement>(null);

  const categories: { id: MarketCategory; label: string; icon?: React.ReactNode }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'stocks', label: 'Stocks' },
    { id: 'crypto', label: 'Crypto' },
    { id: 'forex', label: 'Forex' },
    { id: 'indices', label: 'Indices' },
    { id: 'futures', label: 'Futures' },
    { id: 'bonds', label: 'Bonds' },
    { id: 'heatmap', label: 'Heatmap', icon: <Flame className="w-3.5 h-3.5 text-amber-400" /> },
  ];

  const regions: { id: Region; label: string; flag: string }[] = [
    { id: 'us', label: 'United States', flag: '🇺🇸' },
    { id: 'world', label: 'Global Markets', flag: '🌐' },
    { id: 'europe', label: 'Europe', flag: '🇪🇺' },
    { id: 'asia', label: 'Asia-Pacific', flag: '🇯🇵' },
    { id: 'uk', label: 'United Kingdom', flag: '🇬🇧' },
  ];

  const currentRegion = regions.find((r) => r.id === selectedRegion) || regions[0];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (regionRef.current && !regionRef.current.contains(e.target as Node)) {
        setRegionMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="w-full bg-[#131722] border-b border-[#2a2e39] px-4 lg:px-8">
      <div className="mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-2">
        {/* Category Navigation Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-1">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-[#2a2e39] text-white shadow-xs'
                    : 'text-[#787b86] hover:text-[#d1d4dc] hover:bg-[#1e222d]'
                }`}
              >
                {cat.icon}
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right side: Region Selector & Live Market Status */}
        <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
          {/* Market Session indicator */}
          <div className="hidden lg:flex items-center gap-2 text-xs text-[#787b86]">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>US Markets Open</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="flex items-center gap-1 font-mono text-[11px]">
              <Clock className="w-3 h-3 text-[#787b86]" />
              Closes in 2h 45m
            </span>
          </div>

          {/* Region Dropdown */}
          <div className="relative" ref={regionRef}>
            <button
              onClick={() => setRegionMenuOpen(!regionMenuOpen)}
              className="flex items-center gap-2 px-2.5 py-1 rounded-md bg-[#1e222d] border border-[#2a2e39] hover:bg-[#252a37] text-xs font-medium text-[#d1d4dc] transition-colors"
            >
              <span>{currentRegion.flag}</span>
              <span className="hidden md:inline">{currentRegion.label}</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#787b86]" />
            </button>

            {regionMenuOpen && (
              <div className="absolute right-0 mt-1 w-48 rounded-md bg-[#1e222d] border border-[#2a2e39] shadow-xl py-1 z-50">
                {regions.map((reg) => (
                  <button
                    key={reg.id}
                    onClick={() => {
                      onSelectRegion(reg.id);
                      setRegionMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs text-left transition-colors ${
                      selectedRegion === reg.id
                        ? 'bg-[#2962ff]/15 text-[#2962ff] font-semibold'
                        : 'text-[#d1d4dc] hover:bg-[#2a2e39]'
                    }`}
                  >
                    <span>{reg.flag}</span>
                    <span>{reg.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
