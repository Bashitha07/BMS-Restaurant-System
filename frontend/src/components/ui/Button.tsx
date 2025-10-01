import React from 'react';
type ButtonProps = {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  isLoading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
};
export function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  disabled = false,
  onClick,
  type = 'button',
  className = ''
}: ButtonProps) {
  const baseStyles = 'rounded font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  const variantStyles = {
    primary: 'bg-orange-600 text-white hover:bg-orange-700 focus:ring-orange-500',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
    outline: 'bg-transparent text-gray-900 border border-gray-300 hover:bg-gray-100 focus:ring-gray-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
  };
  const sizeStyles = {
    sm: 'py-1 px-3 text-sm',
    md: 'py-2 px-4',
    lg: 'py-3 px-6 text-lg'
  };
  const widthStyles = fullWidth ? 'w-full' : '';
  return <button type={type} className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyles} ${disabled || isLoading ? 'opacity-70 cursor-not-allowed' : ''} ${className}`} onClick={onClick} disabled={disabled || isLoading}>
      {isLoading ? <div className="flex items-center justify-center">
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {children}
        </div> : children}
    </button>;
}