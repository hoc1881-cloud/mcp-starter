import React from 'react';

interface LogoProps {
  className?: string;
  showText?: boolean;
}

export const TradingViewLogo: React.FC<LogoProps> = ({ className = 'h-7', showText = true }) => {
  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* TradingView Geometric Monogram */}
      <svg
        viewBox="0 0 36 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-auto shrink-0"
      >
        {/* T-bar and left leg */}
        <path
          d="M0 0H14V6H7V28H0V0Z"
          fill="currentColor"
        />
        {/* Center dot / eye */}
        <rect
          x="16"
          y="20"
          width="6"
          height="8"
          fill="currentColor"
        />
        {/* Right angled slash (V leg) */}
        <path
          d="M24 0H31L36 28H29L24 0Z"
          fill="#2962FF"
        />
      </svg>

      {showText && (
        <span className="font-bold tracking-tight text-lg text-white font-sans flex items-center">
          TradingView
        </span>
      )}
    </div>
  );
};
