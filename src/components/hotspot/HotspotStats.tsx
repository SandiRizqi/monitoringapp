import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useConfig } from "@/components/context/HotspotConfigProvider";
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
    const { config } = useConfig();

    useEffect(() => {
        const fetchStatsData = async () => {
            if (!session?.user?.token) return;

            try {
                setLoading(true);
                const params = new URLSearchParams();
                if (config.startdate) params.append('start_date', config.startdate);
                if (config.enddate) params.append('end_date', config.enddate);

                const response = await fetch(`${BACKEND_URL}/data/hotspot-stats/?${params.toString()}`, {
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white p-6 rounded-lg shadow">
                <div className="text-center">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Kejadian</h3>
                    <div className="text-3xl font-bold text-blue-600">
                        {loading ? (
                            <div className="animate-pulse bg-gray-200 h-8 w-16 mx-auto rounded"></div>
                        ) : (
                            stats.total_events.toLocaleString()
                        )}
                    </div>
                </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
                <div className="text-center">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Area</h3>
                    <div className="text-3xl font-bold text-green-600">
                        {loading ? (
                            <div className="animate-pulse bg-gray-200 h-8 w-16 mx-auto rounded"></div>
                        ) : (
                            stats.total_areas.toLocaleString()
                        )}
                    </div>
                </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
                <div className="text-center">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Jumlah PT Terlibat</h3>
                    <div className="text-3xl font-bold text-purple-600">
                        {loading ? (
                            <div className="animate-pulse bg-gray-200 h-8 w-16 mx-auto rounded"></div>
                        ) : (
                            stats.total_companies.toLocaleString()
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
