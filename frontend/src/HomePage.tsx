import { useCurrentAccount, useSuiClient } from "@mysten/dapp-kit";
import { Button, Card, Container, Flex, Heading, Text } from "@radix-ui/themes";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LinkTreeProfile } from "./types";

export function HomePage() {
  const account = useCurrentAccount();
  const suiClient = useSuiClient();
  const navigate = useNavigate();
  const [ownedProfiles, setOwnedProfiles] = useState<LinkTreeProfile[]>([]);
  const [loading, setLoading] = useState(false);
  
  // User address from connected wallet (includes Enoki wallets)
  const userAddress = account?.address;

  useEffect(() => {
    if (userAddress) {
      loadOwnedProfiles();
    } else {
      setOwnedProfiles([]);
    }
  }, [userAddress]);

  const loadOwnedProfiles = async () => {
    if (!userAddress) return;
    
    setLoading(true);
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
      const profiles = objects.data
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
            theme: content?.fields?.theme || {
              background_color: "#ffffff",
              text_color: "#000000",
              button_color: "#0066cc",
              font_style: "Arial",
            },
            verified: content?.fields?.verified || false,
            view_count: content?.fields?.view_count || "0",
          } as LinkTreeProfile;
        });

      setOwnedProfiles(profiles);
    } catch (error) {
      console.error("Error loading profiles:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!userAddress) {
    return (
      <Container size="2" mt="9">
        <Card style={{ backgroundColor: "white", boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}>
          <Flex direction="column" align="center" gap="4" py="9">
            <Heading size="8" style={{ color: "#1f2937", fontWeight: "700" }}>🌳 SuiTree</Heading>
            <Text size="3" style={{ color: "#6b7280", fontWeight: "500" }}>
              Create your decentralized link-in-bio page on Sui
            </Text>
            <Text size="2" style={{ color: "#9ca3af", fontWeight: "500" }}>
              Connect your wallet to get started (including Google via Enoki)
            </Text>
          </Flex>
        </Card>
      </Container>
    );
  }

  return (
    <Container size="3" mt="5">
      <Flex direction="column" gap="4">
        <Flex justify="between" align="center">
          <Heading size="6" style={{ color: "#1f2937", fontWeight: "700" }}>My Profiles</Heading>
          <Button onClick={() => navigate("/create")} size="3" style={{ backgroundColor: "#3b82f6", fontWeight: "600" }}>
            + Create New Profile
          </Button>
        </Flex>

        {loading ? (
          <Card style={{ backgroundColor: "white", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}>
            <Text style={{ color: "#6b7280", fontWeight: "500" }}>Loading profiles...</Text>
          </Card>
        ) : ownedProfiles.length === 0 ? (
          <Card style={{ backgroundColor: "white", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}>
            <Flex direction="column" align="center" gap="3" py="6">
              <Text size="3" style={{ color: "#6b7280", fontWeight: "500" }}>
                You don't have any profiles yet
              </Text>
              <Button onClick={() => navigate("/create")} size="2" style={{ backgroundColor: "#3b82f6", fontWeight: "600" }}>
                Create Your First Profile
              </Button>
            </Flex>
          </Card>
        ) : (
          <Flex direction="column" gap="3">
            {ownedProfiles.map((profile) => (
              <Card key={profile.id.id} style={{ backgroundColor: "white", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}>
                <Flex justify="between" align="center">
                  <Flex direction="column" gap="1">
                    <Heading size="4" style={{ color: "#1f2937", fontWeight: "600" }}>{profile.title}</Heading>
                    <Text size="2" style={{ color: "#6b7280", fontWeight: "500" }}>
                      {profile.bio}
                    </Text>
                    <Text size="1" style={{ color: "#9ca3af", fontWeight: "500" }}>
                      {profile.links.length} links • {profile.view_count} views
                    </Text>
                  </Flex>
                  <Flex gap="2">
                    <Button
                      variant="soft"
                      onClick={() => navigate(`/profile/${profile.id.id}`)}
                      style={{ backgroundColor: "#f3f4f6", color: "#374151", fontWeight: "600" }}
                    >
                      View
                    </Button>
                    <Button 
                      onClick={() => navigate(`/edit/${profile.id.id}`)}
                      style={{ backgroundColor: "#3b82f6", fontWeight: "600" }}
                    >
                      Edit
                    </Button>
                  </Flex>
                </Flex>
              </Card>
            ))}
          </Flex>
        )}
      </Flex>
    </Container>
  );
}

