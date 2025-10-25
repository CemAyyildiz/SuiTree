# 🏗️ SuiTree Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                         USER                                │
│                    (Sui Wallet)                            │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                   FRONTEND (React)                          │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  HomePage         ProfileEditor      ProfileView      │  │
│  │    ↓                   ↓                  ↓           │  │
│  │  Dashboard       Create/Edit         Public View      │  │
│  └──────────────────────────────────────────────────────┘  │
│                          ↓                                  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │          @mysten/dapp-kit + @mysten/sui              │  │
│  │   • useCurrentAccount (wallet info)                  │  │
│  │   • useSuiClient (RPC queries)                       │  │
│  │   • useSignAndExecuteTransaction (txs)               │  │
│  │   • Transaction (build move calls)                   │  │
│  └──────────────────────────────────────────────────────┘  │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                  SUI BLOCKCHAIN                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │           Smart Contract (Move)                      │  │
│  │                                                      │  │
│  │  Module: contrat::contrat                          │  │
│  │                                                      │  │
│  │  Objects:                                           │  │
│  │  • LinkTreeProfile (owned by users)                │  │
│  │  • NameRegistry (shared object)                    │  │
│  │                                                      │  │
│  │  Functions:                                         │  │
│  │  • mint_profile                                     │  │
│  │  • update_title/avatar/bio/theme                  │  │
│  │  • add_link/update_link/remove_link               │  │
│  │  • register_name/resolve_name                     │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow Diagrams

### Creating a Profile

```
User                Frontend               Wallet              Blockchain
  │                    │                     │                     │
  │ Click "Create"     │                     │                     │
  │───────────────────>│                     │                     │
  │                    │                     │                     │
  │ Fill Form          │                     │                     │
  │───────────────────>│                     │                     │
  │                    │                     │                     │
  │ Click "Create      │                     │                     │
  │  Profile"          │                     │                     │
  │───────────────────>│                     │                     │
  │                    │ Build Transaction   │                     │
  │                    │ (mint_profile)      │                     │
  │                    │─────────────────────>│                     │
  │                    │                     │                     │
  │                    │ Request Signature   │                     │
  │<───────────────────┴─────────────────────│                     │
  │                                          │                     │
  │ Approve in Wallet                        │                     │
  │─────────────────────────────────────────>│                     │
  │                                          │                     │
  │                                          │ Submit Transaction  │
  │                                          │────────────────────>│
  │                                          │                     │
  │                                          │ Profile NFT Created │
  │                                          │<────────────────────│
  │                                          │                     │
  │ Success! Redirect to Home                │                     │
  │<─────────────────────────────────────────│                     │
```

### Viewing a Profile

```
Visitor             Frontend               Blockchain
  │                    │                       │
  │ Visit URL          │                       │
  │ /profile/:id       │                       │
  │───────────────────>│                       │
  │                    │                       │
  │                    │ getObject(objectId)   │
  │                    │──────────────────────>│
  │                    │                       │
  │                    │ Profile Data          │
  │                    │<──────────────────────│
  │                    │                       │
  │                    │ Parse & Render        │
  │                    │ (with theme)          │
  │                    │                       │
  │ View Profile       │                       │
  │<───────────────────│                       │
  │                    │                       │
  │ Click Link         │                       │
  │───────────────────>│                       │
  │                    │                       │
  │ Open External URL  │                       │
  │<───────────────────│                       │
```

### Editing Profile & Managing Links

```
Owner               Frontend               Wallet              Blockchain
  │                    │                     │                     │
  │ Visit /edit/:id    │                     │                     │
  │───────────────────>│                     │                     │
  │                    │                     │                     │
  │                    │ Load Profile        │                     │
  │                    │─────────────────────────────────────────>│
  │                    │                     │                     │
  │                    │ Profile Data        │                     │
  │                    │<─────────────────────────────────────────│
  │                    │                     │                     │
  │ View Form          │                     │                     │
  │ (pre-filled)       │                     │                     │
  │<───────────────────│                     │                     │
  │                    │                     │                     │
  │ Update Title       │                     │                     │
  │───────────────────>│                     │                     │
  │                    │                     │                     │
  │ Update Theme       │                     │                     │
  │───────────────────>│                     │                     │
  │                    │                     │                     │
  │ Click "Add Link"   │                     │                     │
  │───────────────────>│                     │                     │
  │                    │                     │                     │
  │ Enter Label & URL  │                     │                     │
  │───────────────────>│                     │                     │
  │                    │                     │                     │
  │ Click "Save"       │                     │                     │
  │───────────────────>│                     │                     │
  │                    │ Build Transaction   │                     │
  │                    │ • update_title      │                     │
  │                    │ • update_theme      │                     │
  │                    │ • add_link          │                     │
  │                    │─────────────────────>│                     │
  │                    │                     │                     │
  │                    │ Sign & Execute      │                     │
  │                    │<────────────────────│                     │
  │                    │                     │                     │
  │                    │                     │ Execute on Chain    │
  │                    │                     │────────────────────>│
  │                    │                     │                     │
  │                    │                     │ Updated!            │
  │                    │                     │<────────────────────│
  │                    │                     │                     │
  │ Success! Redirect  │                     │                     │
  │<───────────────────│                     │                     │
```

## Component Architecture

### Frontend Components

