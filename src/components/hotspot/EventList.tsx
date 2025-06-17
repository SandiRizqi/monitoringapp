"use client";

import React, { useEffect, useState } from "react";
import { ZoomIn } from "lucide-react";
import { useSession } from "next-auth/react";
import { BACKEND_URL } from "@/components/conts";

interface Alert {
  company: string;
  date: string;
  time: string;
  distance: string;
  satellite: string;
  category: string;
  hotspot_id: string;
  aoi_id: string;
}

export default function EventList() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchEventData = async () => {
      if (!session?.user?.token) return;

      try {
        const response = await fetch(`${BACKEND_URL}/data/event-list/`, {
          headers: {
            'Authorization': `Token ${session.user.token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setAlerts(data);
        }
      } catch (error) {
        console.error('Error fetching event data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEventData();
  }, [session]);

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'aman':
        return 'bg-green-100 text-green-800 border border-green-200';
      case 'perhatian':
        return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
      case 'waspada':
        return 'bg-orange-100 text-orange-800 border border-orange-200';
      case 'bahaya':
        return 'bg-red-100 text-red-800 border border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  const handleZoom = (company: string, aoiId: string) => {
    console.log(`Zooming to ${company} (AOI: ${aoiId}) location on map`);
    // Implementasi zoom ke titik maps
  };

  if (loading) {
    return <div className="p-4">Loading recent events...</div>;
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Recent Hotspot Events</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-2 py-2 text-left">COMP</th>
              <th className="px-2 py-2 text-left">DATE</th>
              <th className="px-2 py-2 text-left">TIME</th>
              <th className="px-2 py-2 text-left">DIST (m)</th>
              <th className="px-2 py-2 text-left">SAT</th>
              <th className="px-2 py-2 text-left">CAT</th>
              <th className="px-2 py-2 text-left">ACTION</th>
            </tr>
          </thead>
          <tbody>
            {alerts.map((alert, index) => (
              <tr key={index} className="border-b hover:bg-gray-50">
                <td className="px-2 py-2 font-medium">{alert.company}</td>
                <td className="px-2 py-2">{alert.date}</td>
                <td className="px-2 py-2">{alert.time}</td>
                <td className="px-2 py-2">{alert.distance}</td>
                <td className="px-2 py-2 text-xs">{alert.satellite}</td>
                <td className="px-2 py-2">
                  <span className={`px-2 py-1 rounded-full text-xs ${getCategoryColor(alert.category)}`}>
                    {alert.category}
                  </span>
                </td>
                <td className="px-2 py-2">
                  <button
                    onClick={() => handleZoom(alert.company, alert.aoi_id)}
                    className="p-1 hover:bg-gray-200 rounded"
                    title="Zoom to location"
                  >
                    <ZoomIn size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
