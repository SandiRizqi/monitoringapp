import React from "react";

interface Alert {
    company: string;
    date: string;
    area: string;
    location?: string;
    severity?: 'high' | 'medium' | 'low';
}

export default function AlertList() {
    const lastAlerts = [
        { company: "PT A", date: "3 Mei 2025", area: "12 ha", location: "Papua" },
        { company: "PT B", date: "2 Mei 2025", area: "6 ha", location: "" },
        { company: "PT C", date: "1 Mei 2025", area: "22 ha", location: "Riau" },
    ];

    const getSeverityColor = (severity?: string) => {
        switch (severity) {
            case 'high': return 'bg-red-100 text-red-800';
            case 'medium': return 'bg-yellow-100 text-yellow-800';
            case 'low': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-semibold mb-4">Last Alerts</h2>
            <div className="space-y-3">
                {lastAlerts.map((alert, index) => (
                    <div key={index} className="border-b pb-2 last:border-b-0">
                        <div className="flex justify-between">
                            <span className="font-medium">{alert.company}</span>
                            <span className="text-gray-500">{alert.date}</span>
                        </div>
                        <div className="flex justify-between mt-1">
                            <span>{alert.area}</span>
                            {alert.location && <span className="text-gray-500">{alert.location}</span>}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}