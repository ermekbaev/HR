
import { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  type = 'button',
  onClick,
  disabled = false,
  className = ''
}: ButtonProps) {
  const baseClasses = 'font-medium rounded-lg transition-colors duration-200 whitespace-nowrap cursor-pointer flex items-center justify-center';
  
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-300',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700 disabled:bg-gray-300',
    outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50 disabled:border-gray-300 disabled:text-gray-300',
    ghost: 'text-blue-600 hover:bg-blue-50 disabled:text-gray-300'
  };
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };
  
  return (
    <button
      type={type}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
