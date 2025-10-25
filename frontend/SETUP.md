# SuiTree Frontend Setup Guide

## Prerequisites

1. Node.js and pnpm installed
2. A Sui wallet (Sui Wallet browser extension)
3. Deployed smart contract on Sui network

## Configuration

### 1. Deploy the Smart Contract

First, deploy the contract from the `Contrat` directory:

```bash
cd ../Contrat
sui client publish --gas-budget 100000000
```

After deployment, note down:
- **Package ID**: The published package ID (looks like `0x...`)
- **Registry Object ID**: The shared NameRegistry object ID created during init

### 2. Update Frontend Constants

Edit `src/constants.ts` and replace the placeholder values:

```typescript
export const PACKAGE_ID = "0xYOUR_PACKAGE_ID_HERE";
export const REGISTRY_ID = "0xYOUR_REGISTRY_OBJECT_ID_HERE";
```

### 3. Install Dependencies

```bash
pnpm install
```

### 4. Run Development Server

```bash
pnpm dev
```

The app will be available at `http://localhost:5173`

## Features

### Main Page (`/`)
- Connect wallet with ConnectButton from @mysten/dapp-kit
- View all your LinkTree profiles
- Navigate to create new profile or edit existing ones

### Create Profile (`/create`)
- Create a new LinkTreeProfile object
- Set title, avatar (IPFS CID or URL), and bio
- Customize theme colors and font
- Add links (in edit mode after creation)

### Edit Profile (`/edit/:objectId`)
- Update profile information
- Manage links (add, edit, remove)
- Update theme settings
- All changes use transactions via dApp Kit

### View Profile (`/profile/:objectId`)
- Public view of any profile by object ID
- Displays avatar, title, bio, and clickable links
- Uses custom theme colors
- Can be shared with anyone

## Smart Contract Functions Used

- `mint_profile`: Create new profile
- `update_title`: Update profile title
- `update_avatar`: Update avatar CID
- `update_bio`: Update bio text
- `update_theme`: Update theme colors and font
- `add_link`: Add new link to profile
- `update_link`: Modify existing link
- `remove_link`: Delete a link

## Dynamic Fields (Optional)

The contract supports registering human-readable names for profiles using the NameRegistry:

```typescript
// Register a name for your profile
register_name(registry, profile, "myusername")

// Resolve a name to get profile ID
resolve_name(registry, "myusername")
```

To implement this in the UI, you can:
1. Add a name registration form in ProfileEditor
2. Create a name-based profile lookup in ProfileView
3. Use the REGISTRY_ID from constants

## Network Configuration

The app is configured to work with:
- Devnet (default)
- Testnet
- Mainnet

Change network in `src/networkConfig.ts` or via wallet settings.

## Useful Links

- [dApp Kit Documentation](https://sdk.mystenlabs.com/dapp-kit/create-dapp)
- [TypeScript SDK](https://sdk.mystenlabs.com/typescript)
- [useSuiClientQuery Hook](https://sdk.mystenlabs.com/typedoc/functions/_mysten_dapp-kit.useSuiClientQuery.html)
- [useSuiClientQueries Hook](https://sdk.mystenlabs.com/typedoc/functions/_mysten_dapp-kit.useSuiClientQueries.html)

## Troubleshooting

### "Profile not found" error
- Make sure the object ID is correct
- Verify the object exists on the current network
- Check that PACKAGE_ID in constants.ts matches your deployed package

### Transaction failures
- Ensure you have enough SUI for gas fees
- Verify you're the owner of the profile you're trying to edit
- Check that all required fields are filled

### Network issues
- Make sure your wallet is connected to the same network as your deployed contract
- Try switching networks in your wallet and refresh the page

