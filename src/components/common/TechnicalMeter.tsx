import React from 'react';

interface TechnicalMeterProps {
  score: number; // -100 to +100
  rating: 'Strong Buy' | 'Buy' | 'Neutral' | 'Sell' | 'Strong Sell';
  size?: 'sm' | 'md' | 'lg';
}

export const TechnicalMeter: React.FC<TechnicalMeterProps> = ({ score, rating, size = 'md' }) => {
  // Convert -100..100 to angle -80deg..+80deg
  const angle = Math.max(-80, Math.min(80, (score / 100) * 80));

  const ratingColor = {
    'Strong Buy': 'text-[#089981] bg-[#089981]/15 border-[#089981]/30',
    Buy: 'text-[#089981] bg-[#089981]/10 border-[#089981]/20',
    Neutral: 'text-slate-400 bg-slate-500/10 border-slate-500/20',
    Sell: 'text-[#f23645] bg-[#f23645]/10 border-[#f23645]/20',
    'Strong Sell': 'text-[#f23645] bg-[#f23645]/15 border-[#f23645]/30',
  }[rating];

  return (
    <div className="flex flex-col items-center select-none">
      {/* Gauge Arc SVG */}
      <div className="relative w-36 h-20 overflow-hidden flex items-end justify-center">
        <svg viewBox="0 0 140 75" className="w-full h-full">
          {/* Background Track Arcs */}
          {/* Strong Sell (Red) */}
          <path
            d="M 15 70 A 55 55 0 0 1 35 32"
            fill="none"
            stroke="#f23645"
            strokeWidth="8"
            strokeLinecap="round"
          />
          {/* Sell (Light Red) */}
          <path
            d="M 39 28 A 55 55 0 0 1 60 18"
            fill="none"
            stroke="#f23645"
            strokeOpacity="0.6"
            strokeWidth="8"
          />
          {/* Neutral (Gray) */}
          <path
            d="M 64 16 A 55 55 0 0 1 76 16"
            fill="none"
            stroke="#787b86"
            strokeWidth="8"
          />
          {/* Buy (Light Green) */}
          <path
            d="M 80 18 A 55 55 0 0 1 101 28"
            fill="none"
            stroke="#089981"
            strokeOpacity="0.6"
            strokeWidth="8"
          />
          {/* Strong Buy (Green) */}
          <path
            d="M 105 32 A 55 55 0 0 1 125 70"
            fill="none"
            stroke="#089981"
            strokeWidth="8"
            strokeLinecap="round"
          />
        </svg>

        {/* Needle */}
        <div
          className="absolute bottom-1 w-1 h-12 bg-white origin-bottom rounded-full transition-transform duration-500 ease-out shadow-md"
          style={{
            transform: `rotate(${angle}deg)`,
          }}
        >
          <div className="w-2.5 h-2.5 -top-1 -left-0.5 rounded-full bg-white absolute" />
        </div>
        {/* Center pivot */}
        <div className="absolute bottom-0 w-3 h-3 rounded-full bg-[#1e222d] border-2 border-white" />
      </div>

      {/* Rating badge */}
      <div className="mt-1 flex items-center gap-1.5">
        <span className={`text-xs font-semibold px-2 py-0.5 rounded border ${ratingColor}`}>
          {rating}
        </span>
      </div>
    </div>
  );
};
