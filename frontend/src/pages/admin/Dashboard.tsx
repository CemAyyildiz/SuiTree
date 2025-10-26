import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Eye, 
  Edit, 
  ExternalLink,
  Users,
  Link as LinkIcon,
  TrendingUp
} from 'lucide-react';
import { useSuiClient, useCurrentAccount } from '@mysten/dapp-kit';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Avatar } from '../../components/ui/Avatar';

// Types
interface LinkTreeProfile {
  id: { id: string };
  owner: string;
  title: string;
  avatar_cid?: string;
  bio: string;
  links: Array<{
    label: string;
    url: string;
    is_premium: boolean;
    price: string;
  }>;
  // Theme removed from smart contract
  verified: boolean;
  view_count: string;
  earnings?: string;
}


export const Dashboard: React.FC = () => {
  const [profiles, setProfiles] = useState<LinkTreeProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const suiClient = useSuiClient();
  const account = useCurrentAccount();
  const userAddress = account?.address;

  const filteredProfiles = profiles;

  const loadOwnedProfiles = async () => {
    if (!userAddress) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      // Get all objects owned by the user
      const objects = await suiClient.getOwnedObjects({
        owner: userAddress,
        options: {
          showContent: true,
          showType: true,
        },
      });

      // Filter for LinkTreeProfile objects
      const profileObjects = objects.data
        .filter((obj: any) => {
          return obj.data?.type?.includes("::contrat::LinkTreeProfile");
        })
        .map((obj: any) => {
          const content = obj.data?.content as any;
          return {
            id: { id: obj.data?.objectId || "" },
            owner: content?.fields?.owner || "",
            title: content?.fields?.title || "",
            avatar_cid: content?.fields?.avatar_cid || "",
            bio: content?.fields?.bio || "",
            links: content?.fields?.links || [],
            // Theme removed from smart contract
            verified: content?.fields?.verified || false,
            view_count: content?.fields?.view_count || "0",
            earnings: content?.fields?.earnings || "0",
          } as LinkTreeProfile;
        });

      setProfiles(profileObjects);
    } catch (error) {
      console.error("Error loading profiles:", error);
      setError("Failed to load profiles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOwnedProfiles();
  }, [userAddress]);

  // Note: Profile deletion functionality removed since delete_profile was removed from smart contract

  // Calculate stats from real data
  const totalProfiles = profiles.length;
  const totalLinks = profiles.reduce((sum, profile) => sum + profile.links.length, 0);
  const totalViews = profiles.reduce((sum, profile) => sum + parseInt(profile.view_count || '0'), 0);

  const stats = [
    {
      title: 'Total Profiles',
      value: totalProfiles.toString(),
      change: `${totalProfiles} profiles`,
      icon: Users,
      color: 'text-blue-600',
    },
    {
      title: 'Total Links',
      value: totalLinks.toString(),
      change: `${totalLinks} links`,
      icon: LinkIcon,
      color: 'text-green-600',
    },
    {
      title: 'Total Views',
      value: totalViews.toLocaleString(),
      change: `${totalViews} total views`,
      icon: TrendingUp,
      color: 'text-purple-600',
    },
  ];

  if (!userAddress) {
    return (
      <div className="p-6 space-y-6">
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-[#E4E4E7] mb-2">
              Connect Your Wallet
            </h2>
            <p className="text-gray-600 dark:text-[#A1A1AA]">
              Please connect your wallet to view and manage your profiles.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4B9EFF]"></div>
          <span className="ml-3 text-gray-600 dark:text-[#A1A1AA]">Loading profiles...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 space-y-6">
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-2">
              Error Loading Profiles
            </h2>
            <p className="text-gray-600 dark:text-[#A1A1AA] mb-4">{error}</p>
            <Button onClick={loadOwnedProfiles}>
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-[#E4E4E7]">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-[#A1A1AA] mt-1">
            Manage your SuiTree profiles and track performance
          </p>
        </div>
        <Button 
          leftIcon={<Plus className="h-4 w-4" />}
          onClick={() => window.location.href = '/#/create'}
        >
          Create Profile
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card hover>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-[#A1A1AA]">
                        {stat.title}
                      </p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-[#E4E4E7]">
                        {stat.value}
                      </p>
                      <p className="text-xs text-green-600 dark:text-green-400">
                        {stat.change}
                      </p>
                    </div>
                    <div className={`p-3 rounded-lg bg-gray-100 dark:bg-[#27272A] ${stat.color}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Profiles */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Profiles</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredProfiles.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 dark:bg-[#27272A] rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-[#E4E4E7] mb-2">
                No profiles found
              </h3>
              <p className="text-gray-600 dark:text-[#A1A1AA] mb-4">
                You haven't created any profiles yet.
              </p>
              <Button 
                leftIcon={<Plus className="h-4 w-4" />}
                onClick={() => window.location.href = '/#/create'}
              >
                Create Your First Profile
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredProfiles.map((profile, index) => (
                <motion.div
                  key={profile.id.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 border border-gray-200 dark:border-[#27272A] rounded-lg hover:bg-gray-50 dark:hover:bg-[#27272A]/50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <Avatar
                      src={profile.avatar_cid ? `https://ipfs.io/ipfs/${profile.avatar_cid}` : undefined}
                      fallback={profile.title}
                      size="md"
                      status="online"
                    />
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-gray-900 dark:text-[#E4E4E7]">
                          {profile.title}
                        </h3>
                        {profile.verified && (
                          <Badge variant="success" size="sm">Verified</Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-[#A1A1AA]">
                        {profile.bio}
                      </p>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-xs text-gray-500 dark:text-[#71717A]">
                          {profile.links.length} links
                        </span>
                        <span className="text-xs text-gray-500 dark:text-[#71717A]">
                          {parseInt(profile.view_count || '0').toLocaleString()} views
                        </span>
                        <span className="text-xs text-gray-500 dark:text-[#71717A]">
                          ID: {profile.id.id.slice(0, 8)}...
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      leftIcon={<Eye className="h-4 w-4" />}
                      onClick={() => window.location.href = `/#/profile/${profile.id.id}`}
                    >
                      View
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      leftIcon={<Edit className="h-4 w-4" />}
                      onClick={() => window.location.href = `/#/edit/${profile.id.id}`}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      leftIcon={<ExternalLink className="h-4 w-4" />}
                      onClick={() => window.open(`/#/profile/${profile.id.id}`, '_blank')}
                    >
                      Public
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
