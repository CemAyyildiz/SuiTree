import React, { useState, useEffect } from 'react';
import { useSuiClient } from '@mysten/dapp-kit';
import { PublicProfile } from '../pages/PublicProfile';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { REGISTRY_ID } from '../constants';
import { LinkTreeProfile } from '../types';

interface UsernameResolverProps {
  username: string;
}

export const UsernameResolver: React.FC<UsernameResolverProps> = ({ username }) => {
  const [profile, setProfile] = useState<LinkTreeProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const suiClient = useSuiClient();

  const resolveAndLoadProfile = async () => {
    if (!username) return;

    setLoading(true);
    setError(null);

    try {
      // Step 1: Resolve username to profile ID
      const registryObject = await suiClient.getDynamicFieldObject({
        parentId: REGISTRY_ID,
        name: {
          type: "0x1::string::String",
          value: username.toLowerCase(),
        },
      });

      if (!registryObject.data || !registryObject.data.content) {
        setError(`Username "@${username}" not found`);
        setLoading(false);
        return;
      }

      const content = registryObject.data.content as any;
      const profileId = content.fields?.value?.fields?.profile_id;

      if (!profileId) {
        setError(`Username "@${username}" not found`);
        setLoading(false);
        return;
      }

      // Step 2: Load profile data
      const response = await suiClient.getObject({
        id: profileId,
        options: {
          showContent: true,
          showType: true,
        },
      });

      if (response.data?.content && "fields" in response.data.content) {
        const content = response.data.content as any;
        
        // Parse links and ensure they have all required fields
        const rawLinks = content.fields.links || [];
        const parsedLinks = rawLinks.map((link: any) => ({
          label: link.label || link.fields?.label || "",
          url: link.url || link.fields?.url || "",
          is_premium: link.is_premium ?? link.fields?.is_premium ?? false,
          price: String(link.price ?? link.fields?.price ?? "0"),
        }));
        
        const profileData: LinkTreeProfile = {
          id: { id: response.data.objectId },
          owner: content.fields.owner,
          title: content.fields.title,
          avatar_cid: content.fields.avatar_cid,
          bio: content.fields.bio,
          links: parsedLinks,
          verified: content.fields.verified,
          view_count: content.fields.view_count || "0",
          earnings: content.fields.earnings,
        };
        setProfile(profileData);
      } else {
        setError("Profile not found");
      }
    } catch (err) {
      console.error("Error loading profile:", err);
      setError("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    resolveAndLoadProfile();
  }, [username]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F9FAFB] to-white dark:from-[#0D0D0F] dark:to-[#18181B] flex items-center justify-center p-4">
        <Card>
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4B9EFF] mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-[#A1A1AA]">Loading profile...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F9FAFB] to-white dark:from-[#0D0D0F] dark:to-[#18181B] flex items-center justify-center p-4">
        <Card>
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-red-600 dark:text-red-400 text-2xl">⚠️</span>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-[#E4E4E7] mb-2">
              Profile Not Found
            </h2>
            <p className="text-gray-600 dark:text-[#A1A1AA] mb-4">{error}</p>
            <Button onClick={resolveAndLoadProfile}>
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  return <PublicProfile profile={profile} />;
};
