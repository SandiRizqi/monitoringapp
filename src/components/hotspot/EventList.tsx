"use client";
import React from "react";
import { ZoomIn } from "lucide-react";

// interface Alert {
//     company: string;
//     date: string;
//     time: string;
//     distance: string;
//     satellite: string;
//     category: string;
// }

export default function EventList() {
    const lastAlerts = [
        {
            company: "PT BBB",
            date: "2025-06-10",
            time: "01:56",
            distance: "8487.90",
            satellite: "NASA-SNPP",
            category: "Aman"
        },
        {
            company: "PT EBL",
            date: "2025-06-10",
            time: "00:30",
            distance: "17134.07",
            satellite: "NOAA20",
            category: "Aman"
        },
        {
            company: "PT EBL",
            date: "2025-06-10",
            time: "00:37",
            distance: "17121.56",
            satellite: "NASA-NOAA20",
            category: "Aman"
        },
        {
            company: "PT EBL",
            date: "2025-06-10",
            time: "00:13",
            distance: "17095.86",
            satellite: "NASA-SNPP",
            category: "Aman"
        },
    ];

    const getCategoryColor = (category: string) => {
        switch (category.toLowerCase()) {
            case 'aman': return 'bg-green-100 text-green-800 border border-green-200';
            case 'waspada': return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
            case 'bahaya': return 'bg-red-100 text-red-800 border border-red-200';
            default: return 'bg-gray-100 text-gray-800 border border-gray-200';
        }
    };

    const handleZoom = (company: string) => {
        console.log(`Zooming to ${company} location on map`);
        // Implementasi zoom ke titik maps
    };

    return (
        <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800">List of Events</h2>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                COMP
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                DATE
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                TIME
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                DIST (m)
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                SAT
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                CAT
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                ACTION
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {lastAlerts.map((alert, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {alert.company}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {alert.date}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {alert.time}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {alert.distance}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {alert.satellite}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-md ${getCategoryColor(alert.category)}`}>
                                        {alert.category}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <button
                                        onClick={() => handleZoom(alert.company)}
                                        className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                                    >
                                        <ZoomIn className="w-4 h-4" />
                                        Zoom
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