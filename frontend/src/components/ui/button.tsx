import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant = 'primary', 
    size = 'md', 
    loading = false,
    leftIcon,
    rightIcon,
    children, 
    disabled,
    ...props 
  }, ref) => {
    const baseClasses = 'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
    
    const variants = {
      primary: 'bg-[#4B9EFF] hover:bg-[#3B82F6] text-white focus:ring-[#4B9EFF] shadow-md hover:shadow-lg',
      secondary: 'bg-[#10B981] hover:bg-[#059669] text-white focus:ring-[#10B981] shadow-md hover:shadow-lg',
      outline: 'border-2 border-[#4B9EFF] text-[#4B9EFF] hover:bg-[#4B9EFF] hover:text-white focus:ring-[#4B9EFF] dark:border-[#4B9EFF] dark:text-[#4B9EFF] dark:hover:bg-[#4B9EFF] dark:hover:text-white',
      ghost: 'text-[#4B9EFF] hover:bg-[#4B9EFF]/10 focus:ring-[#4B9EFF] dark:text-[#4B9EFF] dark:hover:bg-[#4B9EFF]/10',
      destructive: 'bg-[#EF4444] hover:bg-[#DC2626] text-white focus:ring-[#EF4444] shadow-md hover:shadow-lg',
    };
    
    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    };

    return (
      <button
        ref={ref}
        className={cn(baseClasses, variants[variant], sizes[size], className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <motion.div
            className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
        )}
        {leftIcon && !loading && <span className="mr-2">{leftIcon}</span>}
        {children}
        {rightIcon && !loading && <span className="ml-2">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };