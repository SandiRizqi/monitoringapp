"use client";

import React, { useState, useEffect } from "react";
import { useSession } from 'next-auth/react';
import { BACKEND_URL } from '@/components/conts';;
import { useConfig } from "@/components/context/DeforestationConfigProvider";

interface StatsData {
  total_events: number;
  total_area: number;
  total_companies: number;
}

export default function DeforestationStats() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<StatsData>({
    total_events: 0,
    total_area: 0,
    total_companies: 0
  });
  const [loading, setLoading] = useState(true);
  const { config } = useConfig();

  useEffect(() => {
    const fetchStatsData = async () => {
      if (!session?.user?.token) return;

      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (config.startdate) params.append('start_date', config.startdate);
        if (config.enddate) params.append('end_date', config.enddate);

        const response = await fetch(`${BACKEND_URL}/data/deforestation-stats/?${params.toString()}`, {
          headers: {
            'Authorization': `Token ${session.user.token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Error fetching stats data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatsData();
  }, [session, config.startdate, config.enddate]);

  return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-6">
            <div className="bg-white p-6 rounded-lg shadow">
                <div className="text-center">
                    <h3 className="text-sm font-semibold text-gray-900 mb-2">Total Alert</h3>
                    <div className="text-3xl font-bold text-blue-600">
                        {loading ? (
                            <div className="animate-pulse bg-gray-100 h-8 w-16 mx-auto rounded"></div>
                        ) : (
                            stats.total_events.toLocaleString()
                        )}
                    </div>
                </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
                <div className="text-center">
                    <h3 className="text-sm font-semibold text-gray-900 mb-2">Total Area</h3>
                    <div className="text-2xl font-bold text-green-600">
                        {loading ? (
                            <div className="animate-pulse bg-gray-100 h-8 w-16 mx-auto rounded"></div>
                        ) : (
                            stats.total_area.toFixed(2) + " Ha"
                        )}
                    </div>
                </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
                <div className="text-center">
                    <h3 className="text-sm font-semibold text-gray-900 mb-2">Total AOI</h3>
                    <div className="text-3xl font-bold text-purple-600">
                        {loading ? (
                            <div className="animate-pulse bg-gray-100 h-8 w-16 mx-auto rounded"></div>
                        ) : (
                            stats.total_companies.toLocaleString()
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
