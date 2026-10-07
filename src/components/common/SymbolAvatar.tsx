import React, { useState } from 'react';
import { AssetCategory } from '../../types/market';

interface SymbolAvatarProps {
  ticker: string;
  name?: string;
  category: AssetCategory;
  logoUrl?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const SymbolAvatar: React.FC<SymbolAvatarProps> = ({
  ticker,
  name,
  category,
  logoUrl,
  size = 'md',
  className = '',
}) => {
  const [imageError, setImageError] = useState(false);

  const sizeClasses = {
    sm: 'w-6 h-6 text-[10px]',
    md: 'w-8 h-8 text-xs',
    lg: 'w-10 h-10 text-sm',
  }[size];

  // Colors based on asset class
  const getFallbackColor = () => {
    switch (category) {
      case 'crypto':
        return 'bg-amber-500/15 text-amber-400 border border-amber-500/25';
      case 'index':
        return 'bg-blue-500/15 text-blue-400 border border-blue-500/25';
      case 'forex':
        return 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25';
      case 'futures':
        return 'bg-orange-500/15 text-orange-400 border border-orange-500/25';
      case 'bond':
        return 'bg-purple-500/15 text-purple-400 border border-purple-500/25';
      case 'stock':
      default:
        return 'bg-slate-700/50 text-slate-200 border border-slate-600/30';
    }
  };

  // Display initial letters
  const displayChars = ticker.replace(/[^A-Z0-9]/gi, '').slice(0, 3) || 'SYM';

  return (
    <div
      className={`relative rounded-full flex items-center justify-center shrink-0 font-bold overflow-hidden ${sizeClasses} ${getFallbackColor()} ${className}`}
      title={name || ticker}
    >
      {logoUrl && !imageError ? (
        <img
          src={logoUrl}
          alt={ticker}
          referrerPolicy="no-referrer"
          onError={() => setImageError(true)}
          className="w-full h-full object-contain p-1 rounded-full"
        />
      ) : (
        <span className="leading-none select-none tracking-tight">{displayChars}</span>
      )}
    </div>
  );
};
