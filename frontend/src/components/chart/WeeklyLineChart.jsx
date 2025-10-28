import { useEffect, useState } from 'react';
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

        const revenueData = Array.isArray(res.data)
          ? res.data
          : res.data?.data || [];

        // Check if backend returned empty or missing data
        if (!revenueData || revenueData.length === 0) {
          console.warn("No weekly revenue data found — showing temporary demo data...");

          // Temporary sample data for 6 weeks
          const tempData = [
            { _id: 1, totalRevenue: 15000 },
            { _id: 2, totalRevenue: 18000 },
            { _id: 3, totalRevenue: 22000 },
            { _id: 4, totalRevenue: 26000 },
            { _id: 5, totalRevenue: 31000 },
            { _id: 6, totalRevenue: 28000 },
          ];

          const weeks = tempData.map(item => `Week ${item._id}`);
          const revenues = tempData.map(item => item.totalRevenue);

          setData({
            categories: weeks,
            series: [{ name: 'Weekly Revenue', data: revenues }],
          });
        } else {
          // Use real backend data
          const weeks = revenueData.map(item => `Week ${item._id}`);
          const revenues = revenueData.map(item => item.totalRevenue);

          setData({
            categories: weeks,
            series: [{ name: 'Weekly Revenue', data: revenues }],
          });
        }
      } catch (err) {
        console.error('Error fetching weekly revenue:', err);

        // Optional fallback if API fails entirely
        const fallbackData = [12000, 17000, 19000, 25000, 23000, 27000];
        setData({
          categories: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
          series: [{ name: 'Weekly Revenue', data: fallbackData }],
        });
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
          colors: ['#0fb32dff'],
          dataLabels: { enabled: false },
          tooltip: {
            y: { formatter: (val) => `₱${val.toLocaleString()}` },
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
