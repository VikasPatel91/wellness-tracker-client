// components/Dashboard/MetricsChart.js
import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const MetricsChart = ({ metrics }) => {
  // Ensure metrics is always an array
  const safeMetrics = Array.isArray(metrics) ? metrics : [];
  
  // Show message if no data
  if (safeMetrics.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Metrics Chart</h2>
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">No data available for the selected date range</p>
        </div>
      </div>
    );
  }

  // Prepare data for the chart
  const chartData = {
    labels: safeMetrics.map(metric => new Date(metric.date).toLocaleDateString()),
    datasets: [
      {
        label: 'Steps',
        data: safeMetrics.map(metric => metric.steps || 0),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        yAxisID: 'y',
      },
      {
        label: 'Sleep (hours)',
        data: safeMetrics.map(metric => metric.sleep || 0),
        borderColor: 'rgb(139, 92, 246)',
        backgroundColor: 'rgba(139, 92, 246, 0.5)',
        yAxisID: 'y1',
      }
    ]
  };

  const options = {
    responsive: true,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: 'Steps'
        }
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        title: {
          display: true,
          text: 'Sleep Hours'
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
    plugins: {
      title: {
        display: true,
        text: 'Wellness Metrics Over Time'
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Metrics Chart</h2>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default MetricsChart;