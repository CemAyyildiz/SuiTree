import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import { User } from 'lucide-react';

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fallback?: string;
  status?: 'online' | 'offline' | 'away';
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, alt, size = 'md', fallback, status, ...props }, ref) => {
    const sizes = {
      sm: 'h-8 w-8',
      md: 'h-10 w-10',
      lg: 'h-12 w-12',
      xl: 'h-16 w-16',
    };

    const statusColors = {
      online: 'bg-green-500',
      offline: 'bg-gray-400',
      away: 'bg-yellow-500',
    };

    const getInitials = (name: string) => {
      return name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    };

    return (
      <div className="relative inline-block" ref={ref} {...props}>
        <motion.div
          className={cn(
            'relative flex items-center justify-center rounded-full bg-gray-100 dark:bg-[#27272A] overflow-hidden',
            sizes[size],
            className
          )}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        >
          {src ? (
            <img
              src={src}
              alt={alt}
              className="h-full w-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const fallbackElement = target.nextElementSibling as HTMLElement;
                if (fallbackElement) {
                  fallbackElement.style.display = 'flex';
                }
              }}
            />
          ) : null}
          
          <div
            className={cn(
              'h-full w-full flex items-center justify-center text-gray-600 dark:text-[#A1A1AA] font-medium',
              src ? 'hidden' : 'flex'
            )}
          >
            {fallback ? (
              getInitials(fallback)
            ) : (
              <User className={cn(
                size === 'sm' ? 'h-4 w-4' :
                size === 'md' ? 'h-5 w-5' :
                size === 'lg' ? 'h-6 w-6' : 'h-8 w-8'
              )} />
            )}
          </div>
        </motion.div>
        
        {status && (
          <div
            className={cn(
              'absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white dark:border-[#18181B]',
              statusColors[status]
            )}
          />
        )}
      </div>
    );
  }
);

Avatar.displayName = 'Avatar';

export { Avatar };
