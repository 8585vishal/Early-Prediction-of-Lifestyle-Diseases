import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'glass' | 'gradient';
  hover?: boolean;
}

export function Card({ children, className = '', variant = 'default', hover = false }: CardProps) {
  const baseStyles = 'rounded-2xl transition-all duration-300';

  const variants = {
    default: 'bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700',
    glass: 'bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl shadow-xl border border-white/20 dark:border-gray-700/30',
    gradient: 'bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 shadow-xl border border-blue-100 dark:border-gray-700',
  };

  const hoverStyles = hover ? 'hover:shadow-2xl hover:scale-[1.02] cursor-pointer' : '';

  return (
    <div className={`${baseStyles} ${variants[variant]} ${hoverStyles} ${className}`}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`p-6 pb-4 ${className}`}>{children}</div>;
}

export function CardContent({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`p-6 pt-2 ${className}`}>{children}</div>;
}

export function CardFooter({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`p-6 pt-4 ${className}`}>{children}</div>;
}