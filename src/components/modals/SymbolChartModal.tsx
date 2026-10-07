import React, { useState, useMemo } from 'react';
import { 
  X, Star, ArrowUpRight, ArrowDownRight, Maximize2, 
  BarChart2, LineChart, TrendingUp, Bell, DollarSign,
  Activity, Sliders, Check
} from 'lucide-react';
import { SymbolData, Candle } from '../../types/market';
import { SymbolAvatar } from '../common/SymbolAvatar';
import { TechnicalMeter } from '../common/TechnicalMeter';

interface SymbolChartModalProps {
  symbol: SymbolData | null;
  onClose: () => void;
  isWatched: boolean;
  onToggleWatchlist: (ticker: string) => void;
  onAddAlert: (ticker: string, targetPrice: number, condition: 'above' | 'below') => void;
  onExecuteTrade: (ticker: string, shares: number, type: 'buy' | 'sell') => { success: boolean; message: string };
  paperBalance: number;
}

export const SymbolChartModal: React.FC<SymbolChartModalProps> = ({
  symbol,
  onClose,
  isWatched,
  onToggleWatchlist,
  onAddAlert,
  onExecuteTrade,
  paperBalance,
}) => {
  if (!symbol) return null;

  const [timeframe, setTimeframe] = useState<string>('1D');
  const [chartType, setChartType] = useState<'candles' | 'line' | 'area'>('candles');
  const [showMA20, setShowMA20] = useState<boolean>(true);
  const [showMA50, setShowMA50] = useState<boolean>(true);
  const [hoveredCandle, setHoveredCandle] = useState<Candle | null>(null);

  // Paper trading state
  const [tradeAction, setTradeAction] = useState<'buy' | 'sell'>('buy');
  const [sharesAmount, setSharesAmount] = useState<number>(10);
  const [tradeMessage, setTradeMessage] = useState<string | null>(null);

  // Price alert state
  const [alertPrice, setAlertPrice] = useState<string>((symbol.price * 1.05).toFixed(2));
  const [alertSuccess, setAlertSuccess] = useState<boolean>(false);

  const isUp = symbol.change >= 0;
  const candles = symbol.candles || [];

  // Calculate Moving Averages for candles
  const chartData = useMemo(() => {
    return candles.map((c, i) => {
      // 5-period MA
      const ma20Slice = candles.slice(Math.max(0, i - 5), i + 1);
      const ma20 = ma20Slice.reduce((sum, item) => sum + item.close, 0) / ma20Slice.length;

      // 12-period MA
      const ma50Slice = candles.slice(Math.max(0, i - 12), i + 1);
      const ma50 = ma50Slice.reduce((sum, item) => sum + item.close, 0) / ma50Slice.length;

      return {
        ...c,
        ma20,
        ma50,
      };
    });
  }, [candles]);

  const activeCandle = hoveredCandle || chartData[chartData.length - 1];

  // SVG Chart bounds calculation
  const minPrice = Math.min(...candles.map((c) => c.low));
  const maxPrice = Math.max(...candles.map((c) => c.high));
  const priceRange = maxPrice - minPrice || 1;
  const maxVolume = Math.max(...candles.map((c) => c.volume));

  const chartWidth = 720;
  const chartHeight = 360;
  const priceAreaHeight = 270;
  const volumeAreaHeight = 70;
  const topPadding = 15;

  const getYForPrice = (p: number) => {
    return topPadding + priceAreaHeight - ((p - minPrice) / priceRange) * priceAreaHeight;
  };

  const candleWidth = Math.max(4, Math.floor(chartWidth / (candles.length * 1.6)));

  const handleTradeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (sharesAmount <= 0) return;
    const res = onExecuteTrade(symbol.ticker, sharesAmount, tradeAction);
    setTradeMessage(res.message);
    setTimeout(() => setTradeMessage(null), 3000);
  };

  const handleAlertSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const p = parseFloat(alertPrice);
    if (isNaN(p) || p <= 0) return;
    onAddAlert(symbol.ticker, p, p > symbol.price ? 'above' : 'below');
    setAlertSuccess(true);
    setTimeout(() => setAlertSuccess(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-2 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-6xl rounded-2xl bg-[#1e222d] border border-[#2a2e39] shadow-2xl flex flex-col overflow-hidden max-h-[92vh]">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between border-b border-[#2a2e39] bg-[#181c27] px-4 py-3">
          <div className="flex items-center gap-3">
            <SymbolAvatar
              ticker={symbol.ticker}
              name={symbol.name}
              category={symbol.category}
              logoUrl={symbol.logoUrl}
              size="md"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-white text-base tracking-tight">
                  {symbol.ticker}
                </span>
                <span className="text-xs text-[#787b86] font-mono">
                  {symbol.exchange} · {symbol.category.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-[#787b86] truncate max-w-xs">{symbol.name}</p>
            </div>
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleWatchlist(symbol.ticker)}
              className={`p-2 rounded-lg border transition-colors ${
                isWatched
                  ? 'bg-amber-400/10 border-amber-400/30 text-amber-400'
                  : 'bg-[#1e222d] border-[#2a2e39] text-[#787b86] hover:text-white'
              }`}
              title={isWatched ? 'Remove from Watchlist' : 'Add to Watchlist'}
            >
              <Star className={`w-4 h-4 ${isWatched ? 'fill-amber-400' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-[#1e222d] border border-[#2a2e39] text-[#787b86] hover:text-white hover:bg-[#2a2e39] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Content Split: Chart (Left) + Analysis & Trading (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-y-auto">
          {/* Main Chart Area (8 cols) */}
          <div className="lg:col-span-8 p-4 lg:p-6 border-b lg:border-b-0 lg:border-r border-[#2a2e39] flex flex-col justify-between">
            {/* Chart Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              {/* Live Price display */}
              <div className="flex items-baseline gap-3">
                <span className="font-mono tabular-nums text-2xl lg:text-3xl font-extrabold text-white">
                  ${symbol.price < 5 ? symbol.price.toFixed(4) : symbol.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
                <div
                  className={`flex items-center gap-1 font-mono tabular-nums text-sm font-bold ${
                    isUp ? 'text-[#089981]' : 'text-[#f23645]'
                  }`}
                >
                  {isUp ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                  <span>
                    {isUp ? '+' : ''}{symbol.changePercent.toFixed(2)}% ({isUp ? '+' : ''}{symbol.change.toFixed(2)})
                  </span>
                </div>
              </div>

              {/* Timeframe & Chart Style Pills */}
              <div className="flex items-center gap-2">
                {/* Timeframes */}
                <div className="flex items-center gap-0.5 bg-[#131722] p-1 rounded-lg border border-[#2a2e39]">
                  {['1m', '5m', '15m', '1H', '4H', '1D', '1W'].map((tf) => (
                    <button
                      key={tf}
                      onClick={() => setTimeframe(tf)}
                      className={`px-2 py-1 text-xs font-semibold rounded transition-colors ${
                        timeframe === tf
                          ? 'bg-[#2962ff] text-white shadow-xs'
                          : 'text-[#787b86] hover:text-[#d1d4dc]'
                      }`}
                    >
                      {tf}
                    </button>
                  ))}
                </div>

                {/* Chart Types */}
                <div className="flex items-center gap-0.5 bg-[#131722] p-1 rounded-lg border border-[#2a2e39]">
                  <button
                    onClick={() => setChartType('candles')}
                    className={`p-1.5 rounded text-xs transition-colors ${
                      chartType === 'candles' ? 'bg-[#2a2e39] text-white' : 'text-[#787b86] hover:text-white'
                    }`}
                    title="Candlesticks"
                  >
                    <BarChart2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setChartType('line')}
                    className={`p-1.5 rounded text-xs transition-colors ${
                      chartType === 'line' ? 'bg-[#2a2e39] text-white' : 'text-[#787b86] hover:text-white'
                    }`}
                    title="Line Chart"
                  >
                    <LineChart className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* OHLC Bar Inspector */}
            <div className="flex flex-wrap items-center gap-4 text-xs font-mono tabular-nums text-[#787b86] mb-3 bg-[#131722] px-3 py-1.5 rounded-lg border border-[#2a2e39]/60">
              {activeCandle && (
                <>
                  <span>Time: <strong className="text-white">{activeCandle.time}</strong></span>
                  <span>O: <strong className="text-white">${activeCandle.open}</strong></span>
                  <span>H: <strong className="text-emerald-400">${activeCandle.high}</strong></span>
                  <span>L: <strong className="text-red-400">${activeCandle.low}</strong></span>
                  <span>C: <strong className={activeCandle.close >= activeCandle.open ? 'text-emerald-400' : 'text-red-400'}>${activeCandle.close}</strong></span>
                  <span>Vol: <strong className="text-blue-400">{activeCandle.volume.toLocaleString()}</strong></span>
                </>
              )}
            </div>

            {/* Interactive SVG Chart Viewport */}
            <div className="relative w-full bg-[#131722] rounded-xl border border-[#2a2e39] p-2 overflow-hidden flex-1 min-h-[340px]">
              {/* Horizontal Price Grid Lines */}
              <div className="absolute inset-0 flex flex-col justify-between p-4 pointer-events-none opacity-20">
                <div className="border-b border-[#787b86] w-full" />
                <div className="border-b border-[#787b86] w-full" />
                <div className="border-b border-[#787b86] w-full" />
                <div className="border-b border-[#787b86] w-full" />
              </div>

              {/* Price Scale Right Axis */}
              <div className="absolute right-2 top-4 bottom-14 flex flex-col justify-between text-[10px] font-mono tabular-nums text-[#787b86] pointer-events-none select-none z-10">
                <span>${maxPrice.toFixed(2)}</span>
                <span>${((maxPrice + minPrice) / 2).toFixed(2)}</span>
                <span>${minPrice.toFixed(2)}</span>
              </div>

              {/* SVG Canvas for Chart rendering */}
              <svg
                viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                className="w-full h-full cursor-crosshair overflow-visible"
                onMouseLeave={() => setHoveredCandle(null)}
              >
                {/* Volume Bars at bottom */}
                {chartData.map((c, i) => {
                  const x = (i / chartData.length) * (chartWidth - 50) + 15;
                  const vHeight = (c.volume / (maxVolume || 1)) * volumeAreaHeight;
                  const y = chartHeight - vHeight;
                  const isGreen = c.close >= c.open;

                  return (
                    <rect
                      key={`vol-${i}`}
                      x={x - candleWidth / 2}
                      y={y}
                      width={candleWidth}
                      height={vHeight}
                      fill={isGreen ? '#089981' : '#f23645'}
                      opacity={0.35}
                    />
                  );
                })}

                {/* Candlesticks or Line */}
                {chartType === 'candles' ? (
                  chartData.map((c, i) => {
                    const x = (i / chartData.length) * (chartWidth - 50) + 15;
                    const isGreen = c.close >= c.open;
                    const highY = getYForPrice(c.high);
                    const lowY = getYForPrice(c.low);
                    const openY = getYForPrice(c.open);
                    const closeY = getYForPrice(c.close);
                    const bodyTop = Math.min(openY, closeY);
                    const bodyHeight = Math.max(2, Math.abs(closeY - openY));

                    return (
                      <g
                        key={`candle-${i}`}
                        onMouseEnter={() => setHoveredCandle(c)}
                        className="transition-opacity hover:opacity-80"
                      >
                        {/* Upper and Lower Wick */}
                        <line
                          x1={x}
                          y1={highY}
                          x2={x}
                          y2={lowY}
                          stroke={isGreen ? '#089981' : '#f23645'}
                          strokeWidth={1.5}
                        />
                        {/* Candle Body */}
                        <rect
                          x={x - candleWidth / 2}
                          y={bodyTop}
                          width={candleWidth}
                          height={bodyHeight}
                          fill={isGreen ? '#089981' : '#f23645'}
                          rx={1}
                        />
                      </g>
                    );
                  })
                ) : (
                  // Line or Area Chart
                  <>
                    <path
                      d={`M ${chartData
                        .map(
                          (c, i) =>
                            `${(i / chartData.length) * (chartWidth - 50) + 15},${getYForPrice(
                              c.close
                            )}`
                        )
                        .join(' L ')}`}
                      fill="none"
                      stroke="#2962ff"
                      strokeWidth={2.5}
                    />
                  </>
                )}

                {/* MA 20 Line (Amber) */}
                {showMA20 && (
                  <path
                    d={`M ${chartData
                      .map(
                        (c, i) =>
                          `${(i / chartData.length) * (chartWidth - 50) + 15},${getYForPrice(
                            c.ma20
                          )}`
                      )
                      .join(' L ')}`}
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth={1.5}
                    strokeDasharray="4 2"
                    opacity={0.8}
                  />
                )}

                {/* MA 50 Line (Blue) */}
                {showMA50 && (
                  <path
                    d={`M ${chartData
                      .map(
                        (c, i) =>
                          `${(i / chartData.length) * (chartWidth - 50) + 15},${getYForPrice(
                            c.ma50
                          )}`
                      )
                      .join(' L ')}`}
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth={1.5}
                    opacity={0.7}
                  />
                )}
              </svg>
            </div>

            {/* Indicator Toggles */}
            <div className="flex items-center gap-4 mt-3 text-xs text-[#787b86]">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showMA20}
                  onChange={(e) => setShowMA20(e.target.checked)}
                  className="rounded text-amber-500 bg-[#131722] border-[#2a2e39]"
                />
                <span className="text-amber-400 font-mono">MA (20)</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showMA50}
                  onChange={(e) => setShowMA50(e.target.checked)}
                  className="rounded text-blue-400 bg-[#131722] border-[#2a2e39]"
                />
                <span className="text-sky-400 font-mono">MA (50)</span>
              </label>
            </div>
          </div>

          {/* Right Column: Technical Meter & Paper Trading (4 cols) */}
          <div className="lg:col-span-4 p-4 lg:p-6 space-y-5 bg-[#181c27]/60">
            {/* Technical Analysis Gauge */}
            <div className="p-4 rounded-xl bg-[#1e222d] border border-[#2a2e39]">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-bold text-white tracking-tight flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-[#2962ff]" />
                  Technical Analysis Summary
                </h3>
              </div>
              <TechnicalMeter
                score={symbol.technicalScore}
                rating={symbol.rating}
              />
              <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-[#2a2e39] text-center text-[11px] font-mono">
                <div>
                  <div className="text-[#787b86]">Oscillators</div>
                  <div className="text-emerald-400 font-bold">Buy (4)</div>
                </div>
                <div>
                  <div className="text-[#787b86]">Neutral</div>
                  <div className="text-slate-400 font-bold">9</div>
                </div>
                <div>
                  <div className="text-[#787b86]">Moving Avg</div>
                  <div className="text-emerald-400 font-bold">Strong Buy</div>
                </div>
              </div>
            </div>

            {/* Paper Trading Simulation Widget */}
            <div className="p-4 rounded-xl bg-[#1e222d] border border-[#2a2e39]">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold text-white tracking-tight flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                  Simulated Trading (Paper Account)
                </h3>
                <span className="text-[11px] font-mono text-emerald-400">
                  ${paperBalance.toLocaleString(undefined, { maximumFractionDigits: 0 })} USD
                </span>
              </div>

              {tradeMessage && (
                <div className="p-2 mb-3 rounded bg-blue-500/10 border border-blue-500/30 text-xs text-blue-300">
                  {tradeMessage}
                </div>
              )}

              <form onSubmit={handleTradeSubmit} className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setTradeAction('buy')}
                    className={`py-2 rounded-lg text-xs font-bold transition-colors ${
                      tradeAction === 'buy'
                        ? 'bg-[#089981] text-white shadow-xs'
                        : 'bg-[#131722] text-[#787b86] hover:text-white'
                    }`}
                  >
                    BUY / LONG
                  </button>
                  <button
                    type="button"
                    onClick={() => setTradeAction('sell')}
                    className={`py-2 rounded-lg text-xs font-bold transition-colors ${
                      tradeAction === 'sell'
                        ? 'bg-[#f23645] text-white shadow-xs'
                        : 'bg-[#131722] text-[#787b86] hover:text-white'
                    }`}
                  >
                    SELL / SHORT
                  </button>
                </div>

                <div>
                  <label className="text-[11px] text-[#787b86] block mb-1">
                    Units / Shares:
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={sharesAmount}
                    onChange={(e) => setSharesAmount(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full bg-[#131722] border border-[#2a2e39] rounded-lg px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-[#2962ff]"
                  />
                </div>

                <div className="flex items-center justify-between text-xs font-mono text-[#787b86]">
                  <span>Total Order:</span>
                  <span className="text-white font-bold">
                    ${(sharesAmount * symbol.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>

                <button
                  type="submit"
                  className={`w-full py-2.5 rounded-lg text-xs font-bold text-white transition-colors cursor-pointer ${
                    tradeAction === 'buy' ? 'bg-[#089981] hover:bg-[#0aa88f]' : 'bg-[#f23645] hover:bg-[#d62837]'
                  }`}
                >
                  Place {tradeAction.toUpperCase()} Order
                </button>
              </form>
            </div>

            {/* Price Alert Form */}
            <div className="p-4 rounded-xl bg-[#1e222d] border border-[#2a2e39]">
              <div className="flex items-center gap-1.5 mb-2">
                <Bell className="w-3.5 h-3.5 text-amber-400" />
                <h3 className="text-xs font-bold text-white tracking-tight">Create Price Alert</h3>
              </div>
              <form onSubmit={handleAlertSubmit} className="flex gap-2">
                <input
                  type="number"
                  step="0.01"
                  value={alertPrice}
                  onChange={(e) => setAlertPrice(e.target.value)}
                  className="w-full bg-[#131722] border border-[#2a2e39] rounded-lg px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-[#2962ff]"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-[#2962ff] hover:bg-[#1e53e5] text-white rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer"
                >
                  {alertSuccess ? <Check className="w-3.5 h-3.5" /> : 'Set Alert'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
