import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

interface AdminLayoutProps {
  children: React.ReactNode;
  currentPath: string;
  onNavigate: (path: string) => void;
  onSearch?: (query: string) => void;
  walletAddress?: string;
  userAvatar?: string;
  userName?: string;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  currentPath,
  onNavigate,
  onSearch,
  walletAddress,
  userAvatar,
  userName,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleToggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0D0D0F]">
      <Sidebar
        isCollapsed={isCollapsed}
        onToggle={handleToggleSidebar}
        currentPath={currentPath}
        onNavigate={onNavigate}
      />
      
      <div className={isCollapsed ? 'ml-20' : 'ml-64'}>
        <Topbar
          isCollapsed={isCollapsed}
          onSearch={onSearch}
          walletAddress={walletAddress}
          userAvatar={userAvatar}
          userName={userName}
        />
        
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="min-h-screen"
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
};
