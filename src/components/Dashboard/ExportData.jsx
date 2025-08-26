// components/Dashboard/ExportData.js
import React, { useState } from 'react';
import { metricsAPI } from '../../services/api';

const ExportData = ({ metrics }) => {
  const [loading, setLoading] = useState('');
  const [error, setError] = useState('');

  const exportToCSV = async () => {
    try {
      setLoading('csv');
      setError('');
      
      // Use the API endpoint if available, otherwise generate client-side
      try {
        const response = await metricsAPI.exportData();
        
        // Create download link
        const blob = new Blob([response.data], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'wellness_data.csv');
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      } catch (apiError) {
        console.log('API export failed, generating CSV client-side');
        generateCSVClientSide();
      }
    } catch (err) {
      console.error('Error exporting to CSV:', err);
      setError('Failed to export data. Please try again.');
    } finally {
      setLoading('');
    }
  };

  const generateCSVClientSide = () => {
    if (!metrics || metrics.length === 0) {
      setError('No data available to export');
      return;
    }

    const headers = ['Date', 'Steps', 'Sleep Hours', 'Mood', 'Notes'];
    const csvData = metrics.map(metric => [
      new Date(metric.date).toLocaleDateString(),
      metric.steps,
      metric.sleep,
      metric.mood,
      metric.notes || ''
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(field => `"${field}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'wellness_data.csv');
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  };

  const exportToPDF = async () => {
    try {
      setLoading('pdf');
      setError('');
      
      if (!metrics || metrics.length === 0) {
        setError('No data available to export');
        return;
      }

      // Dynamic import to avoid SSR issues
      const { jsPDF } = await import('jspdf');
      await import('jspdf-autotable');
      
      const doc = new jsPDF();
      
      // Title
      doc.setFontSize(20);
      doc.setTextColor(40, 40, 40);
      doc.text('Wellness Tracker Report', 14, 22);
      
      // Date
      doc.setFontSize(12);
      doc.setTextColor(100, 100, 100);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
      
      // Summary table
      const tableColumn = ['Date', 'Steps', 'Sleep (hrs)', 'Mood', 'Notes'];
      const tableRows = [];
      
      metrics.forEach(metric => {
        const metricData = [
          new Date(metric.date).toLocaleDateString(),
          metric.steps.toString(),
          metric.sleep.toString(),
          metric.mood,
          metric.notes || 'N/A'
        ];
        tableRows.push(metricData);
      });
      
      // Add table
      doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 40,
        theme: 'grid',
        headStyles: {
          fillColor: [79, 70, 229],
          textColor: 255,
          fontStyle: 'bold'
        },
        styles: {
          fontSize: 10,
          cellPadding: 3,
          overflow: 'linebreak'
        },
        columnStyles: {
          0: { cellWidth: 30 },
          1: { cellWidth: 25 },
          2: { cellWidth: 25 },
          3: { cellWidth: 25 },
          4: { cellWidth: 'auto' }
        }
      });
      
      // Save the PDF
      doc.save('wellness_report.pdf');
      
    } catch (err) {
      console.error('Error exporting to PDF:', err);
      setError('Failed to export PDF. Please try again.');
    } finally {
      setLoading('');
    }
  };

  // Simple PDF fallback without external libraries
  const exportToPDFSimple = () => {
    try {
      setLoading('pdf');
      setError('');
      
      if (!metrics || metrics.length === 0) {
        setError('No data available to export');
        return;
      }

      // Create a simple HTML page for printing
      const printWindow = window.open('', '_blank');
      const moodEmojis = {
        Happy: '😊',
        Neutral: '😐',
        Tired: '😴',
        Stressed: '😫'
      };

      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Wellness Tracker Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            h1 { color: #333; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #4f46e5; color: white; }
            tr:nth-child(even) { background-color: #f2f2f2; }
            .header { display: flex; justify-content: space-between; margin-bottom: 20px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Wellness Tracker Report</h1>
            <p>Generated on: ${new Date().toLocaleDateString()}</p>
          </div>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Steps</th>
                <th>Sleep (hrs)</th>
                <th>Mood</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              ${metrics.map(metric => `
                <tr>
                  <td>${new Date(metric.date).toLocaleDateString()}</td>
                  <td>${metric.steps}</td>
                  <td>${metric.sleep}</td>
                  <td>${moodEmojis[metric.mood] || ''} ${metric.mood}</td>
                  <td>${metric.notes || 'N/A'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
        </html>
      `);

      printWindow.document.close();
      
      // Wait for content to load then print
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 250);
      
    } catch (err) {
      console.error('Error with simple PDF export:', err);
      setError('Failed to generate PDF. Please try again.');
    } finally {
      setLoading('');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mt-8">
      <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Export Data</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
        <button
          onClick={exportToCSV}
          disabled={loading}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md disabled:opacity-50 flex items-center justify-center"
        >
          {loading === 'csv' ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Exporting...
            </>
          ) : (
            'Export to CSV'
          )}
        </button>
        
  

        <button
          onClick={exportToPDFSimple}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md disabled:opacity-50 flex items-center justify-center"
        >
          {loading === 'pdf' ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Exporting...
            </>
          ) : (
            'Export to PDF (Simple)'
          )}
        </button>
      </div>
      
      <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
        Export your wellness data for record keeping or analysis.
      </p>
    </div>
  );
};

export default ExportData;