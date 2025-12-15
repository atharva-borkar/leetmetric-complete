import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatDate } from '../../utils/helpers';

export default function TrendChart({ 
  data, 
  title = "Progress Trend",
  xKey = "date",
  yKey = "problems",
  color = "#6366f1"
}) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg border">
        <h3 className="text-lg font-semibold mb-4">{title}</h3>
        <div className="text-gray-500 text-center py-8">No trend data available</div>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{formatDate(label)}</p>
          <p style={{ color: color }}>
            Problems: <span className="font-semibold">{payload[0].value}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-6 rounded-lg border">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis
              dataKey={xKey}
              stroke="#64748b"
              fontSize={12}
              tickFormatter={(value) => new Date(value).toLocaleDateString()}
            />
            <YAxis stroke="#64748b" fontSize={12} />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey={yKey}
              stroke={color}
              strokeWidth={3}
              dot={{ fill: color, strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: color, strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function MultiLineTrendChart({ 
  data, 
  lines = [], 
  title = "Comparison Trend" 
}) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg border">
        <h3 className="text-lg font-semibold mb-4">{title}</h3>
        <div className="text-gray-500 text-center py-8">No comparison data available</div>
      </div>
    );
  }

  const colors = ['#6366f1', '#8b5cf6', '#06d6a0', '#ffc01e', '#ff375f'];

  return (
    <div className="bg-white p-6 rounded-lg border">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis
              dataKey="date"
              stroke="#64748b"
              fontSize={12}
              tickFormatter={(value) => new Date(value).toLocaleDateString()}
            />
            <YAxis stroke="#64748b" fontSize={12} />
            <Tooltip />
            {lines.map((line, index) => (
              <Line
                key={line.key}
                type="monotone"
                dataKey={line.key}
                stroke={colors[index % colors.length]}
                strokeWidth={2}
                dot={{ r: 3 }}
                name={line.name}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
