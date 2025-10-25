# 🌐 Subdomain Setup Guide - SuiTree

## ✅ Implementation Complete!

Your SuiTree now works with **subdomain-based routing**!

---

## 🎯 How It Works

### Single Deployment, Multiple Subdomains

```
┌─────────────────────────────────────┐
│     Walrus Storage (One Build)      │
│     index.html + assets             │
└─────────────┬───────────────────────┘
              │
    ┌─────────▼────────────┐
    │   Wildcard DNS       │
    │ *.suitree.walrus.site│
    └─────────┬────────────┘
              │
      ┌───────┴────────┐
      │                │
   ┌──▼──┐          ┌──▼──┐
   │ cem │          │alice│
   └─────┘          └─────┘
```

### URL Examples:

**Admin Dashboard:**
```
localhost:5173              → Admin mode
suitree.walrus.site         → Admin mode  
www.suitree.walrus.site     → Admin mode
```

**User Profiles:**
```
cem.suitree.walrus.site     → Cem's profile
alice.suitree.walrus.site   → Alice's profile
mycompany.suitree.walrus.site → MyCompany's profile
```

---

## 🧪 Test Locally

### 1. Update /etc/hosts (Mac/Linux)

```bash
sudo nano /etc/hosts
```

Add:
```
127.0.0.1 cem.localhost
127.0.0.1 alice.localhost
127.0.0.1 suitree.localhost
```

Save and exit (Ctrl+X, Y, Enter)

### 2. Start Dev Server

```bash
cd frontend
pnpm dev
```

### 3. Test URLs

```
http://localhost:5173/
→ Admin dashboard ✅

http://cem.localhost:5173/
→ Cem's profile ✅

http://alice.localhost:5173/
→ Alice's profile ✅
```

---

## 🚀 Deploy to Walrus

### Step 1: Build

```bash
cd frontend
pnpm build
```

### Step 2: Upload to Walrus

```bash
# Upload dist folder
walrus upload dist/

# Output:
# Blob ID: bAfkR3i4T8...
```

### Step 3: Create Walrus Site

```bash
walrus site create \
  --name "SuiTree" \
  --blob-id bAfkR3i4T8... \
  --gas-budget 100000000

# Output:
# Site ID: site123abc...
# URL: https://site123abc.walrus.site/
```

### Step 4: Test Walrus Site

```bash
# Main site (admin)
https://site123abc.walrus.site/
→ Should show admin dashboard

# With subdomain (requires DNS)
https://cem.site123abc.walrus.site/
→ Will work after DNS setup
```

---

## 🌐 DNS Configuration

### Option A: Custom Domain (suitree.com)

**1. Buy Domain**
- Namecheap, GoDaddy, Cloudflare, etc.
- Example: `suitree.com`

**2. Add DNS Records (Cloudflare example)**

```
Type: CNAME
Name: @
Content: site123abc.walrus.site
TTL: Auto
Proxy: ON

Type: CNAME
Name: *
Content: site123abc.walrus.site
TTL: Auto
Proxy: ON
```

**3. Wait for Propagation**
- Usually 5-30 minutes
- Check: `dig cem.suitree.com`

**4. Test**
```
https://suitree.com/          → Admin
https://cem.suitree.com/      → Cem's profile
https://alice.suitree.com/    → Alice's profile
```

### Option B: SuiNS Domain (suitree.sui)

**1. Register SuiNS Domain**
```bash
# Visit: https://suins.io/
# Register: suitree.sui
```

**2. Configure Wildcard**
```bash
# In SuiNS settings, add:
# *.suitree.sui → site123abc.walrus.site
```

**3. Access**
```
https://suitree.sui/          → Admin
https://cem.suitree.sui/      → Cem's profile
```

### Option C: Keep Walrus Subdomain

```bash
# No custom domain needed
https://site123abc.walrus.site/          → Admin
https://cem.site123abc.walrus.site/      → Cem's profile
```

---

## 📝 User Flow

### Creating a Profile:

1. Visit `suitree.walrus.site`
2. Connect wallet
3. Click "Create New Profile"
4. Fill form:
   - Title: "Cem"
   - Avatar: URL or IPFS CID
   - Bio: "My awesome links"
   - **Username: "cem"** ← Important!
5. Add links (free or premium)
6. Click "Create Profile"
7. Transaction signed ✅

### Getting Your Link:

After profile creation:
```
Your profile is live at:
cem.suitree.walrus.site
```

Share this link everywhere! 🎉

---

## 🎨 Profile Pages

### What Users See:

```
┌─────────────────────────────────┐
│ Powered by SuiTree 🌳           │ ← Minimal header
├─────────────────────────────────┤
│                                 │
│         [Avatar Image]          │
│                                 │
│          Cem Yıldız             │
│      Full Stack Developer       │
│                                 │
│  ┌───────────────────────────┐ │
│  │      🐦 Twitter           │ │ ← Click → Opens link
│  └───────────────────────────┘ │
│                                 │
│  ┌───────────────────────────┐ │
│  │      💼 LinkedIn          │ │
│  └───────────────────────────┘ │
│                                 │
│  ┌───────────────────────────┐ │
│  │ 💰 Premium Content 0.1 SUI│ │ ← Premium link
│  └───────────────────────────┘ │
│                                 │
│          123 views              │
└─────────────────────────────────┘
```

