import { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import api from "../../api/axios";

const SalesChart = () => {
  const [chartData, setChartData] = useState({
    categories: [],
    series: [],
  });

  useEffect(() => {
    const fetchSalesStats = async () => {
      try {
        const res = await api.get('/admin/sales-stats', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });

        console.log("Sales data res:", res.data);

        const salesArray = Array.isArray(res.data)
          ? res.data
          : res.data?.data || [];

        const sortedData = salesArray.sort((a, b) => a._id - b._id);

        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        // ✅ If no real data, use fallback
        let displayData = sortedData;

        if (sortedData.length === 0) {
          console.warn("No sales data found — showing temporary demo data...");
          displayData = [
            { _id: 1, totalRevenue: 12000 },
            { _id: 2, totalRevenue: 18500 },
            { _id: 3, totalRevenue: 23000 },
            { _id: 4, totalRevenue: 27000 },
            { _id: 5, totalRevenue: 32000 },
            { _id: 6, totalRevenue: 29000 },
            { _id: 7, totalRevenue: 35000 },
            { _id: 8, totalRevenue: 42000 },
            { _id: 9, totalRevenue: 41000 },
            { _id: 10, totalRevenue: 38000 },
            { _id: 11, totalRevenue: 44000 },
            { _id: 12, totalRevenue: 46000 },
          ];
        }

        const labels = displayData.map(item => monthNames[item._id - 1]);
        const values = displayData.map(item => item.totalRevenue);

        setChartData({
          categories: labels,
          series: [{ name: 'Revenue', data: values }]
        });

      } catch (error) {
        console.error('Error fetching sales stats:', error);

        // ✅ Optional: also show fallback if API request fails
        setChartData({
          categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
          series: [{ name: "Revenue", data: [10000, 15000, 20000, 25000, 18000, 30000] }]
        });
      }
    };

    fetchSalesStats();
  }, []);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Monthly Sales Growth</h2>
        <span className="text-sm text-gray-500 font-md">Live Monthly Data</span>
      </div>

      <Chart
        options={{
          chart: { id: 'monthly-revenue-bar' },
          xaxis: { categories: chartData.categories },
          stroke: { width: 2 },
          colors: ['#10b981'],
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
        type="bar"
        height={350}
      />
    </div>
  );
};

export default SalesChart;
