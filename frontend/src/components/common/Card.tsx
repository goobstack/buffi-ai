import React, { ReactNode } from 'react'

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;  // Add this line
}


export const Card: React.FC<CardProps> = ({ children, className, onClick }) => {
  return (
    <div className={className} onClick={onClick}>
      {children}
    </div>
  );
};
export function CardContent({ children, className = '' }: CardProps) {
  return (
    <div className={`p-6 ${className}`}>
      {children}
    </div>
  )
}