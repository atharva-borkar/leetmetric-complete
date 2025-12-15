import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function SkillChart({ data, title = "Skills Distribution" }) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg border">
        <h3 className="text-lg font-semibold mb-4">{title}</h3>
        <div className="text-gray-500 text-center py-8">No data available</div>
      </div>
    );
  }

  const chartData = data.map(item => ({
    name: item.tagName || item.languageName,
    problems: item.problemsSolved,
    fullName: item.tagName || item.languageName
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{label}</p>
          <p className="text-indigo-600">
            Problems Solved: <span className="font-semibold">{payload[0].value}</span>
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
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis
              dataKey="name"
              angle={-45}
              textAnchor="end"
              height={80}
              interval={0}
              fontSize={12}
              stroke="#64748b"
            />
            <YAxis stroke="#64748b" fontSize={12} />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="problems"
              fill="#6366f1"
              radius={[4, 4, 0, 0]}
              className="hover:opacity-80"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function HorizontalSkillChart({ data, title = "Top Skills" }) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg border">
        <h3 className="text-lg font-semibold mb-4">{title}</h3>
        <div className="text-gray-500 text-center py-8">No data available</div>
      </div>
    );
  }

  const maxValue = Math.max(...data.map(item => item.problemsSolved));

  return (
    <div className="bg-white p-6 rounded-lg border">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="space-y-3">
        {data.slice(0, 8).map((item, index) => {
          const percentage = (item.problemsSolved / maxValue) * 100;
          return (
            <div key={index} className="flex items-center">
              <div className="w-24 text-sm font-medium text-gray-700 truncate">
                {item.tagName || item.languageName}
              </div>
              <div className="flex-1 ml-4">
                <div className="bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
              <div className="w-12 text-sm text-gray-600 text-right">
                {item.problemsSolved}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
