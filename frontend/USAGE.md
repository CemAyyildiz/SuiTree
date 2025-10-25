# SuiTree Usage Guide

## Overview

SuiTree is your decentralized link-in-bio solution on the Sui blockchain. Here's how to use it:

## Application Flow

### 1. Home Page (`/`)

**When Not Connected:**
- Shows welcome screen with SuiTree branding
- Prompts to connect wallet

**When Connected:**
- Displays all your LinkTreeProfile objects
- Each profile card shows:
  - Title and bio
  - Number of links
  - View count
  - "View" and "Edit" buttons
- "Create New Profile" button at the top

### 2. Create Profile (`/create`)

**Form Fields:**
- **Title**: Your name or brand
- **Avatar**: IPFS CID (e.g., `QmXXX...`) or direct URL
- **Bio**: Short description about yourself
- **Theme Settings**:
  - Background Color (color picker)
  - Text Color (color picker)
  - Button Color (color picker)
  - Font Style (text input)

**Actions:**
- Click "Create Profile" to mint a new LinkTreeProfile NFT
- Transaction will be signed via your wallet
- Redirects to home page after success

**Note:** Links can only be added AFTER profile creation via the edit page

### 3. Edit Profile (`/edit/:objectId`)

**All creation fields plus:**

**Link Management:**
- **Add Link**: Opens prompts for label and URL
- **Edit Link**: Click "Edit" on existing link
- **Remove Link**: Click "Remove" to delete a link

**Transactions:**
- Each action (update title, bio, avatar, theme, add/edit/remove link) creates a separate transaction
- You must own the profile to edit it

**Smart Contract Functions Used:**
- `update_title` - Change profile title
- `update_avatar` - Change avatar CID/URL
- `update_bio` - Update bio text
- `update_theme` - Change all theme settings at once
- `add_link` - Add new link
- `update_link` - Modify existing link by index
- `remove_link` - Delete link by index

### 4. View Profile (`/profile/:objectId`)

**Public View:**
- Anyone can access this page with the object ID
- No wallet connection required
- Displays:
  - Avatar (circular with theme border)
  - Title (with verification badge if verified)
  - Bio
  - Clickable link cards
  - View count
  - "Powered by SuiTree" footer

**Theme Applied:**
- Background color sets page background
- Text color for all text elements
- Button color for link cards
- Font style for headings and text

**Sharing:**
- Copy the URL: `/profile/0xYOUR_OBJECT_ID`
- Share on social media, QR codes, anywhere!

## Data Structure

### LinkTreeProfile Object
```typescript
{
  id: { id: "0x..." },           // Unique object ID
  owner: "0x...",                // Your wallet address
  title: "Your Name",            // Display name
  avatar_cid: "QmXXX...",       // IPFS CID or URL
  bio: "About me",              // Description
  links: [                       // Array of links
    {
      label: "Twitter",
      url: "https://twitter.com/..."
    }
  ],
  theme: {                       // Customization
    background_color: "#ffffff",
    text_color: "#000000",
    button_color: "#0066cc",
    font_style: "Arial"
  },
  verified: false,              // Verification status
  view_count: "123"             // Number of views
}
```

## Reading Objects from Sui

The app uses `@mysten/dapp-kit` hooks to interact with Sui:

### Get Owned Profiles (HomePage)
```typescript
const objects = await suiClient.getOwnedObjects({
  owner: account.address,
  options: {
    showContent: true,
    showType: true,
  },
});
```

### Get Specific Profile (ProfileView/Editor)
```typescript
const response = await suiClient.getObject({
  id: objectId,
  options: {
    showContent: true,
    showType: true,
  },
});
```

## Creating Transactions

### Mint New Profile
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

### Update Profile
```typescript
const tx = new Transaction();

// Multiple updates in one transaction
tx.moveCall({
  target: `${PACKAGE_ID}::contrat::update_title`,
  arguments: [tx.object(objectId), tx.pure.string(newTitle)],
});

tx.moveCall({
  target: `${PACKAGE_ID}::contrat::update_theme`,
  arguments: [
    tx.object(objectId),
    tx.pure.string(backgroundColor),
    tx.pure.string(textColor),
    tx.pure.string(buttonColor),
    tx.pure.string(fontStyle),
  ],
});

signAndExecuteTransaction({ transaction: tx });
```

## Advanced Features

### Name Registry (Optional)

The smart contract includes a NameRegistry for human-readable names:

**Register a Name:**
```typescript
tx.moveCall({
  target: `${PACKAGE_ID}::contrat::register_name`,
  arguments: [
    tx.object(REGISTRY_ID),
    tx.object(profileObjectId),
    tx.pure.string("myusername"),
  ],
});
```

**Resolve Name to Object ID:**
```typescript
const profileId = await suiClient.devInspectTransactionBlock({
  sender: account.address,
  transactionBlock: tx.moveCall({
    target: `${PACKAGE_ID}::contrat::resolve_name`,
    arguments: [
      tx.object(REGISTRY_ID),
      tx.pure.string("myusername"),
    ],
  }),
});
```

**To Implement:**
1. Add name input in ProfileEditor
2. Call `register_name` after profile creation
3. Add name-based routing: `/u/username` → resolve → redirect to `/profile/objectId`
4. Display registered name on profile page

### View Counter

To increment views when someone visits:
```typescript
const tx = new Transaction();
tx.moveCall({
  target: `${PACKAGE_ID}::contrat::increment_views`,
  arguments: [tx.object(profileObjectId)],
});
signAndExecuteTransaction({ transaction: tx });
```

Note: This requires a transaction and gas fees, so consider:
- Only increment on page load, not refresh
- Use cookies/localStorage to track unique views
- Or skip it for public viewing (let view count be manually updated)

## Tips & Best Practices

1. **Avatar Images:**
   - Use IPFS for decentralized storage
   - Services: Pinata, NFT.Storage, Web3.Storage
   - Or use direct URLs (https://...)

2. **Theme Design:**
   - Test contrast between text and background
   - Ensure button color stands out
   - Preview changes before saving (requires transaction)

3. **Link Organization:**
   - Put most important links at the top
   - Use clear, descriptive labels
   - Test all URLs before publishing

4. **Gas Optimization:**
   - Batch multiple profile updates in one transaction
   - Only update fields that changed
   - Consider gas costs when adding many links

5. **Sharing:**
   - Create short URLs with services like bit.ly
   - Generate QR codes for physical media
   - Add to social media bios

## Troubleshooting

**"Please connect your wallet"**
- Install Sui Wallet browser extension
- Connect wallet in the app
- Ensure wallet is unlocked

**"Profile not found"**
- Verify object ID is correct
- Check you're on the right network (devnet/testnet/mainnet)
- Object might be deleted or transferred

**Transaction Failed**
- Insufficient SUI for gas fees
- Not the owner of the profile
- Network congestion (try again)
- Wrong network in wallet vs app

**Links Not Showing**
- Links must be added after profile creation
- Use edit page to manage links
- Check transaction was successful

## Next Steps

1. Deploy your smart contract to testnet/mainnet
2. Update `constants.ts` with real Package ID
3. Test profile creation and editing
4. Share your profile link!
5. (Optional) Implement name registry features
6. (Optional) Add custom domain

Enjoy your decentralized link-in-bio! 🌳

