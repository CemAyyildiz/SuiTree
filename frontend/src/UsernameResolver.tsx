import { useSuiClient } from "@mysten/dapp-kit";
import { Container, Card, Text } from "@radix-ui/themes";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PACKAGE_ID, MODULE_NAME, REGISTRY_ID } from "./constants";

export function UsernameResolver() {
  const { username } = useParams<{ username: string }>();
  const suiClient = useSuiClient();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (username) {
      resolveUsername();
    }
  }, [username]);

  const resolveUsername = async () => {
    if (!username) return;

    setLoading(true);
    setError(null);

    try {
      // Get the NameRegistry object and read dynamic field
      const registryObject = await suiClient.getDynamicFieldObject({
        parentId: REGISTRY_ID,
        name: {
          type: "0x1::string::String",
          value: username.toLowerCase(),
        },
      });

      if (registryObject.data && registryObject.data.content) {
        const content = registryObject.data.content as any;
        const profileId = content.fields?.value?.fields?.profile_id;

        if (profileId) {
          // Redirect to profile page
          navigate(`/profile/${profileId}`, { replace: true });
          return;
        }
      }

      setError(`Username "@${username}" not found`);
    } catch (err) {
      console.error("Error resolving username:", err);
      setError(`Username "@${username}" not found`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container size="2" mt="9">
        <Card>
          <Text>Looking up @{username}...</Text>
        </Card>
      </Container>
    );
  }

  if (error) {
    return (
      <Container size="2" mt="9">
        <Card>
          <Text size="4" color="red">
            {error}
          </Text>
          <Text size="2" color="gray" mt="3">
            This username is not registered yet.
          </Text>
        </Card>
      </Container>
    );
  }

  return null;
}

