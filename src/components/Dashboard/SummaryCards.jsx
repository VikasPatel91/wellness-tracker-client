// components/Dashboard/SummaryCards.js
import React from 'react';

const SummaryCards = ({ summary }) => { 
  const cards = [
    {
      title: 'Average Steps',
      value: Math.round(summary.avgSteps || 0),
      icon: '👣',
      color: 'bg-blue-500'
    },
    {
      title: 'Average Sleep',
      value: `${Math.round(summary.avgSleep || 0)} hrs`,
      icon: '😴',
      color: 'bg-purple-500'
    },
    {
      title: 'Most Common Mood',
      value: summary.commonMood || 'N/A',
      icon: '😊',
      color: 'bg-green-500'
    },
    {
      title: 'Total Entries',
      value: summary.totalEntries || 0,
      icon: '📊',
      color: 'bg-yellow-500'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {cards.map((card, index) => (
        <div key={index} className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className={`rounded-full p-3 ${card.color} bg-opacity-10`}>
              <span className="text-2xl">{card.icon}</span>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">{card.title}</h3>
              <p className="text-2xl font-semibold text-gray-900">{card.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SummaryCards;