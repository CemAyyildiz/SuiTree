import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AdminLayout } from '../components/layout/AdminLayout';
import { Dashboard } from './admin/Dashboard';
import { PublicProfile } from './PublicProfile';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { 
  LayoutDashboard, 
  User, 
  Code,
  Palette,
  Smartphone
} from 'lucide-react';

// Mock data for the demo
const mockProfile = {
  id: { id: 'demo-1' },
  owner: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
  title: 'Alex Chen',
  bio: 'Full-stack developer passionate about Web3 and blockchain technology. Building the future of decentralized applications.',
  avatar_cid: undefined,
  verified: true,
  links: [
    {
      label: 'Portfolio Website',
      url: 'https://alexchen.dev',
      is_premium: false,
      price: '0',
    },
    {
      label: 'GitHub Profile',
      url: 'https://github.com/alexchen',
      is_premium: false,
      price: '0',
    },
    {
      label: 'Twitter',
      url: 'https://twitter.com/alexchen',
      is_premium: false,
      price: '0',
    },
    {
      label: 'LinkedIn',
      url: 'https://linkedin.com/in/alexchen',
      is_premium: false,
      price: '0',
    },
    {
      label: 'Contact Me',
      url: 'mailto:alex@example.com',
      is_premium: true,
      price: '1000000000', // 1 SUI in MIST
    },
  ],
  view_count: '2847',
  earnings: '0',
  theme: {
    background_color: '#667eea',
    text_color: '#ffffff',
    button_color: '#4B9EFF',
    font_style: 'Inter, sans-serif',
  },
};

type ViewMode = 'admin' | 'public' | 'overview';

export const DemoPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('overview');
  const [currentPath, setCurrentPath] = useState('/admin');

  const handleNavigate = (path: string) => {
    setCurrentPath(path);
  };

  const handleSearch = (query: string) => {
    console.log('Search query:', query);
  };

  const features = [
    {
      icon: <LayoutDashboard className="h-6 w-6" />,
      title: 'Admin Dashboard',
      description: 'Comprehensive dashboard for managing profiles, links, and analytics.',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20',
    },
    {
      icon: <User className="h-6 w-6" />,
      title: 'Public Profiles',
      description: 'Beautiful, responsive link-in-bio pages for your users.',
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/20',
    },
    {
      icon: <Palette className="h-6 w-6" />,
      title: 'Custom Themes',
      description: 'Dark/light mode support with customizable color schemes.',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20',
    },
    {
      icon: <Smartphone className="h-6 w-6" />,
      title: 'Mobile First',
      description: 'Fully responsive design that works perfectly on all devices.',
      color: 'text-orange-600',
      bgColor: 'bg-orange-100 dark:bg-orange-900/20',
    },
  ];

  if (viewMode === 'admin') {
    return (
      <AdminLayout
        currentPath={currentPath}
        onNavigate={handleNavigate}
        onSearch={handleSearch}
        walletAddress="0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6"
        userAvatar="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
        userName="Demo Admin"
      >
        <Dashboard />
      </AdminLayout>
    );
  }

  if (viewMode === 'public') {
    return <PublicProfile profile={mockProfile} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9FAFB] to-white dark:from-[#0D0D0F] dark:to-[#18181B]">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-[#4B9EFF] to-[#3B82F6] rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">🌳</span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-[#E4E4E7]">
              SuiTree
            </h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-[#A1A1AA] max-w-2xl mx-auto">
            A modern, responsive UI theme for Web3 link-in-bio applications. 
            Built with React, Tailwind CSS, and Framer Motion.
          </p>
          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg max-w-md mx-auto">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              <strong>Subdomain Access:</strong> username.suitree.trwall.app
            </p>
          </div>
        </motion.div>

        {/* Demo Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center space-x-4 mb-16"
        >
          <Button
            variant="primary"
            size="lg"
            leftIcon={<LayoutDashboard className="h-5 w-5" />}
            onClick={() => setViewMode('admin')}
          >
            View Admin Dashboard
          </Button>
          <Button
            variant="outline"
            size="lg"
            leftIcon={<User className="h-5 w-5" />}
            onClick={() => setViewMode('public')}
          >
            View Public Profile
          </Button>
          <Button
            variant="secondary"
            size="lg"
            leftIcon={<Code className="h-5 w-5" />}
            onClick={() => window.location.href = '/#/subdomain-test'}
          >
            Test Subdomains
          </Button>
        </motion.div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              <Card hover className="h-full">
                <CardContent className="p-6 text-center">
                  <div className={`w-12 h-12 ${feature.bgColor} rounded-lg flex items-center justify-center mx-auto mb-4`}>
                    <span className={feature.color}>
                      {feature.icon}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-[#E4E4E7] mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-[#A1A1AA]">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Tech Stack */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Code className="h-5 w-5" />
                <span>Tech Stack</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {[
                  'React 18',
                  'TypeScript',
                  'Tailwind CSS',
                  'Framer Motion',
                  'Lucide React',
                  'Vite',
                  'shadcn/ui',
                ].map((tech) => (
                  <Badge key={tech} variant="secondary">
                    {tech}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};