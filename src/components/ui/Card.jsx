import React from 'react';

export default function Card({
  children,
  className = '',
  padding = 'md',
  shadow = 'md',
  hover = false,
  ...props
}) {
  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const shadows = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
  };

  return (
    <div
      className={`bg-white rounded-lg border ${paddings[padding]} ${shadows[shadow]} ${
        hover ? 'hover:shadow-lg transition-shadow duration-200' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function StatCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  gradient = 'from-indigo-500 to-purple-600',
  className = '' 
}) {
  return (
    <Card className={`bg-gradient-to-r ${gradient} text-white ${className}`} hover>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium opacity-90 uppercase tracking-wide">{title}</p>
          <p className="text-3xl font-bold mt-1">{value}</p>
          {subtitle && (
            <p className="text-sm opacity-75 mt-1">{subtitle}</p>
          )}
        </div>
        {Icon && (
          <div className="opacity-75">
            <Icon size={32} />
          </div>
        )}
      </div>
    </Card>
  );
}

export function UserCard({ user, onClick, className = '' }) {
  return (
    <Card 
      hover 
      className={`cursor-pointer ${className}`} 
      onClick={() => onClick && onClick(user)}
    >
      <div className="flex items-center space-x-4">
        <img
          src={user.avatar || '/api/placeholder/50/50'}
          alt={user.username}
          className="w-12 h-12 rounded-full border-2 border-indigo-200"
        />
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{user.username}</h3>
          <p className="text-sm text-gray-600">
            {user.totalSolved} problems solved
          </p>
          {user.ranking && (
            <p className="text-xs text-gray-500">
              Rank #{user.ranking.toLocaleString()}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}
