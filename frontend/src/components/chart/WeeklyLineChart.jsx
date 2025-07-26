import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import api from "../../api/axios";

const WeeklyLineChart = () => {
  const [data, setData] = useState({ categories: [], series: [] });

  useEffect(() => {
    const fetchWeeklyRevenue = async () => {
      try {
        const res = await api.get('/admin/weekly-revenue', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        console.log("Weekly revenue API response:", res.data);

        const revenueData = Array.isArray(res.data) ? res.data : res.data?.data || [];

        const weeks = revenueData.map(item => `Week ${item._id}`);
        const revenues = revenueData.map(item => item.totalRevenue);

        setData({
          categories: weeks,
          series: [{ name: 'Weekly Revenue', data: revenues }],
        });
      } catch (err) {
        console.error('Error fetching weekly revenue:', err);
      }
    };

    fetchWeeklyRevenue();
  }, []);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Weekly Revenue</h2>
        <span className="text-sm text-gray-500">Last 6 weeks</span>
      </div>
      <Chart
        options={{
          xaxis: { categories: data.categories },
          stroke: { curve: 'smooth', width: 3 },
          colors: ['#3b82f6'],
          dataLabels: { enabled: false },
          tooltip: {
            y: {
              formatter: (val) => `₱${val.toLocaleString()}`,
            },
          },
          grid: {
            borderColor: '#e5e7eb',
            row: { colors: ['#f9fafb', 'transparent'], opacity: 0.5 },
          },
        }}
        series={data.series}
        type="line"
        height={350}
      />
    </div>
  );
};

export default WeeklyLineChart;
