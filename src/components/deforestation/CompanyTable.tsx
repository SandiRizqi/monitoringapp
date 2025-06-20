"use client";

import React, { useState, useEffect } from "react";
import { useSession } from 'next-auth/react';
import { BACKEND_URL } from '@/components/conts';
import { useConfig } from "@/components/context/DeforestationConfigProvider";

interface Company {
  name: string;
  total_events: number;
  total_area: number;
  avg_confidence: number;
}

export default function CompanyTable() {
  const { data: session } = useSession();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const { config } = useConfig();

  useEffect(() => {
    const fetchCompanyData = async () => {
      if (!session?.user?.token) return;

      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (config.startdate) params.append('start_date', config.startdate);
        if (config.enddate) params.append('end_date', config.enddate);

        const response = await fetch(`${BACKEND_URL}/data/deforestation-company-table/?${params.toString()}`, {
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
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Company
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Events
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Area (ha)
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Avg Confidence
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {companies.map((company, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                  {company.name}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                  {company.total_events}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                  {company.total_area.toFixed(2)}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                  {company.avg_confidence}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
