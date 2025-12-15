import React, { forwardRef } from 'react';

const Input = forwardRef(({
  label,
  error,
  helperText,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  size = 'md',
  className = '',
  ...props
}, ref) => {
  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-base',
    lg: 'px-5 py-4 text-lg',
  };

  const inputClasses = `
    block w-full rounded-lg border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2
    ${error 
      ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
      : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
    }
    ${LeftIcon ? 'pl-10' : ''}
    ${RightIcon ? 'pr-10' : ''}
    ${sizes[size]}
    ${props.disabled ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'}
    ${className}
  `;

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      
      <div className="relative">
        {LeftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <LeftIcon className="h-5 w-5 text-gray-400" />
          </div>
        )}
        
        <input
          ref={ref}
          className={inputClasses}
          {...props}
        />
        
        {RightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <RightIcon className="h-5 w-5 text-gray-400" />
          </div>
        )}
      </div>
      
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
      
      {helperText && !error && (
        <p className="mt-2 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;

export function SearchInput({ 
  onSearch, 
  placeholder = "Search...", 
  loading = false,
  ...props 
}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const query = formData.get('search');
    if (onSearch) {
      onSearch(query);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <Input
        name="search"
        placeholder={placeholder}
        leftIcon={loading ? null : Search}
        {...props}
      />
      {loading && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
          <div className="animate-spin rounded-full h-5 w-5 border-2 border-indigo-600 border-t-transparent" />
        </div>
      )}
      <button
        type="submit"
        disabled={loading}
        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 disabled:opacity-50"
      >
        <Search className="h-5 w-5" />
      </button>
    </form>
  );
}
