
export interface Indicator {
  id: string;
  name: string;
  value: number;
  change: number;
  changePercent: number;
  isYield?: boolean;
}

export enum MarketStatus {
  PRE_MARKET = 'Pre-Market',
  OPEN = 'Open',
  CLOSED = 'Closed',
}
