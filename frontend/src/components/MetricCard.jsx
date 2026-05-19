import React from 'react';

function MetricCard({ label, value, subtext, color = 'text-gray-900' }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
      <div className="text-xs font-semibold text-gray-600 mb-2">{label}</div>
      <div className={`text-3xl font-bold ${color} mb-1`}>{value}</div>
      <div className="text-xs text-gray-500">{subtext}</div>
    </div>
  );
}

export default MetricCard;
