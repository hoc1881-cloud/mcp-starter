import React from 'react';
import { TradingViewLogo } from '../common/TradingViewLogo';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#131722] border-t border-[#2a2e39] py-10 px-4 lg:px-8 mt-12">
      <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <TradingViewLogo />
          <p className="text-xs text-[#787b86] mt-2 max-w-md leading-relaxed">
            Where the world charts, chats and trades markets. Real-time market quotes, comprehensive technical analysis, and global financial data.
          </p>
          <p className="text-[11px] text-[#787b86]/70 mt-2">
            Market data provided by ICE Data Services, BATS, CME Group, and cryptocurrency protocols.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-6 text-xs text-[#787b86]">
          <span className="hover:text-white transition-colors cursor-pointer">SuperCharts</span>
          <span className="hover:text-white transition-colors cursor-pointer">Stock Screener</span>
          <span className="hover:text-white transition-colors cursor-pointer">Crypto Screener</span>
          <span className="hover:text-white transition-colors cursor-pointer">Forex Heatmap</span>
          <span className="hover:text-white transition-colors cursor-pointer">Economic Calendar</span>
          <span className="hover:text-white transition-colors cursor-pointer">Privacy & Terms</span>
        </div>
      </div>
      <div className="mx-auto max-w-7xl pt-6 mt-6 border-t border-[#2a2e39]/40 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#787b86]">
        <span>© 2026 TradingView, Inc. All rights reserved.</span>
        <span>Quotes delayed 15m unless marked real-time.</span>
      </div>
    </footer>
  );
};
