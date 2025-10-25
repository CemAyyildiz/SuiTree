import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { ExternalLink, Globe, Users, Zap } from 'lucide-react';

export const SubdomainTest: React.FC = () => {
  const currentHostname = window.location.hostname;
  const isLocalhost = currentHostname === 'localhost' || currentHostname === '127.0.0.1';

  const subdomainExamples = [
    {
      username: 'alice',
      url: 'alice.suitree.trwall.app',
      description: 'Alice\'s profile with portfolio and social links',
    },
    {
      username: 'bob',
      url: 'bob.suitree.trwall.app', 
      description: 'Bob\'s developer profile with GitHub and projects',
    },
    {
      username: 'crypto_artist',
      url: 'crypto_artist.suitree.trwall.app',
      description: 'NFT artist showcasing their digital creations',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9FAFB] to-white dark:from-[#0D0D0F] dark:to-[#18181B] p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-[#4B9EFF] to-[#3B82F6] rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">🌳</span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-[#E4E4E7]">
              SuiTree Subdomain System
            </h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-[#A1A1AA] max-w-2xl mx-auto">
            Test the subdomain system for username.suitree.trwall.app access
          </p>
        </motion.div>

        {/* Current Environment */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Globe className="h-5 w-5" />
                <span>Current Environment</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-[#27272A] rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-[#E4E4E7]">Hostname</p>
                    <p className="text-sm text-gray-600 dark:text-[#A1A1AA]">{currentHostname}</p>
                  </div>
                  <Badge variant={isLocalhost ? "warning" : "success"}>
                    {isLocalhost ? "Development" : "Production"}
                  </Badge>
                </div>
                
                {isLocalhost && (
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      <strong>Development Mode:</strong> Subdomain detection works with localhost subdomains (e.g., username.localhost:3003)
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Subdomain Examples */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Subdomain Examples</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {subdomainExamples.map((example, index) => (
                  <motion.div
                    key={example.username}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="flex items-center justify-between p-4 border border-gray-200 dark:border-[#27272A] rounded-lg hover:bg-gray-50 dark:hover:bg-[#27272A]/50 transition-colors"
                  >
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold text-gray-900 dark:text-[#E4E4E7]">
                          @{example.username}
                        </h3>
                        <Badge variant="secondary" size="sm">
                          {example.username}.suitree.trwall.app
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-[#A1A1AA]">
                        {example.description}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      leftIcon={<ExternalLink className="h-4 w-4" />}
                      onClick={() => {
                        if (isLocalhost) {
                          // For localhost, simulate subdomain by changing URL
                          const newUrl = `http://${example.username}.localhost:3003`;
                          window.open(newUrl, '_blank');
                        } else {
                          // For production, open the actual subdomain
                          window.open(`https://${example.url}`, '_blank');
                        }
                      }}
                    >
                      Visit
                    </Button>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* How It Works */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="h-5 w-5" />
                <span>How It Works</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-gray-50 dark:bg-[#27272A] rounded-lg">
                    <h4 className="font-semibold text-gray-900 dark:text-[#E4E4E7] mb-2">1. Subdomain Detection</h4>
                    <p className="text-sm text-gray-600 dark:text-[#A1A1AA]">
                      System detects username from subdomain (username.suitree.trwall.app)
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-[#27272A] rounded-lg">
                    <h4 className="font-semibold text-gray-900 dark:text-[#E4E4E7] mb-2">2. Username Resolution</h4>
                    <p className="text-sm text-gray-600 dark:text-[#A1A1AA]">
                      Username is resolved to profile ID via Sui blockchain registry
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-[#27272A] rounded-lg">
                    <h4 className="font-semibold text-gray-900 dark:text-[#E4E4E7] mb-2">3. Profile Display</h4>
                    <p className="text-sm text-gray-600 dark:text-[#A1A1AA]">
                      Profile data is loaded and displayed with modern UI
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Back to Demo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="text-center"
        >
          <Button
            variant="outline"
            onClick={() => window.location.href = '/#/new-demo'}
          >
            Back to Demo
          </Button>
        </motion.div>
      </div>
    </div>
  );
};
