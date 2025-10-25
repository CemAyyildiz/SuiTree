import { useCurrentAccount, useSuiClient, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { Box, Card, Container, Flex, Heading, Text, Button, Dialog } from "@radix-ui/themes";
import { useEffect, useState } from "react";
import { LinkTreeProfile, Link } from "./types";
import { PACKAGE_ID, MODULE_NAME } from "./constants";

interface ProfileViewProps {
  objectId: string;
}

export function ProfileView({ objectId }: ProfileViewProps) {
  const suiClient = useSuiClient();
  const account = useCurrentAccount();
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
  const [profile, setProfile] = useState<LinkTreeProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLink, setSelectedLink] = useState<{ link: Link; index: number } | null>(null);
  const [hasAccess, setHasAccess] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    if (objectId) {
      loadProfile();
    }
  }, [objectId]);

  useEffect(() => {
    if (profile && account?.address) {
      checkPremiumAccess();
    }
  }, [profile, account]);

  const loadProfile = async () => {
    if (!objectId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await suiClient.getObject({
        id: objectId,
        options: {
          showContent: true,
          showType: true,
        },
      });

      if (response.data?.content && "fields" in response.data.content) {
        const content = response.data.content as any;
        
        // Debug: Log raw data
        console.log("Profile raw data:", content.fields);
        console.log("Links raw data:", content.fields.links);
        
        // Parse links and ensure they have all required fields
        const rawLinks = content.fields.links || [];
        const parsedLinks = rawLinks.map((link: any) => ({
          label: link.label || link.fields?.label || "",
          url: link.url || link.fields?.url || "",
          is_premium: link.is_premium ?? link.fields?.is_premium ?? false,
          price: String(link.price ?? link.fields?.price ?? "0"),
        }));
        
        console.log("Parsed links:", parsedLinks);
        
        const profileData: LinkTreeProfile = {
          id: { id: response.data.objectId },
          owner: content.fields.owner,
          title: content.fields.title,
          avatar_cid: content.fields.avatar_cid,
          bio: content.fields.bio,
          links: parsedLinks,
          theme: content.fields.theme || {
            background_color: "#ffffff",
            text_color: "#000000",
            button_color: "#0066cc",
            font_style: "Arial",
          },
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

  const checkPremiumAccess = async () => {
    if (!profile || !account?.address) return;

    const accessMap: { [key: number]: boolean } = {};

    for (let i = 0; i < profile.links.length; i++) {
      const link = profile.links[i];
      if (link.is_premium) {
        try {
          // Check if user has access via dynamic field
          const accessKey = {
            link_index: i,
            user: account.address,
          };
          
          // Try to get dynamic field
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
    if (!selectedLink || !objectId || !account) return;

    try {
      const tx = new Transaction();

      const [coin] = tx.splitCoins(tx.gas, [tx.pure.u64(selectedLink.link.price)]);

      tx.moveCall({
        target: `${PACKAGE_ID}::${MODULE_NAME}::pay_for_link_access`,
        arguments: [
          tx.object(objectId),
          tx.pure.u64(selectedLink.index),
          coin,
        ],
      });

      signAndExecuteTransaction(
        { transaction: tx },
        {
          onSuccess: () => {
            alert("Payment successful! Opening link...");
            setHasAccess({ ...hasAccess, [selectedLink.index]: true });
            setSelectedLink(null);
            window.open(selectedLink.link.url, "_blank");
          },
          onError: (error) => {
            console.error("Payment failed:", error);
            alert("Payment failed: " + error.message);
          },
        }
      );
    } catch (error) {
      console.error("Error:", error);
      alert("Payment failed");
    }
  };

  if (loading) {
    return (
      <Container size="2" mt="9">
        <Card>
          <Flex justify="center" py="6">
            <Text>Loading profile...</Text>
          </Flex>
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
          </Flex>
        </Card>
      </Container>
    );
  }

  const theme = profile.theme;

  return (
    <Box
      style={{
        backgroundColor: theme.background_color,
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
                border: `3px solid ${theme.button_color}`,
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
              color: theme.text_color,
              fontFamily: theme.font_style,
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
                color: theme.text_color,
                maxWidth: "400px",
              }}
            >
              {profile.bio}
            </Text>
          )}

          {/* Debug Info (Remove in production) */}
          {import.meta.env.DEV && (
            <Card style={{ background: "#333", padding: "10px", marginBottom: "10px" }}>
              <Text size="1" style={{ color: "#fff" }}>
                Debug: {profile.links.length} links found
              </Text>
              {profile.links.length === 0 && (
                <Text size="1" style={{ color: "#ff6b6b" }}>
                  ⚠️ No links in this profile. Go to Edit page to add links.
                </Text>
              )}
            </Card>
          )}

          {/* Links */}
          <Flex direction="column" gap="3" style={{ width: "100%", maxWidth: "500px" }}>
            {profile.links.length === 0 && (
              <Card style={{ padding: "40px", textAlign: "center" }}>
                <Text size="4" weight="bold" style={{ color: theme.text_color, marginBottom: "8px" }}>
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
                      backgroundColor: theme.button_color,
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
                          fontFamily: theme.font_style,
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
          <Text size="1" style={{ color: theme.text_color, opacity: 0.6 }}>
            {profile.view_count} views
          </Text>

          {/* Footer */}
          <Text size="1" style={{ color: theme.text_color, opacity: 0.5, marginTop: "2rem" }}>
            Powered by SuiTree 🌳
          </Text>
        </Flex>
      </Container>
    </Box>
  );
}

