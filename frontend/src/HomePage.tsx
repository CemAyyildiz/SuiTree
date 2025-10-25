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
  
  // zkLogin address'i localStorage'dan oku
  const [zkLoginAddress, setZkLoginAddress] = useState<string | null>(null);
  
  useEffect(() => {
    const savedAddress = localStorage.getItem('zkLoginAddress');
    setZkLoginAddress(savedAddress);
  }, []);

  // Hem normal cüzdan hem zkLogin kontrolü
  const userAddress = account?.address || zkLoginAddress;

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
        <Card>
          <Flex direction="column" align="center" gap="4" py="9">
            <Heading size="8">🌳 SuiTree</Heading>
            <Text size="3" color="gray">
              Create your decentralized link-in-bio page on Sui
            </Text>
            <Text size="2" color="gray">
              Connect your wallet or sign in with Google to get started
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
          <Heading size="6">My Profiles</Heading>
          <Button onClick={() => navigate("/create")} size="3">
            + Create New Profile
          </Button>
        </Flex>

        {loading ? (
          <Card>
            <Text>Loading profiles...</Text>
          </Card>
        ) : ownedProfiles.length === 0 ? (
          <Card>
            <Flex direction="column" align="center" gap="3" py="6">
              <Text size="3" color="gray">
                You don't have any profiles yet
              </Text>
              <Button onClick={() => navigate("/create")} size="2">
                Create Your First Profile
              </Button>
            </Flex>
          </Card>
        ) : (
          <Flex direction="column" gap="3">
            {ownedProfiles.map((profile) => (
              <Card key={profile.id.id}>
                <Flex justify="between" align="center">
                  <Flex direction="column" gap="1">
                    <Heading size="4">{profile.title}</Heading>
                    <Text size="2" color="gray">
                      {profile.bio}
                    </Text>
                    <Text size="1" color="gray">
                      {profile.links.length} links • {profile.view_count} views
                    </Text>
                  </Flex>
                  <Flex gap="2">
                    <Button
                      variant="soft"
                      onClick={() => navigate(`/profile/${profile.id.id}`)}
                    >
                      View
                    </Button>
                    <Button onClick={() => navigate(`/edit/${profile.id.id}`)}>
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

