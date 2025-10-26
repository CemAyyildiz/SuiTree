import { ConnectButton } from "@mysten/dapp-kit";
import { Box, Container, Card, Flex, Heading, Text } from "@radix-ui/themes";
import { HashRouter, Routes, Route, Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSuiClient } from "@mysten/dapp-kit";
import { ProfileEditor } from "./ProfileEditor";
import { UsernameResolver } from "./components/UsernameResolver";
import { PublicProfile } from "./pages/PublicProfile";
import { DemoPage } from "./pages/demo";
import { SubdomainTest } from "./pages/SubdomainTest";

// Wrapper to get objectId from route params and load profile data from blockchain
function ProfileViewWrapper() {
  const { objectId } = useParams<{ objectId: string }>();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const suiClient = useSuiClient();

  useEffect(() => {
    const loadProfile = async () => {
      if (!objectId) return;
      
      setLoading(true);
      setError(null);
      
      try {
        // Load profile data from Sui blockchain using objectId
        const response = await suiClient.getObject({
          id: objectId,
          options: {
            showContent: true,
            showType: true,
          },
        });

        if (response.data?.content && "fields" in response.data.content) {
          const content = response.data.content as any;
          
          // Parse links and ensure they have all required fields
          const rawLinks = content.fields.links || [];
          const parsedLinks = rawLinks.map((link: any) => ({
            label: link.label || link.fields?.label || "",
            url: link.url || link.fields?.url || "",
            is_premium: link.is_premium ?? link.fields?.is_premium ?? false,
            price: String(link.price ?? link.fields?.price ?? "0"),
          }));
          
          const profileData = {
            id: { id: response.data.objectId },
            owner: content.fields.owner,
            title: content.fields.title,
            avatar_cid: content.fields.avatar_cid,
            bio: content.fields.bio,
            links: parsedLinks,
            theme: content.fields.theme || {
              background_color: "#f8f9fa",
              text_color: "#2c3e50",
              button_color: "#3498db",
              font_style: "Inter, -apple-system, BlinkMacSystemFont, sans-serif",
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

    loadProfile();
  }, [objectId, suiClient]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F9FAFB] to-white dark:from-[#0D0D0F] dark:to-[#18181B] flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4B9EFF] mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-[#A1A1AA]">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F9FAFB] to-white dark:from-[#0D0D0F] dark:to-[#18181B] flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 dark:text-red-400 text-2xl">⚠️</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-[#E4E4E7] mb-2">
            Profile Not Found
          </h2>
          <p className="text-gray-600 dark:text-[#A1A1AA] mb-4">{error}</p>
        </div>
      </div>
    );
  }

  return <PublicProfile profile={profile} />;
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
    
    // Check for Walrus subdomains (e.g., username.suitree.trwall.app)
    if (hostname.endsWith('.suitree.trwall.app')) {
      const subdomain = parts[0];
      if (subdomain && subdomain !== 'suitree') {
        console.log('Detected Walrus subdomain (endsWith):', subdomain, '- setting profile mode');
        setUsername(subdomain);
        setMode('profile');
        return;
      }
    }
    
    // Check for direct subdomain pattern (e.g., username.suitree.trwall.app)
    if (parts.length === 4 && parts[1] === 'suitree' && parts[2] === 'trwall' && parts[3] === 'app') {
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
    
    // For production domains (suitree.trwall.app or main domain)
    // If hostname is exactly "suitree.trwall.app" (2 parts after split), it's admin
    if (parts.length === 2 && parts[1] === 'trwall.app' && parts[0] === 'suitree') {
      setMode('admin');
      return;
    }
    
    // If we have 3+ parts and first part is not main domain, it's a subdomain
    // e.g., cem.suitree.trwall.app (3 parts: cem, suitree, trwall.app)
    if (parts.length >= 3 && parts[0] !== 'suitree' && parts[0] !== 'www') {
      // This is a username subdomain
      setUsername(parts[0]);
      setMode('profile');
      return;
    }
    
    // FALLBACK: Check if pathname has a username format
    // e.g., suitree.trwall.app/cem or suitree.trwall.app/@cem
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

// Public Profile Site (username.suitree.trwall.app)
function PublicProfileSite({ username }: { username: string }) {
  return <UsernameResolver username={username} />;
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
          borderBottom: "1px solid #e5e7eb",
          backgroundColor: "white",
          top: 0,
          zIndex: 100,
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        }}
      >
        <Box>
          <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
            <Heading style={{ color: "#1f2937", fontWeight: "700" }}>🌳 SuiTree Admin</Heading>
          </Link>
        </Box>

        <Flex gap="3" align="center">
          <ConnectButton />
        </Flex>
      </Flex>

      {/* Admin routes */}
      <Routes>
        <Route path="/" element={<DemoPage />} />
        <Route path="/create" element={<ProfileEditor />} />
        <Route path="/edit/:objectId" element={<ProfileEditor />} />
        <Route path="/profile/:objectId" element={<ProfileViewWrapper />} />
        <Route path="/demo" element={<DemoPage />} />
        <Route path="/new-demo" element={<DemoPage />} />
        <Route path="/subdomain-test" element={<SubdomainTest />} />
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
        <Card style={{ backgroundColor: "white", boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}>
          <Flex justify="center" py="6">
            <Text style={{ color: "#6b7280", fontWeight: "500" }}>Loading...</Text>
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

