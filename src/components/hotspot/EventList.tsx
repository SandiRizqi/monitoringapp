//src/components/hotspot/EventList.tsx
"use client";

import React, { useEffect, useState } from "react";
import { ZoomIn, ChevronLeft, ChevronRight, Filter, ChevronDown } from "lucide-react";
import { useSession } from "next-auth/react";
import { useConfig } from "@/components/context/HotspotConfigProvider";
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

interface PaginationInfo {
    current_page: number;
    page_size: number;
    total_count: number;
    total_pages: number;
    has_next: boolean;
    has_previous: boolean;
}

interface EventListResponse {
    data: Alert[];
    pagination: PaginationInfo;
}

export default function EventList() {
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [filteredAlerts, setFilteredAlerts] = useState<Alert[]>([]);
    const [pagination, setPagination] = useState<PaginationInfo>({
        current_page: 1,
        page_size: 10,
        total_count: 0,
        total_pages: 0,
        has_next: false,
        has_previous: false
    });
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [companies, setCompanies] = useState<{ name: string, count: number }[]>([]);
    const { data: session } = useSession();
    const { config } = useConfig();

    const fetchEventData = async (page: number = 1) => {
        if (!session?.user?.token) return;

        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (config.startdate) params.append('start_date', config.startdate);
            if (config.enddate) params.append('end_date', config.enddate);
            params.append('page', page.toString());
            params.append('page_size', '10');

            const response = await fetch(`${BACKEND_URL}/data/event-list/?${params.toString()}`, {
                headers: {
                    'Authorization': `Token ${session.user.token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data: EventListResponse = await response.json();
                setAlerts(data.data);
                setPagination(data.pagination);

                // Extract unique companies and their counts
                const companyMap = new Map<string, number>();
                data.data.forEach(alert => {
                    const count = companyMap.get(alert.company) || 0;
                    companyMap.set(alert.company, count + 1);
                });

                const companiesList = Array.from(companyMap.entries()).map(([name, count]) => ({
                    name,
                    count
                })).sort((a, b) => a.name.localeCompare(b.name));

                setCompanies(companiesList);
            }
        } catch (error) {
            console.error('Error fetching event data:', error);
        } finally {
            setLoading(false);
        }
    };

    // Filter alerts based on selected companies
    useEffect(() => {
        if (selectedCompanies.length === 0) {
            setFilteredAlerts(alerts);
        } else {
            const filtered = alerts.filter(alert =>
                selectedCompanies.includes(alert.company)
            );
            setFilteredAlerts(filtered);
        }
    }, [alerts, selectedCompanies]);

    useEffect(() => {
        setCurrentPage(1);
        fetchEventData(1);
    }, [session, config.startdate, config.enddate]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        fetchEventData(page);
    };

    const handleCompanyFilter = (companyName: string) => {
        setSelectedCompanies(prev => {
            if (prev.includes(companyName)) {
                return prev.filter(name => name !== companyName);
            } else {
                return [...prev, companyName];
            }
        });
    };

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
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Recent Hotspot Events</h3>

                {/* Filter Dropdown */}
                <div className="relative">
                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="w-full md:w-auto flex items-center justify-center py-2 px-4 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200"
                        type="button"
                    >
                        <Filter className="h-4 w-4 mr-2 text-gray-400" />
                        Filter Company
                        <ChevronDown className="-mr-1 ml-1.5 w-5 h-5" />
                    </button>

                    {isDropdownOpen && (
                        <div className="absolute right-0 z-10 w-64 p-3 bg-white rounded-lg shadow-lg border border-gray-200 mt-1">
                            <h6 className="mb-3 text-sm font-medium text-gray-900">Choose Company</h6>
                            <div className="max-h-48 overflow-y-auto">
                                <ul className="space-y-2 text-sm">
                                    {companies.map((company) => (
                                        <li key={company.name} className="flex items-center">
                                            <input
                                                id={`company-${company.name}`}
                                                type="checkbox"
                                                checked={selectedCompanies.includes(company.name)}
                                                onChange={() => handleCompanyFilter(company.name)}
                                                className="w-4 h-4 bg-gray-100 border-gray-300 rounded text-blue-600 focus:ring-blue-500 focus:ring-2"
                                            />
                                            <label
                                                htmlFor={`company-${company.name}`}
                                                className="ml-2 text-sm font-medium text-gray-900 cursor-pointer"
                                            >
                                                {company.name} ({company.count})
                                            </label>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            {selectedCompanies.length > 0 && (
                                <div className="mt-3 pt-3 border-t border-gray-200">
                                    <button
                                        onClick={() => setSelectedCompanies([])}
                                        className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                                    >
                                        Clear All Filters
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <div className="mb-4 text-sm text-gray-600">
                Showing {filteredAlerts.length} of {pagination.total_count} events
                {selectedCompanies.length > 0 && (
                    <span className="ml-2">
                        (filtered by: {selectedCompanies.join(', ')})
                    </span>
                )}
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                COMPANY
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                DATE
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                AREA
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                CONFIDENCE
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                ACTION
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredAlerts.map((alert, index) => (
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
                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(alert.category)}`}>
                                        {alert.category}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button
                                        onClick={() => handleZoom(alert.company, alert.aoi_id)}
                                        className="p-1 hover:bg-gray-200 rounded"
                                        title="Zoom to location"
                                    >
                                        <ZoomIn className="h-4 w-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {pagination.total_pages > 1 && (
                <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-4">
                    <div className="flex flex-1 justify-between sm:hidden">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={!pagination.has_previous}
                            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Previous
                        </button>
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={!pagination.has_next}
                            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next
                        </button>
                    </div>
                    <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm text-gray-700">
                                Showing page <span className="font-medium">{pagination.current_page}</span> of{' '}
                                <span className="font-medium">{pagination.total_pages}</span>
                            </p>
                        </div>
                        <div>
                            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={!pagination.has_previous}
                                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <ChevronLeft className="h-5 w-5" />
                                </button>

                                {/* Page numbers */}
                                {Array.from({ length: Math.min(5, pagination.total_pages) }, (_, i) => {
                                    let pageNum;
                                    if (pagination.total_pages <= 5) {
                                        pageNum = i + 1;
                                    } else if (currentPage <= 3) {
                                        pageNum = i + 1;
                                    } else if (currentPage >= pagination.total_pages - 2) {
                                        pageNum = pagination.total_pages - 4 + i;
                                    } else {
                                        pageNum = currentPage - 2 + i;
                                    }

                                    return (
                                        <button
                                            key={pageNum}
                                            onClick={() => handlePageChange(pageNum)}
                                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${pageNum === currentPage
                                                ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                }`}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                })}

                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={!pagination.has_next}
                                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <ChevronRight className="h-5 w-5" />
                                </button>
                            </nav>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
