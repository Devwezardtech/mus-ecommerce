import React, { useEffect, useState } from 'react';
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
      
      const salesArray = Array.isArray(res.data) ? res.data : res.data?.data || [];
      const sortedData = salesArray.sort((a, b) => a._id - b._id);

      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const labels = sortedData.map(item => monthNames[item._id - 1]);
      const values = sortedData.map(item => item.totalRevenue);

      setChartData({
        categories: labels,
        series: [{ name: 'Revenue', data: values }]
      });

    } catch (error) {
      console.error('Error fetching sales stats:', error);
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
            y: {
              formatter: (val) => `₱${val.toLocaleString()}`,
            },
          },
          grid: {
            borderColor: '#e5e7eb',
            row: {
              colors: ['#f9fafb', 'transparent'],
              opacity: 0.5,
            },
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
