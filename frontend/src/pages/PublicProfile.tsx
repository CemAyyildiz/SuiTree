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
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Avatar } from '../components/ui/Avatar';
import { Badge } from '../components/ui/badge';
import { PaymentModal } from '../components/PaymentModal';

// Import types from types.ts
import { LinkTreeProfile } from '../types';


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


export const PublicProfile: React.FC<PublicProfileProps> = ({ profile }: { profile: LinkTreeProfile }) => {
  const [copiedAddress, setCopiedAddress] = React.useState(false);
  const [paymentModal, setPaymentModal] = React.useState<{
    isOpen: boolean;
    link: any;
    linkIndex: number;
  }>({
    isOpen: false,
    link: null,
    linkIndex: -1,
  });

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

  // Convert MIST to SUI (1 SUI = 1,000,000,000 MIST)
  const formatPrice = (priceInMist: string) => {
    const mist = parseInt(priceInMist);
    const sui = mist / 1000000000;
    return sui.toFixed(4);
  };

  const handlePremiumLinkClick = async (link: any, index: number) => {
    if (link.is_premium) {
      setPaymentModal({
        isOpen: true,
        link: link,
        linkIndex: index,
      });
    } else {
      window.open(link.url, '_blank');
    }
  };

  const handlePaymentSuccess = (linkUrl: string) => {
    // Payment successful, redirect to the link
    window.open(linkUrl, '_blank');
    setPaymentModal({
      isOpen: false,
      link: null,
      linkIndex: -1,
    });
  };

  const handlePaymentError = (error: string) => {
    console.error('Payment error:', error);
    // Could show a toast notification here
  };

  const handleClosePaymentModal = () => {
    setPaymentModal({
      isOpen: false,
      link: null,
      linkIndex: -1,
    });
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#F9FAFB] to-white dark:from-[#0D0D0F] dark:to-[#18181B]"
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
                style={{ color: '#1F2937' }}
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
                style={{ color: '#6B7280', opacity: 0.8 }}
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
                    onClick={() => handlePremiumLinkClick(link, index)}
                    style={{
                      borderColor: '#4B9EFF',
                      color: '#4B9EFF',
                    }}
                  >
                    <span className="text-lg">{getLinkIcon()}</span>
                    <span className="flex-1 text-left">{link.label}</span>
                    <div className="flex items-center space-x-2">
                      {link.is_premium && (
                        <>
                          <Badge variant="warning" size="sm">
                            {formatPrice(link.price)} SUI
                          </Badge>
                          <Badge variant="secondary" size="sm">
                            Pay Access
                          </Badge>
                        </>
                      )}
                    </div>
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

      {/* Payment Modal */}
      {paymentModal.isOpen && paymentModal.link && (
        <PaymentModal
          isOpen={paymentModal.isOpen}
          onClose={handleClosePaymentModal}
          link={paymentModal.link}
          profileOwner={profile.owner}
          onPaymentSuccess={handlePaymentSuccess}
          onPaymentError={handlePaymentError}
        />
      )}
    </div>
  );
};
