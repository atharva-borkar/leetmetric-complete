import React from 'react';

export default function LoadingSpinner({ 
  size = 'md', 
  className = '', 
  color = 'indigo-600' 
}) {
  const sizeClasses = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <div className={`animate-spin rounded-full border-2 border-${color} border-t-transparent`}>
      </div>
    </div>
  );
}

export function PageLoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <LoadingSpinner size="xl" />
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    </div>
  );
}

export function InlineLoadingSpinner({ text = 'Loading...', size = 'sm' }) {
  return (
    <div className="flex items-center space-x-2">
      <LoadingSpinner size={size} />
      <span className="text-gray-600">{text}</span>
    </div>
  );
}
