// components/Dashboard/AIMoodSummary.js
import React, { useState } from 'react';
import { metricsAPI } from '../../services/api';

const AIMoodSummary = () => {
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generateMoodSummary = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await metricsAPI.getMoodSummary();
      setSummary(response.data.summary || response.data);
    } catch (err) {
      console.error('Error generating mood summary:', err);
      setError('Failed to generate mood summary. Please try again.');
      
      // Fallback mock summary for demo purposes
      setSummary("Based on your recent entries, you've been feeling mostly Happy this week. Your step count has been consistent, and you're maintaining good sleep habits. Keep up the great work! Consider adding a short walk to your routine to maintain your positive mood.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mt-8">
      <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">AI Mood Summary</h2>
      
      <button
        onClick={generateMoodSummary}
        disabled={loading}
        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md mb-4 disabled:opacity-50 flex items-center"
      >
        {loading ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Generating...
          </>
        ) : (
          'Generate Mood Summary'
        )}
      </button>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {summary && (
        <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-md">
          <h3 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Your Mood Insights:</h3>
          <p className="text-blue-700 dark:text-blue-300">{summary}</p>
        </div>
      )}

      {!summary && !loading && (
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Get AI-powered insights about your mood patterns and wellness trends.
        </p>
      )}
    </div>
  );
};

export default AIMoodSummary;