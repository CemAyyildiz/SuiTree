import { useCurrentAccount, useSuiClient, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { Box, Card, Container, Flex, Heading, Text, Button, Dialog } from "@radix-ui/themes";
import { useEffect, useState } from "react";
import { PACKAGE_ID, MODULE_NAME, REGISTRY_ID } from "./constants";
import { LinkTreeProfile, Link } from "./types";

interface UsernameResolverProps {
  username: string;
}

export function UsernameResolver({ username }: UsernameResolverProps) {
  const suiClient = useSuiClient();
  const account = useCurrentAccount();
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
  
  const [profile, setProfile] = useState<LinkTreeProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLink, setSelectedLink] = useState<{ link: Link; index: number } | null>(null);
  const [hasAccess, setHasAccess] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    if (username) {
      resolveAndLoadProfile();
    }
  }, [username]);

  useEffect(() => {
    if (profile && account?.address) {
      checkPremiumAccess();
    }
  }, [profile, account]);

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
        const profileContent = response.data.content as any;
        
        // Parse links
        const rawLinks = profileContent.fields.links || [];
        const parsedLinks = rawLinks.map((link: any) => ({
          label: link.label || link.fields?.label || "",
          url: link.url || link.fields?.url || "",
          is_premium: link.is_premium ?? link.fields?.is_premium ?? false,
          price: String(link.price ?? link.fields?.price ?? "0"),
        }));
        
        const profileData: LinkTreeProfile = {
          id: { id: response.data.objectId },
          owner: profileContent.fields.owner,
          title: profileContent.fields.title,
          avatar_cid: profileContent.fields.avatar_cid,
          bio: profileContent.fields.bio,
          links: parsedLinks,
          verified: profileContent.fields.verified,
          view_count: profileContent.fields.view_count || "0",
          earnings: profileContent.fields.earnings,
        };
        
        setProfile(profileData);
      } else {
        setError("Profile not found");
      }
    } catch (err) {
      console.error("Error resolving username:", err);
      setError(`Username "@${username}" not found`);
    } finally {
      setLoading(false);
    }
  };

  const checkPremiumAccess = async () => {
    if (!profile || !account?.address) return;

    const accessMap: { [key: number]: boolean } = {};

    for (let i = 0; i < profile.links.length; i++) {
      const link = profile.links[i];
      if (link.is_premium) {
        try {
          const accessKey = {
            link_index: i,
            user: account.address,
          };
          
          const field = await suiClient.getDynamicFieldObject({
            parentId: profile.id.id,
            name: {
              type: `${PACKAGE_ID}::${MODULE_NAME}::LinkAccessKey`,
              value: accessKey,
            },
          });

          accessMap[i] = field.data !== null;
        } catch {
          accessMap[i] = false;
        }
      }
    }

    setHasAccess(accessMap);
  };

  const handleLinkClick = (link: Link, index: number, e: React.MouseEvent) => {
    if (link.is_premium && !hasAccess[index]) {
      e.preventDefault();
      setSelectedLink({ link, index });
    }
  };

  const handlePayment = async () => {
    if (!selectedLink || !profile || !account) return;

    try {
      const tx = new Transaction();
      const priceInMist = parseInt(selectedLink.link.price);
      
      // Simple SUI transfer to profile owner
      tx.transferObjects(
        [tx.splitCoins(tx.gas, [priceInMist])[0]],
        profile.owner
      );

      signAndExecuteTransaction(
        { transaction: tx },
        {
          onSuccess: (result) => {
            console.log('Payment successful:', result);
            setHasAccess(prev => ({ ...prev, [selectedLink.index]: true }));
            setSelectedLink(null);
            // Force redirect
            setTimeout(() => {
              window.location.href = selectedLink.link.url;
            }, 100);
          },
          onError: (error) => {
            console.error("Payment failed:", error);
            alert("Payment failed: " + (error.message || "Unknown error"));
          },
        }
      );
    } catch (error: any) {
      console.error("Payment failed:", error);
      alert("Payment failed: " + (error.message || "Unknown error"));
    }
  };

  if (loading) {
    return (
      <Container size="2" mt="9">
        <Card>
          <Text>Loading @{username}...</Text>
        </Card>
      </Container>
    );
  }

  if (error || !profile) {
    return (
      <Container size="2" mt="9">
        <Card>
          <Flex direction="column" align="center" gap="3" py="6">
            <Text size="4" color="red">
              {error || "Profile not found"}
            </Text>
            <Text size="2" color="gray">
              Username "@{username}" is not registered.
            </Text>
          </Flex>
        </Card>
      </Container>
    );
  }


  // Render profile (same as ProfileView but URL stays as /username)
  return (
    <Box
      style={{
        backgroundColor: '#F9FAFB',
        minHeight: "100vh",
        paddingTop: "2rem",
        paddingBottom: "2rem",
      }}
    >
      <Container size="1">
        <Flex direction="column" align="center" gap="4">
          {/* Avatar */}
          {profile.avatar_cid && (
            <Box
              style={{
                width: "120px",
                height: "120px",
                borderRadius: "50%",
                overflow: "hidden",
                border: `3px solid #4B9EFF`,
              }}
            >
              <img
                src={
                  profile.avatar_cid.startsWith("http")
                    ? profile.avatar_cid
                    : `https://ipfs.io/ipfs/${profile.avatar_cid}`
                }
                alt={profile.title}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </Box>
          )}

          {/* Title */}
          <Heading
            size="7"
            style={{
              color: '#1F2937',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            {profile.title}
            {profile.verified && " ✓"}
          </Heading>

          {/* Bio */}
          {profile.bio && (
            <Text
              size="3"
              align="center"
              style={{
                color: '#6B7280',
                maxWidth: "400px",
              }}
            >
              {profile.bio}
            </Text>
          )}

          {/* Debug Info (Development only) */}
          {import.meta.env.DEV && (
            <Card style={{ background: "#333", padding: "10px", marginBottom: "10px" }}>
              <Text size="1" style={{ color: "#fff" }}>
                Debug: @{username} → {profile.links.length} links
              </Text>
            </Card>
          )}

          {/* Links */}
          <Flex direction="column" gap="3" style={{ width: "100%", maxWidth: "500px" }}>
            {profile.links.length === 0 && (
              <Card style={{ padding: "40px", textAlign: "center" }}>
                <Text size="4" weight="bold" style={{ color: '#1F2937', marginBottom: "8px" }}>
                  No links yet
                </Text>
                <Text size="2" color="gray">
                  This profile doesn't have any links added.
                </Text>
                {account?.address === profile.owner && (
                  <Button 
                    style={{ marginTop: "16px" }}
                    onClick={() => window.location.href = `/edit/${profile.id.id}`}
                  >
                    Add Links
                  </Button>
                )}
              </Card>
            )}
            
            {profile.links.map((link, index) => {
              const isPremium = link.is_premium;
              const hasUserAccess = hasAccess[index] || !isPremium;
              const priceInSui = isPremium ? (parseInt(link.price) / 1_000_000_000).toFixed(2) : "0";

              return (
                <a
                  key={index}
                  href={hasUserAccess ? link.url : undefined}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: "none" }}
                  onClick={(e) => handleLinkClick(link, index, e)}
                >
                  <Card
                    style={{
                      backgroundColor: '#4B9EFF',
                      cursor: "pointer",
                      transition: "transform 0.2s",
                      border: isPremium ? "3px solid gold" : undefined,
                      position: "relative",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "scale(1.02)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "scale(1)";
                    }}
                  >
                    <Flex justify="center" align="center" py="3" gap="2">
                      <Text
                        size="3"
                        weight="bold"
                        style={{
                          color: "#ffffff",
                          fontFamily: 'Inter, sans-serif',
                        }}
                      >
                        {link.label}
                      </Text>
                      {isPremium && !hasUserAccess && (
                        <Text
                          size="2"
                          style={{
                            background: "gold",
                            color: "black",
                            padding: "4px 8px",
                            borderRadius: "6px",
                            fontWeight: "bold",
                          }}
                        >
                          🔒 {priceInSui} SUI
                        </Text>
                      )}
                      {isPremium && hasUserAccess && (
                        <Text size="2" style={{ color: "gold" }}>
                          ✓ Unlocked
                        </Text>
                      )}
                    </Flex>
                  </Card>
                </a>
              );
            })}
          </Flex>

          {/* Payment Modal */}
          <Dialog.Root open={!!selectedLink} onOpenChange={() => setSelectedLink(null)}>
            <Dialog.Content style={{ maxWidth: 450 }}>
              <Dialog.Title>Premium Link</Dialog.Title>
              <Dialog.Description size="2" mb="4">
                This link requires payment to access.
              </Dialog.Description>

              {selectedLink && (
                <Flex direction="column" gap="3">
                  <Card>
                    <Flex direction="column" gap="2">
                      <Text weight="bold">{selectedLink.link.label}</Text>
                      <Text size="2" color="gray">
                        Price: {(parseInt(selectedLink.link.price) / 1_000_000_000).toFixed(2)} SUI
                      </Text>
                    </Flex>
                  </Card>

                  {!account ? (
                    <Text size="2" color="red">
                      Please connect your wallet to purchase access
                    </Text>
                  ) : (
                    <Flex gap="3" justify="end">
                      <Dialog.Close>
                        <Button variant="soft" color="gray">
                          Cancel
                        </Button>
                      </Dialog.Close>
                      <Button onClick={handlePayment}>
                        Pay & Access
                      </Button>
                    </Flex>
                  )}
                </Flex>
              )}
            </Dialog.Content>
          </Dialog.Root>

          {/* View Count */}
          <Text size="1" style={{ color: '#6B7280', opacity: 0.6 }}>
            {profile.view_count} views
          </Text>

          {/* Footer */}
          <Text size="1" style={{ color: '#6B7280', opacity: 0.5, marginTop: "2rem" }}>
            Powered by SuiTree 🌳
          </Text>
        </Flex>
      </Container>
    </Box>
  );
}

