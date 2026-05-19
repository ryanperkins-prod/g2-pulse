import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

function NPSTrendChart({ data }) {
  // Format data for Recharts
  const chartData = data.map(item => ({
    date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    nps: item.nps
  }));

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
      <h3 className="text-lg font-bold text-gray-900 mb-2">NPS Trend</h3>
      <p className="text-sm text-gray-600 mb-4">Last 30 days</p>

      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12 }}
            stroke="#9ca3af"
          />
          <YAxis
            domain={[-100, 100]}
            tick={{ fontSize: 12 }}
            stroke="#9ca3af"
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e5e5',
              borderRadius: '6px',
              fontSize: '12px'
            }}
          />
          <ReferenceLine y={0} stroke="#d1d5db" strokeDasharray="3 3" />
          <Line
            type="monotone"
            dataKey="nps"
            stroke="#FF492C"
            strokeWidth={3}
            dot={{ fill: '#FF492C', r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default NPSTrendChart;
