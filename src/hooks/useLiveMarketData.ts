import { useState, useEffect, useCallback } from 'react';
import { SymbolData, PaperPosition, WatchlistAlert } from '../types/market';
import { INITIAL_SYMBOLS } from '../data/marketData';

export function useLiveMarketData() {
  const [symbols, setSymbols] = useState<SymbolData[]>(INITIAL_SYMBOLS);
  const [isLive, setIsLive] = useState<boolean>(true);
  const [flashingTicks, setFlashingTicks] = useState<Record<string, 'up' | 'down'>>({});
  
  // Watchlist stored in state/localStorage
  const [watchlistTickers, setWatchlistTickers] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('tv_watchlist');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return ['SPX', 'NDX', 'NVDA', 'AAPL', 'BTCUSD', 'SOLUSD', 'GC1!', 'CL1!'];
  });

  // Paper trading balance & positions
  const [paperBalance, setPaperBalance] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('tv_paper_balance');
      if (saved) return Number(saved);
    } catch {
      // ignore
    }
    return 100000; // $100,000 starting paper balance
  });

  const [paperPositions, setPaperPositions] = useState<PaperPosition[]>(() => {
    try {
      const saved = localStorage.getItem('tv_paper_positions');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [
      { ticker: 'NVDA', shares: 50, avgPrice: 128.50, type: 'buy' },
      { ticker: 'BTCUSD', shares: 0.5, avgPrice: 62400, type: 'buy' },
    ];
  });

  // Price alerts
  const [alerts, setAlerts] = useState<WatchlistAlert[]>([]);
  const [triggeredAlerts, setTriggeredAlerts] = useState<string[]>([]);

  // Persist watchlist
  useEffect(() => {
    try {
      localStorage.setItem('tv_watchlist', JSON.stringify(watchlistTickers));
    } catch {
      // ignore
    }
  }, [watchlistTickers]);

  // Persist paper trading
  useEffect(() => {
    try {
      localStorage.setItem('tv_paper_balance', paperBalance.toString());
      localStorage.setItem('tv_paper_positions', JSON.stringify(paperPositions));
    } catch {
      // ignore
    }
  }, [paperBalance, paperPositions]);

  // Live simulation tick engine
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      // Pick 1 to 3 random symbols to fluctuate
      setSymbols((prevSymbols) => {
        const countToUpdate = Math.floor(Math.random() * 3) + 1;
        const newFlashing: Record<string, 'up' | 'down'> = {};
        const updated = [...prevSymbols];

        for (let i = 0; i < countToUpdate; i++) {
          const randomIndex = Math.floor(Math.random() * updated.length);
          const item = updated[randomIndex];
          if (!item) continue;

          // Compute micro tick (-0.2% to +0.25%)
          const tickDeltaPercent = (Math.random() - 0.48) * (item.category === 'crypto' ? 0.003 : 0.0015);
          const rawNewPrice = item.price * (1 + tickDeltaPercent);
          const decimals = item.price < 5 ? 4 : item.price < 100 ? 2 : item.category === 'bond' ? 3 : 2;
          const newPrice = Number(rawNewPrice.toFixed(decimals));

          if (newPrice === item.price) continue;

          const direction = newPrice > item.price ? 'up' : 'down';
          newFlashing[item.ticker] = direction;

          const newChange = Number((newPrice - item.open).toFixed(decimals));
          const newChangePercent = Number(((newChange / item.open) * 100).toFixed(2));

          // Update sparkline
          const updatedSparkline = [...item.sparkline.slice(1), newPrice];

          // Update latest candle close
          const updatedCandles = [...item.candles];
          if (updatedCandles.length > 0) {
            const lastCandle = { ...updatedCandles[updatedCandles.length - 1] };
            lastCandle.close = newPrice;
            lastCandle.high = Math.max(lastCandle.high, newPrice);
            lastCandle.low = Math.min(lastCandle.low, newPrice);
            lastCandle.volume += Math.floor(Math.random() * 500);
            updatedCandles[updatedCandles.length - 1] = lastCandle;
          }

          updated[randomIndex] = {
            ...item,
            price: newPrice,
            change: newChange,
            changePercent: newChangePercent,
            dayHigh: Math.max(item.dayHigh, newPrice),
            dayLow: Math.min(item.dayLow, newPrice),
            sparkline: updatedSparkline,
            candles: updatedCandles,
          };

          // Check alerts
          alerts.forEach((alert) => {
            if (alert.ticker === item.ticker) {
              if (
                (alert.condition === 'above' && newPrice >= alert.targetPrice) ||
                (alert.condition === 'below' && newPrice <= alert.targetPrice)
              ) {
                setTriggeredAlerts((prev) => [
                  `Alert: ${item.ticker} reached $${newPrice} (${alert.condition} $${alert.targetPrice})`,
                  ...prev.slice(0, 4),
                ]);
              }
            }
          });
        }

        setFlashingTicks((prev) => ({ ...prev, ...newFlashing }));

        return updated;
      });

      // Clear flashing highlights after 600ms
      setTimeout(() => {
        setFlashingTicks({});
      }, 600);
    }, 1800);

    return () => clearInterval(interval);
  }, [isLive, alerts]);

  // Toggle watchlist symbol
  const toggleWatchlist = useCallback((ticker: string) => {
    setWatchlistTickers((prev) =>
      prev.includes(ticker) ? prev.filter((t) => t !== ticker) : [...prev, ticker]
    );
  }, []);

  // Add alert
  const addAlert = useCallback((ticker: string, targetPrice: number, condition: 'above' | 'below') => {
    const newAlert: WatchlistAlert = {
      id: `alert-${Date.now()}`,
      ticker,
      targetPrice,
      condition,
      created: Date.now(),
    };
    setAlerts((prev) => [newAlert, ...prev]);
  }, []);

  const removeAlert = useCallback((id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  }, []);

  // Execute paper trade
  const executePaperTrade = useCallback(
    (ticker: string, shares: number, type: 'buy' | 'sell') => {
      const sym = symbols.find((s) => s.ticker === ticker);
      if (!sym) return { success: false, message: 'Symbol not found' };

      const totalValue = sym.price * shares;

      if (type === 'buy') {
        if (paperBalance < totalValue) {
          return { success: false, message: 'Insufficient paper funds' };
        }
        setPaperBalance((b) => b - totalValue);

        setPaperPositions((prev) => {
          const existing = prev.find((p) => p.ticker === ticker);
          if (existing) {
            const newTotalShares = existing.shares + shares;
            const newAvgPrice =
              (existing.shares * existing.avgPrice + totalValue) / newTotalShares;
            return prev.map((p) =>
              p.ticker === ticker
                ? { ...p, shares: newTotalShares, avgPrice: Number(newAvgPrice.toFixed(2)) }
                : p
            );
          } else {
            return [...prev, { ticker, shares, avgPrice: sym.price, type: 'buy' }];
          }
        });
        return { success: true, message: `Successfully bought ${shares} ${ticker} at $${sym.price}` };
      } else {
        // Sell
        const existing = paperPositions.find((p) => p.ticker === ticker);
        if (!existing || existing.shares < shares) {
          return { success: false, message: 'Insufficient shares to sell' };
        }
        setPaperBalance((b) => b + totalValue);
        setPaperPositions((prev) =>
          prev
            .map((p) => (p.ticker === ticker ? { ...p, shares: p.shares - shares } : p))
            .filter((p) => p.shares > 0)
        );
        return { success: true, message: `Successfully sold ${shares} ${ticker} at $${sym.price}` };
      }
    },
    [paperBalance, paperPositions, symbols]
  );

  return {
    symbols,
    isLive,
    setIsLive,
    flashingTicks,
    watchlistTickers,
    toggleWatchlist,
    paperBalance,
    paperPositions,
    executePaperTrade,
    alerts,
    addAlert,
    removeAlert,
    triggeredAlerts,
    dismissAlert: (idx: number) =>
      setTriggeredAlerts((prev) => prev.filter((_, i) => i !== idx)),
  };
}
