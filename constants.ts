import { Indicator } from './types';

export const INITIAL_INDICATORS: Indicator[] = [
  { id: 'US30', name: 'Dow Jones (US30)', value: 39000.00, change: 0.00, changePercent: 0.00 },
  { id: 'SPX500', name: 'S&P 500', value: 5400.00, change: 0.00, changePercent: 0.00 },
  { id: 'NAS100', name: 'Nasdaq 100', value: 19500.00, change: 0.00, changePercent: 0.00 },
  { id: 'TICK', name: 'NYSE TICK ($TICK)', value: 0, change: 0, changePercent: 0.00 },
  { id: 'VIX', name: 'VIX (Fear Index)', value: 13.50, change: 0.00, changePercent: 0.00 },
  { id: 'MOVE', name: 'MOVE (Bond Volatility)', value: 85.00, change: 0.00, changePercent: 0.00 },
  { id: 'DXY', name: 'US Dollar Index (DXY)', value: 105.50, change: 0.00, changePercent: 0.00 },
  { id: 'XAUUSD', name: 'Gold (XAU/USD)', value: 2300.00, change: 0.00, changePercent: 0.00 },
  { id: 'WTI', name: 'Crude Oil (WTI)', value: 80.00, change: 0.00, changePercent: 0.00 },
  { id: 'US10Y', name: '10-Year Treasury', value: 4.25, change: 0.00, changePercent: 0.00, isYield: true },
  { id: 'US30Y', name: '30-Year Treasury', value: 4.40, change: 0.00, changePercent: 0.00, isYield: true },
];