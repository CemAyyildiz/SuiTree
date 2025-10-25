import { ConnectButton } from "@mysten/dapp-kit";
import { Box, Container, Card, Flex, Heading, Text } from "@radix-ui/themes";
import { HashRouter, Routes, Route, Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuthCallback } from "@mysten/enoki/react";
import { HomePage } from "./HomePage";
import { ProfileEditor } from "./ProfileEditor";
import { ProfileView } from "./ProfileView";
import { UsernameResolver } from "./UsernameResolver";
import { ZkLoginButton } from "./ZkLoginButton";

// Wrapper to get objectId from route params
function ProfileViewWrapper() {
  const { objectId } = useParams<{ objectId: string }>();
  return <ProfileView objectId={objectId || ""} />;
}

// Detect if this is a subdomain (user profile) or main domain (admin)
function useSubdomainDetection() {
  const [mode, setMode] = useState<"loading" | "profile" | "admin">("loading");
  const [username, setUsername] = useState<string>("");

  useEffect(() => {
    const hostname = window.location.hostname;
    
    // Exact localhost or 127.0.0.1 → admin mode
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      setMode('admin');
      return;
    }

    // Parse subdomain
    const parts = hostname.split('.');
    
    // Check for localhost subdomains (e.g., cem.localhost)
    if (hostname.endsWith('.localhost')) {
      // Subdomain on localhost
      const subdomain = parts[0];
      if (subdomain && subdomain !== 'localhost') {
        setUsername(subdomain);
        setMode('profile');
        return;
      }
    }
    
    // For production domains (e.g., suitree.walrus.site or 65bptoh2u9od2...trwal.app)
    // Main domain or www → admin mode
    if (parts.length <= 2 || parts[0] === 'www' || parts[0] === 'suitree') {
      setMode('admin');
      return;
    }

    // Check if subdomain is a Walrus B36 ID (43 characters)
    const subdomain = parts[0];
    if (subdomain && subdomain.length >= 40) {
      // This looks like a B36 ID, treat as main site (admin mode)
      setMode('admin');
      return;
    }

    // Subdomain detected → profile mode (e.g., cem.suitree.walrus.site)
    setUsername(subdomain);
    setMode('profile');
  }, []);

  return { mode, username };
}

// Public Profile Site (cem.suitree.walrus.site)
function PublicProfileSite({ username }: { username: string }) {
  return (
    <Box>
      {/* Minimal branding header */}
      <Flex 
        px="4" 
        py="2" 
        justify="center" 
        style={{ 
          borderBottom: "1px solid var(--gray-a2)",
          backgroundColor: "var(--color-background)"
        }}
      >
        <Text size="2" color="gray">
          Powered by{" "}
          <a 
            href="https://suitree.walrus.site" 
            style={{ color: "inherit", textDecoration: "none", fontWeight: "bold" }}
            target="_blank"
            rel="noopener noreferrer"
          >
            SuiTree 🌳
          </a>
        </Text>
      </Flex>
      
      {/* User's profile */}
      <UsernameResolver username={username} />
    </Box>
  );
}

// Admin Dashboard Site (suitree.walrus.site)
function AdminDashboardSite() {
  return (
    <HashRouter>
      {/* Admin header with wallet */}
      <Flex
        position="sticky"
        px="4"
        py="2"
        justify="between"
        style={{
          borderBottom: "1px solid var(--gray-a2)",
          backgroundColor: "var(--color-background)",
          top: 0,
          zIndex: 100,
        }}
      >
        <Box>
          <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
            <Heading>🌳 SuiTree Admin</Heading>
          </Link>
        </Box>

        <Flex gap="3" align="center">
          <ZkLoginButton />
          <ConnectButton />
        </Flex>
      </Flex>

      {/* Admin routes */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/create" element={<ProfileEditor />} />
        <Route path="/edit/:objectId" element={<ProfileEditor />} />
        <Route path="/profile/:objectId" element={<ProfileViewWrapper />} />
      </Routes>
    </HashRouter>
  );
}

// Main App - decides which site to show
function App() {
  const { mode, username } = useSubdomainDetection();
  useAuthCallback(); // Enoki callback'ini tetikle ama sonucunu kullanma
  const [isProcessingAuth, setIsProcessingAuth] = useState(false);

  // OAuth callback'ten döndükten sonra URL'i temizle
  useEffect(() => {
    const hash = window.location.hash;
    
    // Eğer URL'de id_token varsa, işleniyor demektir
    if (hash.includes('id_token')) {
      setIsProcessingAuth(true);
      
      // Kısa süre bekle (Enoki'nin token'ı işlemesi için)
      const timer = setTimeout(() => {
        // HashRouter kullandığımız için # karakterini koruyalım
        window.location.hash = '#/';
        setIsProcessingAuth(false);
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, []);

  // OAuth callback'ten dönüldüğünde gösterilecek loading ekranı
  // NOT: 'handled' kullanmıyoruz çünkü sürekli true kalabiliyor
  if (isProcessingAuth) {
    return (
      <Container size="2" mt="9">
        <Card>
          <Flex direction="column" align="center" gap="3" py="6">
            <Text size="5">⏳ Google ile giriş yapılıyor...</Text>
            <Text size="2" color="gray">Lütfen bekleyin</Text>
          </Flex>
        </Card>
      </Container>
    );
  }

  // Loading
  if (mode === "loading") {
    return (
      <Container size="2" mt="9">
        <Card>
          <Flex justify="center" py="6">
            <Text>Loading...</Text>
          </Flex>
        </Card>
      </Container>
    );
  }

  // Public Profile Site (subdomain)
  if (mode === "profile") {
    return <PublicProfileSite username={username} />;
  }

  // Admin Dashboard Site (main domain)
  return <AdminDashboardSite />;
}

export default App;
