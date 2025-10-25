# 🌳 SuiTree - Project Summary

## What We Built

A complete **decentralized Linktree alternative** on Sui blockchain with a modern React frontend.

## Architecture

### Smart Contract (Move)
- **Location:** `Contrat/sources/contrat.move`
- **Module:** `contrat::contrat`
- **Key Features:**
  - LinkTreeProfile NFT objects (owned by users)
  - Links management (add, update, remove)
  - Theme customization (colors, fonts)
  - Profile metadata (title, avatar, bio)
  - Shared NameRegistry for name resolution via Dynamic Fields
  - View counter functionality

### Frontend (React + TypeScript)
- **Location:** `frontend/src/`
- **Tech Stack:**
  - React 18 + TypeScript
  - Vite (build tool)
  - @mysten/dapp-kit (wallet connection)
  - @mysten/sui (TypeScript SDK)
  - React Router (routing)
  - Radix UI (components)

## Pages & Components

### 1. HomePage (`HomePage.tsx`)
- Dashboard showing all user's profiles
- Fetches owned LinkTreeProfile objects using `useSuiClient`
- Navigation to create/edit/view profiles
- Requires wallet connection

### 2. ProfileEditor (`ProfileEditor.tsx`)
- Create new profiles (`/create`)
- Edit existing profiles (`/edit/:objectId`)
- Form for title, avatar, bio, theme
- Link management (add/edit/remove)
- Transaction building with `Transaction` from @mysten/sui
- Uses `useSignAndExecuteTransaction` hook

### 3. ProfileView (`ProfileView.tsx`)
- Public profile view (`/profile/:objectId`)
- Fetches profile data via `getObject` RPC call
- Displays themed profile page
- No wallet required (read-only)
- Clickable link cards

### 4. App (`App.tsx`)
- Main app with routing
- Header with ConnectButton
- Route definitions

## Key Implementation Details

### Reading Data (RPC)

**Get Owned Objects:**
```typescript
const objects = await suiClient.getOwnedObjects({
  owner: account.address,
  options: { showContent: true, showType: true },
});
```

**Get Specific Object:**
```typescript
const response = await suiClient.getObject({
  id: objectId,
  options: { showContent: true, showType: true },
});
```

### Writing Data (Transactions)

**Create Profile:**
```typescript
const tx = new Transaction();
tx.moveCall({
  target: `${PACKAGE_ID}::contrat::mint_profile`,
  arguments: [
    tx.pure.string(title),
    tx.pure.string(avatarCid),
    tx.pure.string(bio),
  ],
});
signAndExecuteTransaction({ transaction: tx });
```

**Update Profile:**
```typescript
tx.moveCall({
  target: `${PACKAGE_ID}::contrat::update_title`,
  arguments: [tx.object(objectId), tx.pure.string(newTitle)],
});
```

### Dynamic Fields (Name Registry)

The contract includes a shared NameRegistry object that uses Dynamic Fields to map names to profile IDs:

```move
public entry fun register_name(
    registry: &mut NameRegistry,
    profile: &LinkTreeProfile,
    name: String,
    _ctx: &mut TxContext
) {
    let reference = ProfileReference { profile_id: object::id(profile) };
    dynamic_field::add(&mut registry.id, name, reference);
}
```

This enables:
- Human-readable profile URLs: `/u/username`
- Name-based profile lookup
- Unique username registration

## File Structure

```
SuiTree/
├── Contrat/                        # Smart contract
│   ├── Move.toml                   # Package manifest
│   └── sources/
│       └── contrat.move           # Main contract
│
└── frontend/                       # React app
    ├── package.json               # Dependencies
    ├── README.md                  # Main readme
    ├── SETUP.md                   # Setup guide
    ├── USAGE.md                   # Usage guide
    └── src/
        ├── main.tsx               # Entry point
        ├── App.tsx                # Router & layout
        ├── HomePage.tsx           # Profile dashboard
        ├── ProfileEditor.tsx      # Create/edit profiles
        ├── ProfileView.tsx        # Public profile view
        ├── constants.ts           # Contract config
        ├── types.ts               # TypeScript types
        └── networkConfig.ts       # Sui network config
```

## Data Flow

### Creating a Profile

1. User connects wallet (dApp Kit)
2. Navigates to `/create`
3. Fills form (title, avatar, bio, theme)
4. Clicks "Create Profile"
5. Transaction built with `Transaction`
6. User signs via wallet
7. Profile NFT minted and transferred to user
8. Redirects to homepage

### Viewing a Profile

1. Anyone visits `/profile/:objectId`
2. App calls `suiClient.getObject(objectId)`
3. Parses profile data from response
4. Renders themed profile page
5. Links are clickable
6. (Optional) View count incremented

### Editing a Profile

