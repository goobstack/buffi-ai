import React, { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'ghost'
  size?: 'default' | 'icon'
}

export function Button({ 
  children, 
  variant = 'default', 
  size = 'default', 
  className = '', 
  ...props 
}: ButtonProps) {
  const baseStyles = 'font-medium rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500'
  const variantStyles = {
    default: 'bg-purple-600 text-white hover:bg-purple-700',
    ghost: 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
  }
  const sizeStyles = {
    default: 'px-4 py-2',
    icon: 'p-2'
  }

  return (
    <button 
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}