import React from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Plus, 
  Settings, 
  Users, 
  Menu,
  X
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from '../ui/button';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  currentPath: string;
  onNavigate: (path: string) => void;
}

const navigationItems = [
  {
    name: 'Dashboard',
    path: '/admin',
    icon: LayoutDashboard,
  },
  {
    name: 'Create Profile',
    path: '/admin/create',
    icon: Plus,
  },
  {
    name: 'All Profiles',
    path: '/admin/profiles',
    icon: Users,
  },
  {
    name: 'Settings',
    path: '/admin/settings',
    icon: Settings,
  },
];

export const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  onToggle,
  currentPath,
  onNavigate,
}) => {
  return (
    <motion.div
      initial={false}
      animate={{ width: isCollapsed ? 80 : 256 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="fixed left-0 top-0 h-full bg-white dark:bg-[#18181B] border-r border-gray-200 dark:border-[#27272A] z-40"
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-[#27272A]">
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center space-x-2"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-[#4B9EFF] to-[#3B82F6] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">🌳</span>
              </div>
              <span className="font-bold text-lg text-gray-900 dark:text-[#E4E4E7]">
                SuiTree
              </span>
            </motion.div>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="h-8 w-8 p-0"
          >
            {isCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navigationItems.map((item) => {
            const isActive = currentPath === item.path;
            const Icon = item.icon;
            
            return (
              <motion.div
                key={item.path}
                whileHover={{ x: 4 }}
                transition={{ duration: 0.2 }}
              >
                <button
                  onClick={() => onNavigate(item.path)}
                  className={cn(
                    'w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-all duration-200',
                    isActive
                      ? 'bg-[#4B9EFF] text-white shadow-md'
                      : 'text-gray-700 dark:text-[#A1A1AA] hover:bg-gray-100 dark:hover:bg-[#27272A] hover:text-gray-900 dark:hover:text-[#E4E4E7]'
                  )}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  {!isCollapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="font-medium"
                    >
                      {item.name}
                    </motion.span>
                  )}
                </button>
              </motion.div>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-[#27272A]">
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-xs text-gray-500 dark:text-[#71717A] text-center"
            >
              SuiTree Admin v1.0
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
