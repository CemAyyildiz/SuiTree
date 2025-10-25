import React from 'react';
import { motion } from 'framer-motion';
import { 
  Bell, 
  Search, 
  Wallet, 
  Moon,
  Sun,
  Monitor
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Avatar } from '../ui/Avatar';
import { useTheme } from '../../contexts/ThemeContext';

interface TopbarProps {
  isCollapsed: boolean;
  onSearch?: (query: string) => void;
  walletAddress?: string;
  userAvatar?: string;
  userName?: string;
}

export const Topbar: React.FC<TopbarProps> = ({
  isCollapsed,
  onSearch,
  walletAddress,
  userAvatar,
  userName,
}) => {
  const { mode, setMode, isDark } = useTheme();

  const toggleTheme = () => {
    if (mode === 'light') {
      setMode('dark');
    } else if (mode === 'dark') {
      setMode('system');
    } else {
      setMode('light');
    }
  };

  const getThemeIcon = () => {
    if (mode === 'system') return <Monitor className="h-4 w-4" />;
    return isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />;
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'sticky top-0 z-30 bg-white/80 dark:bg-[#18181B]/80 backdrop-blur-md border-b border-gray-200 dark:border-[#27272A]',
        isCollapsed ? 'ml-20' : 'ml-64'
      )}
    >
      <div className="flex items-center justify-between px-6 py-4">
        {/* Search */}
        <div className="flex-1 max-w-md">
          <Input
            placeholder="Search profiles..."
            leftIcon={<Search className="h-4 w-4" />}
            onChange={(e) => onSearch?.(e.target.value)}
            className="w-full"
          />
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className="h-9 w-9 p-0"
            title={`Switch to ${mode === 'light' ? 'dark' : mode === 'dark' ? 'system' : 'light'} mode`}
          >
            {getThemeIcon()}
          </Button>

          {/* Notifications */}
          <Button
            variant="ghost"
            size="sm"
            className="h-9 w-9 p-0 relative"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-xs flex items-center justify-center text-white">
              3
            </span>
          </Button>

          {/* Wallet Status */}
          {walletAddress ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center space-x-2 px-3 py-1.5 bg-green-100 dark:bg-green-900/20 rounded-lg"
            >
              <Wallet className="h-4 w-4 text-green-600 dark:text-green-400" />
              <span className="text-sm font-medium text-green-700 dark:text-green-300">
                {formatAddress(walletAddress)}
              </span>
            </motion.div>
          ) : (
            <Button variant="outline" size="sm" leftIcon={<Wallet className="h-4 w-4" />}>
              Connect Wallet
            </Button>
          )}

          {/* User Menu */}
          <div className="flex items-center space-x-3">
            <Avatar
              src={userAvatar}
              fallback={userName || 'User'}
              size="sm"
              status="online"
            />
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="hidden md:block"
              >
                <div className="text-sm">
                  <div className="font-medium text-gray-900 dark:text-[#E4E4E7]">
                    {userName || 'Admin User'}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-[#71717A]">
                    Administrator
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
