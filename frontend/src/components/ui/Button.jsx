import React from 'react';

export function Button({ onClick, variant = 'default', size = 'md', className = '', children, fullWidth = false, isLoading = false, disabled = false, ...props }) {
  const baseStyles = 'rounded font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200 flex items-center justify-center gap-2';
  
  const variants = {
    default: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500',
    outline: 'border border-primary-600 text-primary-600 hover:bg-primary-50 focus:ring-primary-500',
    accent: 'bg-accent-500 text-white hover:bg-accent-600 focus:ring-accent-400',
    error: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const widthClass = fullWidth ? 'w-full' : '';
  const disabledClass = (isLoading || disabled) ? 'opacity-50 cursor-not-allowed' : '';
  const combinedClassName = `${baseStyles} ${sizes[size] || sizes.md} ${variants[variant] || variants.default} ${widthClass} ${disabledClass} ${className}`;

  return (
    <button 
      onClick={(isLoading || disabled) ? undefined : onClick} 
      className={combinedClassName} 
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading && (
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
      )}
      {children}
    </button>
  );
}

// Additional usage examples:
// <Button variant="error">Credentials are wrong</Button>
// <Button size="lg">Large Button</Button>
// <Button variant="outline" size="sm">Small Outline Button</Button>
