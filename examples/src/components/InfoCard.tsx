import React from 'react';

interface InfoCardProps {
  title: string;
  value: string;
  subtext?: string;
  trend?: 'up' | 'down';
}

const InfoCard: React.FC<InfoCardProps> = ({ title, value, subtext, trend }) => {
  const trendColor = trend === 'up' ? 'text-green-400' : trend === 'down' ? 'text-red-400' : 'text-gray-300';
  const trendSymbol = trend === 'up' ? '▲' : trend === 'down' ? '▼' : '';

  return (
    <div className="flex flex-col justify-between h-full">
      <div className="text-sm text-gray-400 mb-2 font-medium">{title}</div>
      <div className={`text-2xl font-bold flex items-center gap-2 ${trendColor}`}>
        {value} {trendSymbol && <span>{trendSymbol}</span>}
      </div>
      {subtext && <div className="text-xs text-gray-500 mt-1">{subtext}</div>}
    </div>
  );
};

export default InfoCard;