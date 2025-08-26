// components/Dashboard/DateRangeFilter.js
import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const DateRangeFilter = ({ dateRange, setDateRange }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow mb-6">
      <h3 className="text-lg font-medium text-gray-900 mb-3">Filter by Date Range</h3>
      <div className="flex flex-col sm:flex-row gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
          <DatePicker
            selected={dateRange.startDate}
            onChange={(date) => setDateRange({ ...dateRange, startDate: date })}
            selectsStart
            startDate={dateRange.startDate}
            endDate={dateRange.endDate}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
          <DatePicker
            selected={dateRange.endDate}
            onChange={(date) => setDateRange({ ...dateRange, endDate: date })}
            selectsEnd
            startDate={dateRange.startDate}
            endDate={dateRange.endDate}
            minDate={dateRange.startDate}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>
    </div>
  );
};

export default DateRangeFilter;