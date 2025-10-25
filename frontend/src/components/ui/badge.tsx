import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'success' | 'warning' | 'error' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = 'default', size = 'md', children, ...props }, ref) => {
    const baseClasses = 'inline-flex items-center rounded-full font-medium transition-all duration-200';
    
    const variants = {
      default: 'bg-[#4B9EFF] text-white',
      secondary: 'bg-gray-100 dark:bg-[#27272A] text-gray-900 dark:text-[#E4E4E7]',
      success: 'bg-[#10B981] text-white',
      warning: 'bg-[#F59E0B] text-white',
      error: 'bg-[#EF4444] text-white',
      outline: 'border border-[#4B9EFF] text-[#4B9EFF] dark:border-[#4B9EFF] dark:text-[#4B9EFF]',
    };
    
    const sizes = {
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-2.5 py-1 text-sm',
      lg: 'px-3 py-1.5 text-base',
    };

    return (
      <motion.div
        ref={ref}
        className={cn(baseClasses, variants[variant], sizes[size], className)}
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.1 }}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

Badge.displayName = 'Badge';

export { Badge };