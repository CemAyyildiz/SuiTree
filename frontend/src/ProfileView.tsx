import { useSuiClient } from "@mysten/dapp-kit";
import { Box, Card, Container, Flex, Heading, Text } from "@radix-ui/themes";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { LinkTreeProfile } from "./types";

export function ProfileView() {
  const { objectId } = useParams<{ objectId: string }>();
  const suiClient = useSuiClient();
  const [profile, setProfile] = useState<LinkTreeProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (objectId) {
      loadProfile();
    }
  }, [objectId]);

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
        const profileData: LinkTreeProfile = {
          id: { id: response.data.objectId },
          owner: content.fields.owner,
          title: content.fields.title,
          avatar_cid: content.fields.avatar_cid,
          bio: content.fields.bio,
          links: content.fields.links || [],
          theme: content.fields.theme || {
            background_color: "#ffffff",
            text_color: "#000000",
            button_color: "#0066cc",
            font_style: "Arial",
          },
          verified: content.fields.verified,
          view_count: content.fields.view_count || "0",
        };
        setProfile(profileData);

        // Increment view count (optional - requires transaction)
        // You could call increment_views here if needed
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

          {/* Links */}
          <Flex direction="column" gap="3" style={{ width: "100%", maxWidth: "500px" }}>
            {profile.links.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: "none" }}
              >
                <Card
                  style={{
                    backgroundColor: theme.button_color,
                    cursor: "pointer",
                    transition: "transform 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.02)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                  }}
                >
                  <Flex justify="center" align="center" py="3">
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
                  </Flex>
                </Card>
              </a>
            ))}
          </Flex>

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

