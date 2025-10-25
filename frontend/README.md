# 🌳 SuiTree - Decentralized LinkTree on Sui

SuiTree is a decentralized link-in-bio application built on the Sui blockchain. Create your personalized profile page with custom links, themes, and share it with anyone!

## Features

- 🔗 **Custom Links**: Add unlimited links to your social media, websites, and content
- 🎨 **Theme Customization**: Personalize colors, fonts, and style
- 👤 **Profile Management**: Avatar, bio, and title customization
- 🔒 **Decentralized**: All data stored on Sui blockchain as owned objects
- 📱 **Responsive Design**: Beautiful UI that works on all devices
- 🆔 **Name Registry**: Optional human-readable names via Dynamic Fields

## Tech Stack

- [React](https://react.dev/) - UI framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Vite](https://vitejs.dev/) - Build tooling
- [Radix UI](https://www.radix-ui.com/) - UI components
- [@mysten/dapp-kit](https://sdk.mystenlabs.com/dapp-kit) - Sui wallet integration
- [@mysten/sui](https://sdk.mystenlabs.com/typescript) - Sui TypeScript SDK
- [React Router](https://reactrouter.com/) - Client-side routing
- [pnpm](https://pnpm.io/) - Package management

## Getting Started

### 1. Deploy the Smart Contract

First, deploy the contract from the parent directory:

```bash
cd ../Contrat
sui client publish --gas-budget 100000000
```

Note the Package ID and Registry Object ID from the deployment output.

### 2. Configure Constants

Update `src/constants.ts` with your deployed contract details:

```typescript
export const PACKAGE_ID = "0xYOUR_PACKAGE_ID";
export const REGISTRY_ID = "0xYOUR_REGISTRY_ID";
```

### 3. Install Dependencies

```bash
pnpm install
```

### 4. Run Development Server

```bash
pnpm dev
```

Visit `http://localhost:5173` to see your app!

## Project Structure

```
src/
├── App.tsx              # Main app with routing
├── HomePage.tsx         # Dashboard showing owned profiles
├── ProfileEditor.tsx    # Create/edit profile component
├── ProfileView.tsx      # Public profile view
├── constants.ts         # Contract configuration
├── types.ts            # TypeScript interfaces
├── networkConfig.ts    # Sui network configuration
└── main.tsx            # App entry point
```

## Usage

### Creating a Profile

1. Connect your Sui wallet
2. Click "Create New Profile"
3. Fill in title, avatar URL/IPFS CID, and bio
4. Customize theme colors
5. Click "Create Profile" to mint on-chain

### Managing Links

1. Go to your profile editor
2. Click "Add Link" to create new links
3. Edit or remove existing links
4. All changes are recorded on-chain via transactions

### Sharing Your Profile

Share your profile URL with the format:
```
https://your-domain.com/profile/0xYOUR_PROFILE_OBJECT_ID
```

## Building for Production

```bash
pnpm build
```

The built files will be in the `dist` directory.

## Learn More

- [Setup Guide](./SETUP.md) - Detailed setup instructions
- [dApp Kit Docs](https://sdk.mystenlabs.com/dapp-kit)
- [Sui TypeScript SDK](https://sdk.mystenlabs.com/typescript)
- [Move Smart Contract](../Contrat/sources/contrat.move)

## License

MIT
