import React from 'react';
import { AlertCircle, RefreshCw, X } from 'lucide-react';

export default function ErrorMessage({ 
  message, 
  onRetry, 
  onDismiss,
  type = 'error',
  className = ''
}) {
  const typeStyles = {
    error: 'bg-red-50 text-red-800 border-red-200',
    warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
    info: 'bg-blue-50 text-blue-800 border-blue-200'
  };

  const iconColor = {
    error: 'text-red-400',
    warning: 'text-yellow-400',
    info: 'text-blue-400'
  };

  return (
    <div className={`rounded-md border p-4 ${typeStyles[type]} ${className}`}>
      <div className="flex">
        <div className="flex-shrink-0">
          <AlertCircle className={`h-5 w-5 ${iconColor[type]}`} />
        </div>
        <div className="ml-3 flex-1">
          <p className="text-sm font-medium">{message}</p>
          {onRetry && (
            <div className="mt-4">
              <button
                onClick={onRetry}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Try Again
              </button>
            </div>
          )}
        </div>
        {onDismiss && (
          <div className="ml-auto pl-3">
            <button
              onClick={onDismiss}
              className={`inline-flex rounded-md p-1.5 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ${iconColor[type]}`}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export function InlineError({ message, className = '' }) {
  return (
    <div className={`flex items-center space-x-2 text-red-600 text-sm ${className}`}>
      <AlertCircle className="h-4 w-4" />
      <span>{message}</span>
    </div>
  );
}
