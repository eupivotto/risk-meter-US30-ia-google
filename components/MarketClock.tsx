
import React, { useState, useEffect } from 'react';
import { MarketStatus } from '../types';

export const MarketClock: React.FC = () => {
  const [nyTime, setNyTime] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setNyTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const getMarketStatus = (date: Date): { status: MarketStatus; color: string } => {
    const utcHours = date.getUTCHours();
    const utcMinutes = date.getUTCMinutes();

    // New York is UTC-4 during DST, UTC-5 standard.
    // Let's approximate and use UTC-4 for simplicity.
    const nyHour = (utcHours - 4 + 24) % 24;

    // Market opens 9:30 AM, closes 4:00 PM NY time
    const marketOpenHour = 9;
    const marketOpenMinute = 30;
    const marketCloseHour = 16;
    
    const currentTimeInMinutes = nyHour * 60 + utcMinutes;
    const marketOpenTimeInMinutes = marketOpenHour * 60 + marketOpenMinute;
    const marketCloseTimeInMinutes = marketCloseHour * 60;
    const preMarketStartTimeInMinutes = 4 * 60; // 4:00 AM NY time


    if (currentTimeInMinutes >= marketOpenTimeInMinutes && currentTimeInMinutes < marketCloseTimeInMinutes) {
      return { status: MarketStatus.OPEN, color: 'bg-green-500/10 text-green-400' };
    }
    if (currentTimeInMinutes >= preMarketStartTimeInMinutes && currentTimeInMinutes < marketOpenTimeInMinutes) {
      return { status: MarketStatus.PRE_MARKET, color: 'bg-yellow-500/10 text-yellow-400' };
    }
    return { status: MarketStatus.CLOSED, color: 'bg-red-500/10 text-red-400' };
  };

  const { status, color } = getMarketStatus(nyTime);

  return (
    <div className="flex items-center space-x-4 p-4 rounded-lg bg-gray-800/50 border border-gray-700">
      <div>
        <span className="text-gray-400 text-sm">New York Time</span>
        <p className="text-2xl font-semibold tracking-wider">
          {nyTime.toLocaleTimeString('en-US', { timeZone: 'America/New_York', hour12: true, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </p>
      </div>
      <div className="flex-grow text-right">
        <span className="text-gray-400 text-sm">Market Status</span>
        <p className={`text-lg font-bold px-3 py-1 rounded-full inline-block ${color}`}>
          {status}
        </p>
      </div>
    </div>
  );
};
