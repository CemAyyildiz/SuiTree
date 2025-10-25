# ⚡ SuiTree Quick Start

## What Was Built

Your frontend has been transformed into a **complete Linktree-style dApp** with:

✅ **Wallet Connection** - Connect Sui wallet to manage profiles
✅ **Profile Creation** - Mint LinkTreeProfile NFTs on-chain  
✅ **Profile Editing** - Update title, avatar, bio, theme, and links
✅ **Link Management** - Add, edit, and remove links via transactions
✅ **Public Profiles** - View profiles by object ID (no wallet needed)
✅ **Theme Customization** - Custom colors and fonts per profile
✅ **Responsive UI** - Beautiful Radix UI components

## Files Created

```
frontend/src/
├── App.tsx              ✨ Main app with routing
├── HomePage.tsx         ✨ Dashboard with owned profiles
├── ProfileEditor.tsx    ✨ Create/edit profiles & links
├── ProfileView.tsx      ✨ Public profile display
├── constants.ts         ✨ Contract configuration
├── types.ts            ✨ TypeScript types
└── (existing files remain unchanged)

frontend/
├── SETUP.md            📖 Detailed setup instructions
├── USAGE.md            📖 Usage guide with examples
└── README.md           📖 Updated project readme

Root/
├── SUMMARY.md          📖 Complete project overview
├── ARCHITECTURE.md     📖 Technical architecture
├── DEPLOYMENT_CHECKLIST.md  📖 Deployment guide
└── QUICKSTART.md       📖 This file!
```

## 🚀 Get Started in 3 Steps

### Step 1: Deploy Smart Contract

```bash
cd Contrat
sui client publish --gas-budget 100000000
```

**Save these from output:**
- Package ID (e.g., `0x123abc...`)
- Registry Object ID (shared NameRegistry)

### Step 2: Configure Frontend

```bash
cd ../frontend
```

Edit `src/constants.ts`:
```typescript
export const PACKAGE_ID = "0xYOUR_PACKAGE_ID";
export const REGISTRY_ID = "0xYOUR_REGISTRY_ID";
```

### Step 3: Run App

```bash
pnpm install  # (already done)
pnpm dev      # App now running at http://localhost:5173
```

## 🎯 How to Use

### Create Your First Profile

1. **Connect Wallet** - Click "Connect" button
2. **Create Profile** - Click "+ Create New Profile"
3. **Fill Form**:
   - Title: "Your Name"
   - Avatar: IPFS CID or image URL
   - Bio: "Your bio here"
   - Theme: Pick colors
4. **Mint** - Click "Create Profile" and sign transaction
5. **Done!** - Profile appears in "My Profiles"

### Add Links

1. **Edit Profile** - Click "Edit" on your profile
2. **Add Link** - Click "+ Add Link"
3. **Enter Details** - Label and URL in prompts
4. **Sign Transaction** - Approve in wallet
5. **Repeat** - Add more links!

### Share Your Profile

1. **View Profile** - Click "View" on your profile
2. **Copy URL** - Share `/profile/0xYOUR_OBJECT_ID`
3. **Anyone can view** - No wallet needed!

## 📋 Feature Checklist

### Implemented ✅
- [x] Wallet connection (dApp Kit)
- [x] Profile creation (mint_profile)
- [x] Profile listing (getOwnedObjects)
- [x] Profile editing (update functions)
- [x] Link management (add/edit/remove)
- [x] Theme customization
- [x] Public profile view
- [x] Responsive design
- [x] Client-side routing
- [x] TypeScript types

### Ready But Not in UI ⚪
- [ ] Name registration (register_name)
- [ ] Name resolution (resolve_name)
- [ ] View counter (increment_views)
- [ ] Profile transfer
- [ ] Verification badge

## 🛠️ Development Commands

```bash
# Development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview

# Lint code
pnpm lint

# Type check
pnpm tsc
```

## 📁 Key Code Snippets

### Reading Profile from Blockchain

```typescript
const response = await suiClient.getObject({
  id: objectId,
  options: {
    showContent: true,
    showType: true,
  },
});
```

### Creating Transaction

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

### Getting Owned Objects

```typescript
const objects = await suiClient.getOwnedObjects({
  owner: account.address,
  options: {
    showContent: true,
    showType: true,
  },
});
```

## 🎨 Customization Tips

### Change Theme
- Default is dark mode (set in `main.tsx`)
- Change to light: `<Theme appearance="light">`

### Add Features
- Name registry UI in ProfileEditor
- Custom domain mapping
- Analytics dashboard
- Social sharing buttons

### Styling
- Uses Radix UI themes
- Customize in `@radix-ui/themes` imports
- Add custom CSS as needed

## 🔧 Troubleshooting

**App won't start?**
```bash
rm -rf node_modules pnpm-lock.yaml
pnpm install
pnpm dev
```

**Transaction fails?**
- Check you have SUI for gas
- Verify correct network
- Confirm PACKAGE_ID is correct
- Check wallet is unlocked

**Profile not found?**
- Verify object ID is correct
- Check same network as deployment
- Use Sui Explorer to verify object exists

**Build errors?**
```bash
pnpm build
# Fix any TypeScript errors shown
```

## 📚 Learn More

- **Setup Guide**: [SETUP.md](frontend/SETUP.md)
- **Usage Guide**: [USAGE.md](frontend/USAGE.md)
- **Architecture**: [ARCHITECTURE.md](ARCHITECTURE.md)
- **Deployment**: [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)
- **Summary**: [SUMMARY.md](SUMMARY.md)

## 🔗 Important Links

- [dApp Kit Docs](https://sdk.mystenlabs.com/dapp-kit/create-dapp)
- [Sui TypeScript SDK](https://sdk.mystenlabs.com/typescript)
- [useSuiClientQuery](https://sdk.mystenlabs.com/typedoc/functions/_mysten_dapp-kit.useSuiClientQuery.html)
- [useSuiClientQueries](https://sdk.mystenlabs.com/typedoc/functions/_mysten_dapp-kit.useSuiClientQueries.html)
- [Sui Explorer](https://suiscan.xyz/)

## 🎉 Next Steps

1. ✅ Deploy contract to testnet
2. ✅ Update constants.ts
3. ✅ Create your profile
4. ✅ Add links
5. ✅ Customize theme
6. ✅ Share with friends!
7. 🚀 Deploy to production
8. 📱 Build mobile app (optional)
9. 🌟 Add advanced features
10. 💰 Monetize (optional)

---

**Have fun building on Sui! 🌳✨**

Need help? Check the other documentation files or open an issue!

