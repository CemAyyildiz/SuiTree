import React from 'react';
import { motion } from 'framer-motion';
import { 
  Twitter, 
  Github, 
  Linkedin, 
  Instagram, 
  Globe, 
  Mail,
  Copy,
  Check
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Avatar } from '../components/ui/Avatar';
import { Badge } from '../components/ui/Badge';

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
  theme: {
    background_color: string;
    text_color: string;
    button_color: string;
    font_style: string;
  };
  verified: boolean;
  view_count: string;
  earnings?: string;
}

interface Link {
  id: string;
  label: string;
  url: string;
  icon?: string;
  isPremium?: boolean;
}

interface SocialLink {
  platform: string;
  url: string;
  icon: React.ReactNode;
}

interface PublicProfileProps {
  profile: LinkTreeProfile;
}

const getLinkIcon = (icon?: string) => {
  if (!icon) return <Globe className="h-5 w-5" />;
  
  const iconMap: { [key: string]: React.ReactNode } = {
    '🌐': <Globe className="h-5 w-5" />,
    '🐦': <Twitter className="h-5 w-5" />,
    '💻': <Github className="h-5 w-5" />,
    '📧': <Mail className="h-5 w-5" />,
    '💼': <Linkedin className="h-5 w-5" />,
    '📸': <Instagram className="h-5 w-5" />,
  };
  
  return iconMap[icon] || <Globe className="h-5 w-5" />;
};

const getSocialIcon = (platform: string) => {
  const iconMap: { [key: string]: React.ReactNode } = {
    twitter: <Twitter className="h-5 w-5" />,
    github: <Github className="h-5 w-5" />,
    linkedin: <Linkedin className="h-5 w-5" />,
    instagram: <Instagram className="h-5 w-5" />,
  };
  
  return iconMap[platform] || <Globe className="h-5 w-5" />;
};

export const PublicProfile: React.FC<PublicProfileProps> = ({ profile }) => {
  const [copiedAddress, setCopiedAddress] = React.useState(false);

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(profile.owner);
      setCopiedAddress(true);
      setTimeout(() => setCopiedAddress(false), 2000);
    } catch (err) {
      console.error('Failed to copy address:', err);
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        backgroundColor: profile.theme.background_color || '#F9FAFB',
        fontFamily: profile.theme.font_style || 'Inter, sans-serif',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <Card className="p-8 text-center space-y-6" style={{
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
        }}>
          {/* Avatar */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="flex justify-center"
          >
            <Avatar
              src={profile.avatar_cid ? `https://ipfs.io/ipfs/${profile.avatar_cid}` : undefined}
              fallback={profile.title}
              size="xl"
              status="online"
            />
          </motion.div>

          {/* Name and Verification */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="space-y-2"
          >
            <div className="flex items-center justify-center space-x-2">
              <h1 
                className="text-2xl font-bold"
                style={{ color: profile.theme.text_color || '#1F2937' }}
              >
                {profile.title}
              </h1>
              {profile.verified && (
                <Badge variant="success" size="sm">
                  ✓ Verified
                </Badge>
              )}
            </div>
            
            {profile.bio && (
              <p 
                className="text-sm leading-relaxed"
                style={{ color: profile.theme.text_color || '#6B7280', opacity: 0.8 }}
              >
                {profile.bio}
              </p>
            )}
          </motion.div>

          {/* Wallet Address */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex items-center justify-center space-x-2 p-3 bg-gray-100 dark:bg-[#27272A] rounded-lg"
          >
            <span className="text-sm font-mono text-gray-700 dark:text-[#A1A1AA]">
              {formatAddress(profile.owner)}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={copyAddress}
              className="h-6 w-6 p-0"
            >
              {copiedAddress ? (
                <Check className="h-3 w-3 text-green-600" />
              ) : (
                <Copy className="h-3 w-3" />
              )}
            </Button>
          </motion.div>

          {/* Links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="space-y-3"
          >
            {profile.links.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-[#71717A] text-sm">
                  No links available yet
                </p>
              </div>
            ) : (
              profile.links.map((link, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                >
                  <Button
                    variant="outline"
                    className="w-full justify-start space-x-3 h-12"
                    onClick={() => window.open(link.url, '_blank')}
                    style={{
                      borderColor: profile.theme.button_color || '#4B9EFF',
                      color: profile.theme.button_color || '#4B9EFF',
                    }}
                  >
                    <span className="text-lg">{getLinkIcon()}</span>
                    <span className="flex-1 text-left">{link.label}</span>
                    {link.is_premium && (
                      <Badge variant="warning" size="sm">
                        Premium
                      </Badge>
                    )}
                  </Button>
                </motion.div>
              ))
            )}
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="pt-4 border-t border-gray-200 dark:border-[#27272A]"
          >
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-[#71717A]">
              <span>{parseInt(profile.view_count || '0').toLocaleString()} views</span>
              <span>Powered by SuiTree 🌳</span>
            </div>
          </motion.div>
        </Card>
      </motion.div>
    </div>
  );
};