```
App.tsx (Router)
│
├─ Header
│  ├─ Logo (Link to /)
│  └─ ConnectButton (dApp Kit)
│
└─ Routes
   │
   ├─ / → HomePage
   │     ├─ Connect Wallet Check
   │     ├─ Load Owned Profiles
   │     │  └─ useSuiClient.getOwnedObjects()
   │     └─ Profile Cards
   │        ├─ View Button → /profile/:id
   │        └─ Edit Button → /edit/:id
   │
   ├─ /create → ProfileEditor (create mode)
   │     ├─ Form (title, avatar, bio)
   │     ├─ Theme Picker
   │     └─ Create Button
   │        └─ mint_profile transaction
   │
   ├─ /edit/:objectId → ProfileEditor (edit mode)
   │     ├─ Load Profile
   │     │  └─ useSuiClient.getObject()
   │     ├─ Form (pre-filled)
   │     ├─ Link Manager
   │     │  ├─ Add Link → add_link tx
   │     │  ├─ Edit Link → update_link tx
   │     │  └─ Remove Link → remove_link tx
   │     └─ Save Button
   │        └─ Batch update transactions
   │
   └─ /profile/:objectId → ProfileView
         ├─ Load Profile (read-only)
         │  └─ useSuiClient.getObject()
         ├─ Apply Theme Styling
         ├─ Avatar
         ├─ Title & Bio
         ├─ Link Cards (clickable)
         └─ View Count
```

## Smart Contract Structure

```
contrat::contrat
│
├─ Structs
│  ├─ LinkTreeProfile (key, store)
│  │  ├─ id: UID
│  │  ├─ owner: address
│  │  ├─ title: String
│  │  ├─ avatar_cid: String
│  │  ├─ bio: String
│  │  ├─ links: vector<Link>
│  │  ├─ theme: Theme
│  │  ├─ verified: bool
│  │  └─ view_count: u64
│  │
│  ├─ Link (store, copy, drop)
│  │  ├─ label: String
│  │  └─ url: String
│  │
│  ├─ Theme (store, copy, drop)
│  │  ├─ background_color: String
│  │  ├─ text_color: String
│  │  ├─ button_color: String
│  │  └─ font_style: String
│  │
│  ├─ NameRegistry (key) - Shared Object
│  │  └─ id: UID (with dynamic fields)
│  │
│  └─ ProfileReference (store, copy, drop)
│     └─ profile_id: ID
│
├─ Entry Functions (callable from frontend)
│  ├─ mint_profile(title, avatar, bio)
│  ├─ update_title(profile, title)
│  ├─ update_avatar(profile, cid)
│  ├─ update_bio(profile, bio)
│  ├─ update_theme(profile, bg, text, btn, font)
│  ├─ add_link(profile, label, url)
│  ├─ update_link(profile, index, label, url)
│  ├─ remove_link(profile, index)
│  ├─ register_name(registry, profile, name)
│  ├─ unregister_name(registry, name)
│  ├─ increment_views(profile)
│  └─ transfer_profile(profile, recipient)
│
└─ View Functions (read-only)
   ├─ get_owner(profile)
   ├─ get_title(profile)
   ├─ get_avatar_cid(profile)
   ├─ get_bio(profile)
   ├─ get_links_count(profile)
   ├─ get_link(profile, index)
   ├─ get_theme(profile)
   ├─ get_view_count(profile)
   ├─ is_verified(profile)
   ├─ resolve_name(registry, name)
   └─ get_link_label/url(link)
```

## Technology Stack

### Blockchain Layer
```
Sui Blockchain
├─ Move Language (Smart Contracts)
├─ Object Model (Owned & Shared Objects)
├─ Dynamic Fields (Name Registry)
└─ Transaction System
```

### Frontend Layer
```
React Application
├─ React 18 (UI Framework)
├─ TypeScript (Type Safety)
├─ Vite (Build Tool)
├─ React Router (Routing)
├─ Radix UI (Components)
│  ├─ Theme Provider
│  ├─ Card, Button, TextField
│  └─ Flex, Box, Container
├─ @mysten/dapp-kit (Sui Integration)
│  ├─ Wallet Connection
│  ├─ Account Management
│  ├─ Transaction Signing
│  └─ Network Config
└─ @mysten/sui (TypeScript SDK)
   ├─ SuiClient (RPC)
   ├─ Transaction Builder
   └─ Type Definitions
```

## State Management

### Global State (via dApp Kit)
- Connected wallet account
- Network selection (devnet/testnet/mainnet)
- SuiClient instance

### Component State
- **HomePage**: Owned profiles list, loading state
- **ProfileEditor**: Form values, profile data, loading state
- **ProfileView**: Profile data, loading state, error state

### On-Chain State
- **LinkTreeProfile Objects**: Owned by users
- **NameRegistry Object**: Shared, contains dynamic fields
- **Dynamic Fields**: Name → ProfileReference mappings

## Security Considerations

### Smart Contract
✅ Owner checks on all mutations
✅ Index bounds checking
✅ Name uniqueness validation
✅ No admin backdoors
✅ Immutable logic after deployment

### Frontend
✅ No private keys in code
✅ All transactions signed by user wallet
✅ Read-only public views
✅ No centralized data storage
✅ HTTPS recommended for deployment

## Performance Optimizations

### Frontend
- Lazy loading routes (can be added)
- Memoization for expensive renders
- Batching multiple updates in single transaction
- Caching RPC responses (React Query)

### Blockchain
- Efficient struct packing
- Vector operations for links
- Minimal storage in objects
- Dynamic fields for optional features

## Scalability

### Current Limits
- Unlimited profiles per user
- Unlimited links per profile (gas costs increase)
- Unlimited names in registry
- View count: u64 max (~18 quintillion)

### Future Scaling
- Paginated profile loading
- Link categories/folders
- Profile templates
- Bulk operations

---

**This architecture provides a solid foundation for a decentralized social platform on Sui!** 🌳

