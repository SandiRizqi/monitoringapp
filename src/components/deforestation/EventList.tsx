"use client";

import React, { useState, useEffect } from "react";
import { useSession } from 'next-auth/react';
import { BACKEND_URL } from '@/components/conts';
import { ZoomIn, ChevronLeft, ChevronRight } from "lucide-react";
import { useConfig } from "@/components/context/DeforestationConfigProvider";

interface Alert {
  company: string;
  date: string;
  area: string;
  confidence: number;
  event_id: string;
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

      const response = await fetch(`${BACKEND_URL}/data/deforestation-event-list/?${params.toString()}`, {
        headers: {
          'Authorization': `Token ${session.user.token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data: EventListResponse = await response.json();
        setAlerts(data.data);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Error fetching event data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
    fetchEventData(1);
  }, [session, config.startdate, config.enddate]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchEventData(page);
  };

  // const getConfidenceColor = (confidence: number) => {
  //   if (confidence >= 5) return 'bg-red-100 text-red-800 border border-red-200';
  //   if (confidence >= 3) return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
  //   return 'bg-green-100 text-green-800 border border-green-200';
  // };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 5) {
      return 'bg-red-100 text-red-800 border border-red-200';
    } else if (confidence >= 3) {
      return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
    } else {
      return 'bg-green-100 text-green-800 border border-green-200';
    }
  };

  // const getConfidenceLabel = (confidence: number) => {
  //   if (confidence >= 5) return 'High';
  //   if (confidence >= 3) return 'Medium';
  //   return 'Low';
  // };

  const handleZoom = (company: string, aoiId: string) => {
    console.log(`Zooming to ${company} (AOI: ${aoiId}) location on map`);
    // Implementasi zoom ke titik maps
  };

  // const handlePageChange = (newPage: number) => {
  //   setCurrentPage(newPage);
  // };

  if (loading) {
    return <div className="p-4">Loading recent events...</div>;
  }

  // if (loading) {
  //   return (
  //     <div className="bg-white rounded-lg shadow overflow-hidden">
  //       <div className="p-4 border-b">
  //         <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
  //       </div>
  //       <div className="p-4 space-y-3">
  //         {[...Array(5)].map((_, i) => (
  //           <div key={i} className="h-12 bg-gray-200 rounded animate-pulse"></div>
  //         ))}
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Recent Deforestation Events</h3>
        <p className="text-sm text-gray-600">
          Showing {alerts.length} of {pagination.total_count} events
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">COMP</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DATE</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">AREA</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CONFIDENCE</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ACTION</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {alerts.map((alert, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {alert.company}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {alert.date}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {alert.area}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getConfidenceColor(alert.confidence)}`}>
                    {alert.confidence}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
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

      {/* Pagination */}
      {pagination.total_pages > 1 && (
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200">
          <div className="flex-1 flex justify-between sm:hidden">
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
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
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
                  <ChevronLeft size={16} />
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
                  <ChevronRight size={16} />
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
