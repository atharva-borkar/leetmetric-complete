import React, { useEffect, useState } from 'react';
import { calculatePercentage, getDifficultyColor } from '../../utils/helpers';

export default function ProgressCircle({ 
  solved, 
  total, 
  difficulty, 
  size = 120,
  strokeWidth = 8,
  animated = true
}) {
  const [animatedPercentage, setAnimatedPercentage] = useState(0);
  const percentage = calculatePercentage(solved, total);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  
  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => setAnimatedPercentage(percentage), 100);
      return () => clearTimeout(timer);
    } else {
      setAnimatedPercentage(percentage);
    }
  }, [percentage, animated]);

  const strokeDashoffset = circumference - (animatedPercentage / 100) * circumference;
  const color = getDifficultyColor(difficulty);

  return (
    <div className="relative flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          className="transform -rotate-90"
        >
          {/* Background Circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#e5e7eb"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Progress Circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        
        {/* Center Content */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-xl font-bold text-gray-900">{solved}</div>
            <div className="text-sm text-gray-500">/{total}</div>
          </div>
        </div>
      </div>
      
      {/* Labels */}
      <div className="mt-3 text-center">
        <div className="font-semibold text-gray-900 capitalize">{difficulty}</div>
        <div className="text-sm text-gray-600">{percentage}%</div>
      </div>
    </div>
  );
}

export function MiniProgressCircle({ solved, total, difficulty, size = 60 }) {
  const percentage = calculatePercentage(solved, total);
  const color = getDifficultyColor(difficulty);
  
  return (
    <div className="flex items-center space-x-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={(size - 4) / 2}
            stroke="#e5e7eb"
            strokeWidth="4"
            fill="transparent"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={(size - 4) / 2}
            stroke={color}
            strokeWidth="4"
            fill="transparent"
            strokeDasharray={2 * Math.PI * (size - 4) / 2}
            strokeDashoffset={2 * Math.PI * (size - 4) / 2 * (1 - percentage / 100)}
            strokeLinecap="round"
            className="transition-all duration-500"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center text-xs font-bold">
          {percentage}%
        </div>
      </div>
      <div>
        <div className="font-medium capitalize">{difficulty}</div>
        <div className="text-sm text-gray-600">{solved}/{total}</div>
      </div>
    </div>
  );
}
