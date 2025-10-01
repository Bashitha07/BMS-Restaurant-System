import React, { forwardRef } from 'react';
type InputProps = {
  label?: string;
  error?: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;
export const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  type = 'text',
  placeholder,
  required,
  disabled,
  className,
  ...props
}, ref) => {
  return <div className="mb-4">
        {label && <label className="block text-sm font-medium text-gray-700 mb-1">
            {label} {required && <span className="text-red-500">*</span>}
          </label>}
        <input ref={ref} type={type} placeholder={placeholder} disabled={disabled} className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 ${error ? 'border-red-500' : ''} ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''} ${className}`} required={required} {...props} />
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>;
});
Input.displayName = 'Input';