### Admin Dashboard:

```
┌─────────────────────────────────┐
│  🌳 SuiTree    [Connect Wallet] │
├─────────────────────────────────┤
│                                 │
│  My Profiles                    │
│         [+ Create New Profile]  │
│                                 │
│  ┌───────────────────────────┐ │
│  │ Cem Yıldız                │ │
│  │ Full Stack Developer      │ │
│  │ 5 links • 123 views       │ │
│  │         [Share]  [Edit]   │ │
│  └───────────────────────────┘ │
│                                 │
└─────────────────────────────────┘
```

---

## 🔧 Technical Details

### Subdomain Detection Logic:

```typescript
// App.tsx
const hostname = window.location.hostname;
const parts = hostname.split('.');

// localhost → admin
if (hostname === 'localhost') return 'admin';

// suitree.walrus.site → admin
if (parts.length <= 2) return 'admin';

// cem.suitree.walrus.site → profile (username = 'cem')
const username = parts[0];
return 'profile';
```

### Why This Works on Walrus:

1. **Wildcard DNS** → All subdomains point to same build
2. **JavaScript Detection** → Client-side subdomain parsing
3. **No Server Routing** → Pure client-side logic
4. **Blockchain Lookup** → Username → Profile ID resolution

---

## 💰 Cost

**Single Deployment:**
- 1x Walrus upload: ~0.1 SUI
- Storage: Based on size
- DNS: $10-15/year (custom domain)
- ∞ Subdomains: FREE!

**Per User Cost:**
- Additional subdomains: FREE ✅
- No extra deployments needed
- No extra storage costs

---

## 🔒 Security

### Username Squatting Prevention:

- Usernames stored on blockchain
- Smart contract validates uniqueness
- First-come, first-served
- Cannot steal existing usernames

### DNS Security:

- Use Cloudflare (DDoS protection)
- Enable DNSSEC
- Or use SuiNS (blockchain DNS)

---

## 📊 Comparison

### Before (Hash Routing):
```
❌ suitree.walrus.site/#/cem
```
- Ugly URL
- Poor SEO
- Looks unprofessional

### After (Subdomain):
```
✅ cem.suitree.walrus.site
```
- Clean URL
- SEO friendly
- Professional
- Social media friendly

---

## 🎯 Marketing Your Link

### Social Media:
```
Twitter bio:    cem.suitree.walrus.site 🌳
Instagram bio:  Link in bio → QR code
LinkedIn:       cem.suitree.walrus.site
```

### Link Shortening:
```bash
# Optional: Use bit.ly
https://bit.ly/cemtree → cem.suitree.walrus.site
```

### QR Codes:
```javascript
// Generate QR code
import QRCode from 'qrcode';
QRCode.toDataURL('https://cem.suitree.walrus.site');
```

### Business Cards:
```
Cem Yıldız
Full Stack Developer
cem.suitree.walrus.site
[QR Code]
```

---

## 🐛 Troubleshooting

### "Profile Not Found"

**Problem:** Subdomain doesn't show profile

**Solutions:**
1. Check username is registered on blockchain
2. Verify DNS propagation: `dig cem.suitree.com`
3. Check console for errors (F12)
4. Ensure smart contract PACKAGE_ID is correct

### "DNS Not Resolving"

**Problem:** Subdomain returns error

**Solutions:**
1. Wait 5-30 min for DNS propagation
2. Clear DNS cache: `sudo dscacheutil -flushcache` (Mac)
3. Check wildcard CNAME is correct
4. Test with `nslookup cem.suitree.com`

### "Admin Dashboard on Subdomain"

**Problem:** `cem.suitree.site` shows admin instead of profile

**Solutions:**
1. Check App.tsx subdomain detection logic
2. Verify hostname parsing
3. Console log: `console.log(window.location.hostname)`
4. Make sure not using `www.cem.suitree.site`

---

## ✅ Deployment Checklist

### Pre-Deploy:
- [ ] Smart contract deployed to mainnet
- [ ] PACKAGE_ID updated in constants.ts
- [ ] REGISTRY_ID updated in constants.ts
- [ ] Network set to mainnet (main.tsx)
- [ ] Test locally with /etc/hosts
- [ ] All features working

### Deploy:
- [ ] `pnpm build` successful
- [ ] Upload to Walrus
- [ ] Create Walrus site
- [ ] Note Walrus site URL

### DNS:
- [ ] Domain registered (optional)
- [ ] Wildcard CNAME added
- [ ] DNS propagated
- [ ] SSL certificate active

### Test:
- [ ] Admin dashboard: suitree.walrus.site ✅
- [ ] User profile: cem.suitree.walrus.site ✅
- [ ] Links clickable ✅
- [ ] Premium links payable ✅
- [ ] Mobile responsive ✅

---

## 🎉 You're Done!

Your SuiTree is now live with **clean subdomain URLs**!

### Share Your Links:
```
✅ cem.suitree.walrus.site
✅ alice.suitree.walrus.site
✅ yourname.suitree.walrus.site
```

**Professional. Clean. Decentralized.** 🌳

---

## 📞 Support

Need help?
- Check [WALRUS_CLEAN_URLS.md](./WALRUS_CLEAN_URLS.md)
- Sui Discord: https://discord.gg/sui
- Walrus Docs: https://docs.walrus.site

**Happy hosting! 🚀**

