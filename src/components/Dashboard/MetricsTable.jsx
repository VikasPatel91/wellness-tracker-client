// components/Dashboard/MetricsTable.js
import React from 'react';
import { Link } from 'react-router-dom';

const MetricsTable = ({ metrics, onDelete }) => {
  const moodEmojis = {
    Happy: '😊',
    Neutral: '😐',
    Tired: '😴',
    Stressed: '😫'
  };

  if (metrics.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Entries</h2>
        <p className="text-gray-500">No entries found for the selected date range.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Entries</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Steps
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sleep
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mood
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {metrics.map((metric) => (
              <tr key={metric._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(metric.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {metric.steps}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {metric.sleep} hrs
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <span className="inline-flex items-center">
                    {moodEmojis[metric.mood]} {metric.mood}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <Link
                    to={`/api/metrics/${metric._id}`}
                    className="text-indigo-600 hover:text-indigo-900 mr-3"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => onDelete(metric._id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MetricsTable;