1. Owner navigates to `/edit/:objectId`
2. App loads existing profile data
3. Pre-fills form with current values
4. User makes changes
5. Click "Save Changes"
6. Multiple update transactions batched together
7. User signs transaction
8. Profile updated on-chain
9. Redirects to homepage

## Smart Contract Functions

### Profile Management
- `mint_profile(title, avatar_cid, bio)` - Create new profile
- `transfer_profile(profile, recipient)` - Transfer ownership
- `update_title(profile, new_title)` - Update title
- `update_avatar(profile, new_avatar_cid)` - Update avatar
- `update_bio(profile, new_bio)` - Update bio
- `update_theme(profile, bg, text, button, font)` - Update theme

### Link Management
- `add_link(profile, label, url)` - Add new link
- `update_link(profile, index, label, url)` - Update link
- `remove_link(profile, index)` - Remove link

### Name Registry
- `register_name(registry, profile, name)` - Register name
- `resolve_name(registry, name)` - Get profile ID from name
- `unregister_name(registry, name)` - Remove name

### Other
- `increment_views(profile)` - Increment view count

## Features Implemented

✅ Wallet connection (dApp Kit ConnectButton)
✅ Profile creation (mint NFT)
✅ Profile listing (owned objects)
✅ Profile editing (transactions)
✅ Link management (add/edit/remove)
✅ Theme customization (colors, fonts)
✅ Public profile view (read-only)
✅ Responsive UI (Radix UI)
✅ Client-side routing (React Router)
✅ TypeScript type safety
✅ Build configuration (Vite)

## Features Available But Not Implemented in UI

⚪ Name registration (smart contract ready)
⚪ Name resolution (smart contract ready)
⚪ View counter increment (requires transaction)
⚪ Profile verification badge (admin function needed)
⚪ Profile transfer UI

## Setup Steps

1. **Deploy Contract:**
   ```bash
   cd Contrat
   sui client publish --gas-budget 100000000
   ```

2. **Note IDs:**
   - Package ID
   - Registry Object ID (from init)

3. **Update Frontend:**
   ```bash
   cd frontend
   # Edit src/constants.ts with your IDs
   pnpm install
   pnpm dev
   ```

4. **Start Building:**
   - Connect wallet at http://localhost:5173
   - Create your first profile
   - Add links and customize theme
   - Share your profile!

## Technologies Used

### Blockchain
- **Sui**: Layer 1 blockchain
- **Move**: Smart contract language
- **Dynamic Fields**: For name registry

### Frontend
- **React 18**: UI library
- **TypeScript**: Type safety
- **Vite**: Build tool & dev server
- **@mysten/dapp-kit**: Sui wallet integration
  - `useCurrentAccount` - Get connected wallet
  - `useSuiClient` - RPC client for queries
  - `useSignAndExecuteTransaction` - Sign & execute txs
  - `ConnectButton` - Wallet connection UI
- **@mysten/sui**: TypeScript SDK
  - `Transaction` - Build transactions
  - `getObject` - Read on-chain data
  - `getOwnedObjects` - Query owned objects
- **React Router**: Client-side routing
- **Radix UI**: Component library

## Links & Resources

- [dApp Kit Documentation](https://sdk.mystenlabs.com/dapp-kit/create-dapp)
- [Sui TypeScript SDK](https://sdk.mystenlabs.com/typescript)
- [useSuiClientQuery Hook](https://sdk.mystenlabs.com/typedoc/functions/_mysten_dapp-kit.useSuiClientQuery.html)
- [useSuiClientQueries Hook](https://sdk.mystenlabs.com/typedoc/functions/_mysten_dapp-kit.useSuiClientQueries.html)
- [Move Language Book](https://move-language.github.io/move/)
- [Sui Documentation](https://docs.sui.io/)

## What Makes This Special

1. **Truly Decentralized**: Profile data stored on-chain, no centralized servers
2. **User-Owned**: Profiles are NFTs owned by users, not the platform
3. **Censorship-Resistant**: No one can delete or modify your profile except you
4. **Transferable**: Profiles can be sold/transferred like any NFT
5. **Composable**: Other dApps can read and display your profile
6. **Theme Customization**: Each profile can have unique styling
7. **Name Registry**: Optional human-readable names using Dynamic Fields

## Next Steps / Extensions

1. **Name-Based URLs**: Implement `/u/username` routing
2. **Custom Domains**: Allow users to point domains to profiles
3. **Analytics**: Track click-through rates on links
4. **Social Features**: Follow, like, comment on profiles
5. **IPFS Integration**: Direct IPFS upload for avatars
6. **QR Code Generation**: Built-in QR codes for sharing
7. **Export**: Export profile to other platforms
8. **Premium Features**: Paid upgrades for verified badges
9. **Templates**: Pre-made themes users can select
10. **Mobile App**: React Native app using same contracts

---

**Built with ❤️ on Sui blockchain**

