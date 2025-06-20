//src/components/hotspot/CompanyTable.tsx
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useConfig } from "@/components/context/HotspotConfigProvider";
import { BACKEND_URL } from "@/components/conts";

interface Company {
    name: string;
    total_events: number;
    aman: number;
    perhatian: number;
    waspada: number;
    bahaya: number;
}

export default function CompanyTable() {
    const [companies, setCompanies] = useState<Company[]>([]);
    const [loading, setLoading] = useState(true);
    const { data: session } = useSession();
    const { config } = useConfig();

    useEffect(() => {
        const fetchCompanyData = async () => {
            if (!session?.user?.token) return;

            try {
                setLoading(true);
                const params = new URLSearchParams();
                if (config.startdate) params.append('start_date', config.startdate);
                if (config.enddate) params.append('end_date', config.enddate);

                const response = await fetch(`${BACKEND_URL}/data/company-table/?${params.toString()}`, {
                    headers: {
                        'Authorization': `Token ${session.user.token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setCompanies(data);
                }
            } catch (error) {
                console.error('Error fetching company data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCompanyData();
    }, [session, config.startdate, config.enddate]);

    if (loading) {
        return <div className="p-4">Loading company data...</div>;
    }

    return (
        <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Top Companies by Events</h3>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Company
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Total Events
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-green-600 uppercase tracking-wider">
                                Aman
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-yellow-600 uppercase tracking-wider">
                                Perhatian
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-orange-600 uppercase tracking-wider">
                                Waspada
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-red-600 uppercase tracking-wider">
                                Bahaya
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {companies.map((company, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {company.name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                                    {company.total_events}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                                    {company.aman}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-600 font-medium">
                                    {company.perhatian}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-orange-600 font-medium">
                                    {company.waspada}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-medium">
                                    {company.bahaya}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
