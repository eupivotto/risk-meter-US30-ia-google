import React from 'react';
import { Indicator } from '../types';
import { ArrowUpIcon } from './icons/ArrowUpIcon';
import { ArrowDownIcon } from './icons/ArrowDownIcon';

interface IndicatorCardProps {
  indicator: Indicator;
}

export const IndicatorCard: React.FC<IndicatorCardProps> = ({ indicator }) => {
  const isPositive = indicator.changePercent >= 0;
  const colorClass = isPositive ? 'text-green-400' : 'text-red-400';
  const bgColorClass = isPositive ? 'bg-green-500/10' : 'bg-red-500/10';

  const formatValue = (indicator: Indicator) => {
    if (indicator.isYield) {
      return `${indicator.value.toFixed(3)}%`;
    }
    if (indicator.id === 'TICK') {
      return indicator.value.toFixed(0);
    }
    return indicator.value.toFixed(2);
  }

  return (
    <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 shadow-lg transition-all duration-300 hover:bg-gray-800 hover:border-blue-500">
      <p className="text-sm text-gray-400">{indicator.name}</p>
      <div className="flex items-baseline justify-between mt-2">
        <p className="text-2xl font-semibold">
          {formatValue(indicator)}
        </p>
        <div className={`flex items-center text-sm font-semibold px-2 py-1 rounded-md ${bgColorClass} ${colorClass}`}>
          {isPositive ? (
            <ArrowUpIcon className="h-4 w-4 mr-1" />
          ) : (
            <ArrowDownIcon className="h-4 w-4 mr-1" />
          )}
          <span>{indicator.changePercent.toFixed(2)}%</span>
        </div>
      </div>
    </div>
  );
};