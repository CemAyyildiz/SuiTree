import { ConnectButton } from "@mysten/dapp-kit";
import { Box, Container, Card, Flex, Heading, Text } from "@radix-ui/themes";
import { HashRouter, Routes, Route, Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { HomePage } from "./HomePage";
import { ProfileEditor } from "./ProfileEditor";
import { ProfileView } from "./ProfileView";
import { UsernameResolver } from "./UsernameResolver";

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
    
    // For production domains (e.g., suitree.walrus.site)
    // Main domain or www → admin mode
    if (parts.length <= 2 || parts[0] === 'www' || parts[0] === 'suitree') {
      setMode('admin');
      return;
    }

    // Subdomain detected → profile mode (e.g., cem.suitree.walrus.site)
    const subdomain = parts[0];
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

        <Box>
          <ConnectButton />
        </Box>
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
