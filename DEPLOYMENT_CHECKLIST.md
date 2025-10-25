# 🚀 SuiTree Deployment Checklist

## Pre-Deployment

### 1. Smart Contract Deployment

- [ ] Make sure you have SUI tokens for gas
- [ ] Choose your network (devnet/testnet/mainnet)
- [ ] Navigate to contract directory:
  ```bash
  cd Contrat
  ```
- [ ] Build the contract:
  ```bash
  sui move build
  ```
- [ ] Run tests (if any):
  ```bash
  sui move test
  ```
- [ ] Publish the contract:
  ```bash
  sui client publish --gas-budget 100000000
  ```

### 2. Note Important IDs

After deployment, save these from the output:

- [ ] **Package ID**: Look for "Published Objects" → PackageID
  ```
  Example: 0x1234567890abcdef...
  ```

- [ ] **Registry Object ID**: Look for created objects → NameRegistry (shared object)
  ```
  Example: 0xabcdef1234567890...
  ```

### 3. Update Frontend Configuration

- [ ] Open `frontend/src/constants.ts`
- [ ] Replace `YOUR_PACKAGE_ID_HERE` with your Package ID
- [ ] Replace `YOUR_REGISTRY_OBJECT_ID_HERE` with your Registry Object ID
- [ ] Save the file

Example:
```typescript
export const PACKAGE_ID = "0x1234567890abcdef...";
export const REGISTRY_ID = "0xabcdef1234567890...";
export const MODULE_NAME = "contrat";
```

### 4. Network Configuration

- [ ] Open `frontend/src/main.tsx`
- [ ] Verify `defaultNetwork` matches your deployment:
  ```typescript
  <SuiClientProvider networks={networkConfig} defaultNetwork="testnet">
  ```
- [ ] Options: "devnet", "testnet", "mainnet"

## Frontend Setup

### 5. Install Dependencies

```bash
cd frontend
pnpm install
```

### 6. Test Locally

```bash
pnpm dev
```

- [ ] App starts without errors
- [ ] Visit http://localhost:5173
- [ ] Connect wallet successfully
- [ ] Wallet shows correct network
- [ ] Try creating a test profile
- [ ] Verify transaction succeeds
- [ ] Check profile appears in "My Profiles"
- [ ] Test editing profile
- [ ] Test adding links
- [ ] Test viewing profile in public view
- [ ] Test theme customization

## Production Build

### 7. Build for Production

```bash
pnpm build
```

- [ ] Build completes successfully
- [ ] Check `dist/` folder is created
- [ ] No TypeScript errors
- [ ] No build warnings (optional to fix)

### 8. Test Production Build

```bash
pnpm preview
```

- [ ] App loads correctly
- [ ] All features work as expected
- [ ] Check browser console for errors

## Deployment Options

### Option A: Vercel (Recommended)

1. [ ] Create account at https://vercel.com
2. [ ] Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```
3. [ ] Deploy:
   ```bash
   vercel
   ```
4. [ ] Follow prompts
5. [ ] Note your deployment URL
6. [ ] Set up custom domain (optional)

### Option B: Netlify

1. [ ] Create account at https://netlify.com
2. [ ] Install Netlify CLI:
   ```bash
   npm i -g netlify-cli
   ```
3. [ ] Deploy:
   ```bash
   netlify deploy --prod
   ```
4. [ ] Set build command: `pnpm build`
5. [ ] Set publish directory: `dist`
6. [ ] Note your deployment URL

### Option C: GitHub Pages

1. [ ] Update `vite.config.mts`:
   ```typescript
   export default defineConfig({
     base: '/SuiTree/', // Your repo name
     plugins: [react()],
   });
   ```
2. [ ] Add deployment script to `package.json`:
   ```json
   "scripts": {
     "deploy": "pnpm build && gh-pages -d dist"
   }
   ```
3. [ ] Install gh-pages:
   ```bash
   pnpm add -D gh-pages
   ```
4. [ ] Deploy:
   ```bash
   pnpm deploy
   ```
5. [ ] Enable GitHub Pages in repo settings

### Option D: IPFS (Decentralized Hosting)

1. [ ] Use Fleek, Pinata, or Web3.Storage
2. [ ] Upload `dist` folder
3. [ ] Get IPFS CID
4. [ ] Access via:
   - `https://ipfs.io/ipfs/YOUR_CID`
   - `https://YOUR_CID.ipfs.dweb.link`
5. [ ] Set up ENS or custom domain (optional)

## Post-Deployment

### 9. Verify Production

- [ ] Visit deployed URL
- [ ] Connect wallet on correct network
- [ ] Create a test profile
- [ ] Add links and customize theme
- [ ] Share profile URL with test users
- [ ] Verify public view works without wallet
- [ ] Test on mobile devices
- [ ] Test different wallets (if supported)

### 10. Documentation

- [ ] Update README with live URL
- [ ] Document any environment variables
- [ ] Share contract addresses publicly
- [ ] Create user documentation
- [ ] Add screenshots/video demo

### 11. Security Checklist

- [ ] Contract audited (for mainnet)
- [ ] No hardcoded private keys
- [ ] Environment variables secured
- [ ] HTTPS enabled
- [ ] CSP headers configured (optional)
- [ ] Rate limiting (if using backend)

## Maintenance

### Regular Updates

- [ ] Monitor for Sui SDK updates
- [ ] Update dependencies monthly:
  ```bash
  pnpm update
  ```
- [ ] Check for security vulnerabilities:
  ```bash
  pnpm audit
  ```
- [ ] Monitor gas costs on network
- [ ] Backup important data

### User Support

- [ ] Create help documentation
- [ ] Set up support channel (Discord/Telegram)
- [ ] Monitor for bugs and user feedback
- [ ] Plan feature updates
- [ ] Maintain changelog

## Troubleshooting

### Common Issues

**"Transaction failed"**
- Check user has enough SUI for gas
- Verify correct network in wallet
- Check object IDs are correct
- Review transaction in Sui Explorer

**"Profile not found"**
- Verify PACKAGE_ID is correct
- Check network matches deployment
- Confirm object exists on-chain

**"Build errors"**
- Clear node_modules and reinstall
- Check TypeScript version
- Verify all imports are correct
- Run `pnpm build` to see specific errors

**"Wallet won't connect"**
- Install Sui Wallet extension
- Check wallet is unlocked
- Verify network settings
- Try different browser

## Resources

- **Sui Explorer**: https://suiscan.xyz/ (check transactions)
- **Sui Faucet**: https://discord.com/channels/916379725201563759/971488439931392130 (devnet/testnet)
- **Sui Status**: https://status.sui.io/ (network health)
- **Community**: https://discord.gg/sui (help & support)

## Marketing Checklist (Optional)

- [ ] Create demo video
- [ ] Write launch announcement
- [ ] Share on Twitter/X
- [ ] Post in Sui Discord
- [ ] Submit to Sui ecosystem page
- [ ] Create product hunt listing
- [ ] Write blog post
- [ ] Engage with crypto communities

---

**Good luck with your launch! 🌳✨**

