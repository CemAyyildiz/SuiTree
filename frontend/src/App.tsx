import { ConnectButton } from "@mysten/dapp-kit";
import { Box, Flex, Heading } from "@radix-ui/themes";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { HomePage } from "./HomePage";
import { ProfileEditor } from "./ProfileEditor";
import { ProfileView } from "./ProfileView";
import { UsernameResolver } from "./UsernameResolver";

function App() {
  return (
    <BrowserRouter>
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
            <Heading>🌳 SuiTree</Heading>
          </Link>
        </Box>

        <Box>
          <ConnectButton />
        </Box>
      </Flex>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/create" element={<ProfileEditor />} />
        <Route path="/edit/:objectId" element={<ProfileEditor />} />
        <Route path="/profile/:objectId" element={<ProfileView />} />
        <Route path="/:username" element={<UsernameResolver />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
