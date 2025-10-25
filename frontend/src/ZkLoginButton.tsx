import { useEnokiFlow, useZkLogin } from "@mysten/enoki/react";
import { Button, Flex, Text, Card } from "@radix-ui/themes";
import { PersonIcon, ExitIcon } from "@radix-ui/react-icons";
import { GOOGLE_CLIENT_ID } from "./enokiConfig";

export function ZkLoginButton() {
  const flow = useEnokiFlow();
  const zkLogin = useZkLogin();

  const handleGoogleLogin = async () => {
    try {
      // Google OAuth ile zkLogin başlat
      const protocol = window.location.protocol;
      const host = window.location.host;
      const redirectUrl = `${protocol}//${host}`;

      await flow.createAuthorizationURL({
        provider: "google",
        clientId: GOOGLE_CLIENT_ID,
        redirectUrl,
        extraParams: {
          scope: ["openid", "email", "profile"],
        },
      });
    } catch (error) {
      console.error("Google login error:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await zkLogin.logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Kullanıcı giriş yapmışsa
  if (zkLogin.address) {
    return (
      <Card>
        <Flex direction="column" gap="3">
          <Flex align="center" gap="2">
            <PersonIcon width="20" height="20" />
            <Text size="2" weight="bold">
              zkLogin ile Bağlı
            </Text>
          </Flex>
          <Text size="1" color="gray" style={{ wordBreak: "break-all" }}>
            Adres: {zkLogin.address}
          </Text>
          <Button 
            onClick={handleLogout} 
            variant="soft" 
            color="red"
            style={{ cursor: "pointer" }}
          >
            <ExitIcon />
            Çıkış Yap
          </Button>
        </Flex>
      </Card>
    );
  }

  // Kullanıcı giriş yapmamışsa
  return (
    <Card>
      <Flex direction="column" gap="3">
        <Text size="3" weight="bold" align="center">
          zkLogin ile Giriş
        </Text>
        <Text size="2" color="gray" align="center">
          Google hesabınızla güvenli bir şekilde giriş yapın
        </Text>
        <Button 
          onClick={handleGoogleLogin}
          size="3"
          style={{ cursor: "pointer" }}
        >
          <PersonIcon />
          Google ile Giriş Yap
        </Button>
      </Flex>
    </Card>
  );
}

