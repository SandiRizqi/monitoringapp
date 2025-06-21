"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { BarChart, Bar, PieChart, Pie, Cell, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { BACKEND_URL } from '@/components/conts';
import { useConfig } from '@/components/context/DeforestationConfigProvider';
import { Notification } from '../common/Notification';

interface ChartData {
  monthly_data: Array<{
    name: string;
    value: number;
    amt: number;
  }>;
  pie_data: Array<{
    name: string;
    value: number;
  }>;
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042'];

export default function ChartDeforestation() {
  const [chartData, setChartData] = useState<ChartData>({
    monthly_data: [],
    pie_data: []
  });
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();
  const { config } = useConfig();

  useEffect(() => {
    const fetchChartData = async () => {
      if (!session?.user?.token) return;

      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (config.startdate) params.append('start_date', config.startdate);
        if (config.enddate) params.append('end_date', config.enddate);

        const response = await fetch(`${BACKEND_URL}/data/deforestation-chart/?${params.toString()}`, {
          headers: {
            'Authorization': `Token ${session.user.token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setChartData(data);
        }
      } catch (error) {
        // console.error('Error fetching chart data:', error);
        Notification("Error", `Error fetching chart data: ${ error}`)
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
  }, [session, config.startdate, config.enddate]);

 if (loading) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 animate-pulse">
            <div className="bg-white p-4 rounded-lg shadow h-[350px]">
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="h-[250px] bg-gray-100 rounded"></div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow h-[350px]">
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="h-[250px] bg-gray-100 rounded-full mx-auto w-[250px]"></div>
            </div>
        </div>
    );
}


  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
      <div className="bg-white p-4 rounded-md shadow">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">Monthly Deforestation Trends</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData.monthly_data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white p-4 rounded-md shadow">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">Alert Categories</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData.pie_data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.pie_data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
