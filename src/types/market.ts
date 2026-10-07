export type MarketCategory = 
  | 'overview' 
  | 'stocks' 
  | 'crypto' 
  | 'forex' 
  | 'indices' 
  | 'futures' 
  | 'bonds' 
  | 'heatmap';

export type AssetCategory = 'stock' | 'crypto' | 'index' | 'forex' | 'futures' | 'bond';

export type Region = 'us' | 'world' | 'europe' | 'asia' | 'uk';

export interface Candle {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface SymbolData {
  ticker: string;
  name: string;
  category: AssetCategory;
  price: number;
  change: number;
  changePercent: number;
  volume: string;
  volumeRaw?: number;
  marketCap?: string;
  marketCapRaw?: number;
  peRatio?: number;
  high52w: number;
  low52w: number;
  dayHigh: number;
  dayLow: number;
  open: number;
  prevClose: number;
  rating: 'Strong Buy' | 'Buy' | 'Neutral' | 'Sell' | 'Strong Sell';
  technicalScore: number; // -100 to +100
  sparkline: number[];
  candles: Candle[];
  sector?: string;
  subCategory?: string; // e.g. 'DeFi', 'Energy', 'Majors', 'Tech'
  exchange?: string;
  currency?: string;
  logoUrl?: string;
  country?: string;
}

export interface HeatmapItem {
  ticker: string;
  name: string;
  sector: string;
  marketCap: number; // weight
  changePercent: number;
  price: number;
}

export interface MarketNews {
  id: string;
  title: string;
  source: string;
  time: string;
  symbols: string[];
  url?: string;
  category: string;
}

export interface EconomicEvent {
  id: string;
  time: string;
  country: string;
  flag: string;
  event: string;
  impact: 'high' | 'medium' | 'low';
  actual?: string;
  forecast?: string;
  previous?: string;
}

export interface WatchlistAlert {
  id: string;
  ticker: string;
  targetPrice: number;
  condition: 'above' | 'below';
  created: number;
}

export interface PaperPosition {
  ticker: string;
  shares: number;
  avgPrice: number;
  type: 'buy' | 'sell';
}
