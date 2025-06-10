import React from "react";

interface CompanyEvent {
  name: string;
  events: number;
  trend?: 'up' | 'down' | 'neutral';
}

export default function CompanyEvents() {
  const companies: CompanyEvent[] = [
    { name: "PT A", events: 15, trend: 'up' },
    { name: "PT B", events: 9, trend: 'down' },
    { name: "PT C", events: 7, trend: 'neutral' },
    { name: "PT D", events: 5, trend: 'up' },
  ];

  const getTrendIcon = (trend?: string) => {
    switch (trend) {
      case 'up': return '↑';
      case 'down': return '↓';
      default: return '→';
    }
  };

  const getTrendColor = (trend?: string) => {
    switch (trend) {
      case 'up': return 'text-red-500';
      case 'down': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-lg font-semibold mb-4">Perusahaan dengan Kejadian Terbanyak</h2>
      <div className="space-y-3">
        {companies.map((company, index) => (
          <div key={index} className="flex justify-between items-center">
            <span>{company.name}</span>
            <div className="flex items-center">
              <span className="font-bold mr-2">{company.events}</span>
              {company.trend && (
                <span className={`${getTrendColor(company.trend)}`}>
                  {getTrendIcon(company.trend)}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}