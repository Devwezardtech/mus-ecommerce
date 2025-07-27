{/*import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import api from "../../api/axios";
import { ArrowDown, ArrowUp } from 'lucide-react';

const CategoryPieChart = () => {
  const [data, setData] = useState({ labels: [], values: [] });
  const [previousData, setPreviousData] = useState({});

  useEffect(() => {
    const fetchCategoryStats = async () => {
      try {
        const res = await api.get('/admin/category-stats', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        console.log("Category stats res:", res.data);

        // Fix: Support both array and wrapped object formats
        const categories = Array.isArray(res.data)
          ? res.data
          : res.data?.data || [];

        const labels = categories.map(item => item._id || 'Unknown');
        const values = categories.map(item => item.total);

        setData({ labels, values });

        // Simulate previous data
        const simulatedPrevious = {};
        categories.forEach(item => {
          simulatedPrevious[item._id] = item.total - Math.floor(Math.random() * 20);
        });
        setPreviousData(simulatedPrevious);

      } catch (err) {
        console.error('Failed to fetch category stats:', err);
      }
    };

    fetchCategoryStats();
  }, []);

  const renderTrend = (category, value) => {
    const prev = previousData[category] || 0;
    const diff = value - prev;

    return (
      <span className={`flex items-center space-x-1 ${diff >= 0 ? 'text-green-500' : 'text-red-500'}`}>
        {diff >= 0 ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
        <span className="text-sm">{Math.abs(diff)}</span>
      </span>
    );
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-md">
      <h2 className="font-bold mb-4 text-lg">Orders by Category</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Chart
          options={{
            labels: data.labels,
            legend: { position: 'bottom' },
            colors: ['#3b82f6', '#6366f1', '#10b981', '#f59e0b', '#ef4444', '#6b7280'],
          }}
          series={data.values}
          type="pie"
          height={340}
        />

        <div className="space-y-3">
          {data.labels.map((label, idx) => (
            <div
              key={label}
              className="flex justify-between items-center bg-gray-50 px-4 py-2 rounded-md shadow-sm"
            >
              <span className="font-medium text-gray-800">{label}</span>
              <div className="flex items-center gap-3">
                <span className="font-semibold text-gray-700">{data.values[idx]} sales</span>
                {renderTrend(label, data.values[idx])}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryPieChart;

*/}