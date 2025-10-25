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
    const pathname = window.location.pathname;
    
    console.log('Subdomain detection - hostname:', hostname, 'pathname:', pathname);
    
    // Exact localhost or 127.0.0.1 → admin mode
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      console.log('Detected localhost - setting admin mode');
      setMode('admin');
      return;
    }

    // Parse subdomain
    const parts = hostname.split('.');
    console.log('Hostname parts:', parts);
    
    // Check for localhost subdomains (e.g., cem.localhost)
    if (hostname.endsWith('.localhost')) {
      // Subdomain on localhost
      const subdomain = parts[0];
      if (subdomain && subdomain !== 'localhost') {
        console.log('Detected localhost subdomain:', subdomain, '- setting profile mode');
        setUsername(subdomain);
        setMode('profile');
        return;
      }
    }
    
    // Check for Walrus subdomains (e.g., username.suitree.trwal.app)
    if (hostname.endsWith('.suitree.trwal.app')) {
      const subdomain = parts[0];
      if (subdomain && subdomain !== 'suitree') {
        console.log('Detected Walrus subdomain (endsWith):', subdomain, '- setting profile mode');
        setUsername(subdomain);
        setMode('profile');
        return;
      }
    }
    
    // Check for direct subdomain pattern (e.g., username.suitree.trwal.app)
    if (parts.length === 4 && parts[1] === 'suitree' && parts[2] === 'trwal' && parts[3] === 'app') {
      const subdomain = parts[0];
      if (subdomain && subdomain !== 'suitree' && subdomain !== 'www') {
        console.log('Detected direct subdomain pattern:', subdomain, '- setting profile mode');
        setUsername(subdomain);
        setMode('profile');
        return;
      }
    }
    
    // Check if subdomain is a Walrus B36 ID (43 characters)
    const subdomain = parts[0];
    if (subdomain && subdomain.length >= 40) {
      // This looks like a B36 ID, treat as main site (admin mode)
      setMode('admin');
      return;
    }
    
    // For production domains (suitree.trwal.app or main domain)
    // If hostname is exactly "suitree.trwal.app" (2 parts after split), it's admin
    if (parts.length === 2 && parts[1] === 'trwal.app' && parts[0] === 'suitree') {
      setMode('admin');
      return;
    }
    
    // If we have 3+ parts and first part is not main domain, it's a subdomain
    // e.g., cem.suitree.trwal.app (3 parts: cem, suitree, trwal.app)
    if (parts.length >= 3 && parts[0] !== 'suitree' && parts[0] !== 'www') {
      // This is a username subdomain
      setUsername(parts[0]);
      setMode('profile');
      return;
    }
    
    // FALLBACK: Check if pathname has a username format
    // e.g., suitree.trwal.app/cem or suitree.trwal.app/@cem
    if (pathname && pathname.length > 1) {
      const pathParts = pathname.split('/');
      const potentialUsername = pathParts[1];
      
      // If it looks like a username (not a hash route like #/profile)
      if (potentialUsername && 
          !potentialUsername.startsWith('#') && 
          potentialUsername.length > 1 && 
          potentialUsername.length < 30) {
        // Check if it's a username pattern (letters, numbers, underscore)
        if (/^[a-zA-Z0-9_]+$/.test(potentialUsername)) {
          setUsername(potentialUsername);
          setMode('profile');
          return;
        }
      }
    }
    
    // Default to admin mode for other cases
    console.log('No subdomain pattern matched - defaulting to admin mode');
    setMode('admin');
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

