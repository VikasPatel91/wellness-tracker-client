// components/Dashboard/Dashboard.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { metricsAPI } from '../../services/api';
import SummaryCards from './SummaryCards';
import MetricsChart from './MetricsChart';
import MetricsTable from './MetricsTable';
import DateRangeFilter from './DateRangeFilter';
import AIMoodSummary from './AIMoodSummary'; // Add this
import ExportData from './ExportData'; // Add this

const Dashboard = () => {
  const [metrics, setMetrics] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    endDate: new Date()
  });

  useEffect(() => {
    loadData();
  }, [dateRange]);

  const loadData = async () => {
    try {
      setLoading(true);
      const params = {
        startDate: dateRange.startDate.toISOString(),
        endDate: dateRange.endDate.toISOString()
      };
      
      const [metricsResponse, summaryResponse] = await Promise.all([
        metricsAPI.getAll(params),
        metricsAPI.getSummary()
      ]);
      
      // Handle different API response structures
      const metricsData = Array.isArray(metricsResponse.data) 
        ? metricsResponse.data 
        : (metricsResponse.data.metrics || metricsResponse.data.data || []);
      
      const summaryData = summaryResponse.data.summary || summaryResponse.data;
      
      setMetrics(metricsData);
      setSummary(summaryData);
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Failed to load data. Please try again.');
      setMetrics([]); // Ensure metrics is always an array
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      try {
        await metricsAPI.delete(id);
        setMetrics(metrics.filter(metric => metric._id !== id));
        // Reload summary to reflect changes
        const summaryResponse = await metricsAPI.getSummary();
        const summaryData = summaryResponse.data.summary || summaryResponse.data;
        setSummary(summaryData);
      } catch (err) {
        setError('Failed to delete entry');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Dashboard</h1>
        <Link
          to="/add-metric"
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md"
        >
          Add New Entry
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <DateRangeFilter 
        dateRange={dateRange} 
        setDateRange={setDateRange} 
      />

      {summary && <SummaryCards summary={summary} />}
      
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <MetricsChart metrics={metrics} />
        <MetricsTable 
          metrics={metrics} 
          onDelete={handleDelete} 
        />
      </div>

      {/* Add the new components */}
      <AIMoodSummary />
      <ExportData metrics={metrics} />
    </div>
  );
};

export default Dashboard;