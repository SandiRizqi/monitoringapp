import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { BACKEND_URL } from "@/components/conts";

interface StatsData {
  total_events: number;
  total_areas: number;
  total_companies: number;
}

export default function HotspotStats() {
  const [stats, setStats] = useState<StatsData>({
    total_events: 0,
    total_areas: 0,
    total_companies: 0
  });
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchStatsData = async () => {
      if (!session?.user?.token) return;

      try {
        const response = await fetch(`${BACKEND_URL}/data/hotspot-stats/`, {
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
  }, [session]);

  if (loading) {
    return <div className="p-4">Loading statistics...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
      <div className="bg-white p-6 rounded-lg shadow text-center">
        <h3 className="text-lg font-semibold text-gray-600 mb-2">Total Kejadian</h3>
        <p className="text-3xl font-bold text-blue-600">{stats.total_events.toLocaleString()}</p>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow text-center">
        <h3 className="text-lg font-semibold text-gray-600 mb-2">Total Area</h3>
        <p className="text-3xl font-bold text-green-600">{stats.total_areas.toLocaleString()}</p>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow text-center">
        <h3 className="text-lg font-semibent text-gray-600 mb-2">Jumlah PT Terlibat</h3>
        <p className="text-3xl font-bold text-orange-600">{stats.total_companies.toLocaleString()}</p>
      </div>
    </div>
  );
}
