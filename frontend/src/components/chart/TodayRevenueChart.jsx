import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import api from "../../api/axios";

const TodayRevenueChart = () => {
  const [todayRevenue, setTodayRevenue] = useState(0);
  const [chartData, setChartData] = useState({
    series: [{ name: 'Revenue', data: [] }],
    categories: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulated hourly revenue for today
        const res = await api.get('/admin/today-revenue-breakdown', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        // Expected format:
        // res.data = { todayRevenue: 32500, breakdown: [2000, 3000, ..., 5000] }

        const total = res.data?.todayRevenue || 0;
        const breakdown = res.data?.breakdown || [];

        setTodayRevenue(total);

        setChartData({
          series: [{ name: 'Revenue', data: breakdown }],
          categories: breakdown.map((_, i) => `${i + 1}h`), // e.g. "1h", "2h", etc.
        });
      } catch (err) {
        console.error('Failed to fetch today revenue breakdown:', err);

        // Fallback demo data if API fails
        setTodayRevenue(32500);
        setChartData({
          series: [{ name: 'Revenue', data: [2000, 3500, 2800, 4500, 3000, 4700, 5000] }],
          categories: ['9am', '10am', '11am', '12pm', '1pm', '2pm', '3pm'],
        });
      }
    };

    fetchData();
  }, []);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Today’s Revenue</h2>
        <span className="text-sm text-gray-500">Live hourly data</span>
      </div>

      <p className="text-xl font-bold text-gray-600 mb-2">
        ₱{todayRevenue.toLocaleString()}
      </p>

      <Chart
        options={{
          chart: { id: 'todayRevenue', toolbar: { show: false } },
          xaxis: { categories: chartData.categories },
          stroke: { curve: 'smooth' },
          colors: ['#10b981'], // Tailwind green-500
          dataLabels: { enabled: false },
          tooltip: {
            y: { formatter: (val) => `₱${val.toLocaleString()}` },
          },
          grid: {
            borderColor: '#e5e7eb',
            row: { colors: ['#f9fafb', 'transparent'], opacity: 0.5 },
          },
        }}
        series={chartData.series}
        type="line"
        height={250}
      />
    </div>
  );
};

export default TodayRevenueChart;
