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
        'sticky top-0 z-30 bg-gray-800 dark:bg-[#18181B] border-b border-gray-600 dark:border-[#27272A]',
        isCollapsed ? 'ml-20' : 'ml-64'
      )}
    >
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left side - Branding */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-[#4B9EFF] to-[#3B82F6] rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">🌳</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="font-bold text-xl text-white">SuiTree</span>
            <span className="text-sm font-medium text-gray-300">Admin</span>
          </div>
        </div>

        {/* Search */}
        <div className="flex-1 max-w-md mx-6">
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
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-white">
                {formatAddress(walletAddress)}
              </span>
            </div>
          ) : (
            <Button variant="outline" size="sm" leftIcon={<Wallet className="h-4 w-4" />}>
              Connect Wallet
            </Button>
          )}

          {/* Create Profile Button */}
          <Button
            className="bg-[#4B9EFF] hover:bg-[#3B82F6] text-white px-4 py-2 rounded-lg font-medium"
            leftIcon={<span className="text-lg">+</span>}
            onClick={() => window.location.hash = '#/create'}
          >
            Create Profile
          </Button>

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
