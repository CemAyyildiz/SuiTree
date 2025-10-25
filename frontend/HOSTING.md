# 🌐 SuiTree Hosting Rehberi

## Username Routing Nasıl Çalışır?

**Geliştirme:** `localhost:5173/cem` ✅ Çalışır (Vite dev server)
**Production:** `suitree.com/cem` ❓ Configuration gerekir

### Neden Configuration Gerekir?

SPA (Single Page Application) routing'de:
1. Tarayıcı `suitree.com/cem` ister
2. Server `/cem/index.html` dosyası arar
3. Bulamaz → 404 hatası

**Çözüm:** Server'a "her URL için index.html dön" dememiz gerekir.

---

## 🚀 Hosting Seçenekleri

### 1️⃣ Vercel (Önerilen - En Kolay)

**Avantajları:**
- Otomatik SPA routing desteği
- Ücretsiz HTTPS
- Global CDN
- Otomatik deployments (GitHub connect)

**Setup:**

```bash
# 1. Vercel CLI kur
npm i -g vercel

# 2. Deploy et
cd frontend
vercel

# İlk seferinde:
# - Login yap
# - Project name: suitree
# - Framework: Vite
# - Build command: pnpm build
# - Output directory: dist
```

**Custom Domain:**
```bash
# suitree.com domain'ini ekle
vercel domains add suitree.com

# DNS ayarları:
# A Record: @ → 76.76.21.21
# CNAME: www → cname.vercel-dns.com
```

**vercel.json** zaten hazır! ✅

---

### 2️⃣ Netlify

**Avantajları:**
- Kolay drag & drop deploy
- Ücretsiz HTTPS
- Form handling
- Serverless functions

**Setup:**

**A) Netlify CLI:**
```bash
npm i -g netlify-cli
cd frontend
netlify deploy --prod
```

**B) Web UI:**
1. https://app.netlify.com → New site
2. `dist` klasörünü sürükle bırak
3. Site settings → Domain management

**public/_redirects** dosyası zaten hazır! ✅

**Custom Domain:**
- Site settings → Domain management → Add custom domain
- DNS'te CNAME: `suitree.com` → `yoursite.netlify.app`

---

### 3️⃣ Walrus (Sui Ekosistemi)

**Avantajları:**
- Fully decentralized
- Sui ekosistemi içinde
- Censorship-resistant

**Dezavantajları:**
- ⚠️ SPA routing desteği YOK (şu an)
- Static file hosting sadece
- `suitree.com/cem` gibi routing çalışmaz

**Walrus'ta Çalışması İçin:**

**Seçenek A: Object ID ile erişim (Şimdi)**
```
https://aggregator.walrus.site/[blob-id]
# Sonra:
https://your-site.walrus.site/profile/0xABC123...
```

✅ Çalışır: `/profile/:objectId`
❌ Çalışmaz: `/cem` (username routing)

**Seçenek B: Walrus + Vercel/Netlify (Hybrid)**
1. Frontend'i Vercel'e deploy et
2. Static assets (images, etc.) Walrus'a yükle
3. Frontend Walrus'tan assets çeker

```typescript
// Avatar için Walrus kullan
const avatarUrl = avatar_cid.startsWith("blob:") 
  ? `https://aggregator.walrus.site/${avatar_cid}`
  : avatar_cid;
```

**Seçenek C: Walrus + Service Worker (Gelecek)**
Service worker ile client-side routing yapılabilir (henüz beta).

---

### 4️⃣ IPFS (InterPlanetary File System)

**Avantajları:**
- Fully decentralized
- Pin services (Pinata, NFT.Storage)
- ENS domain desteği

**Setup:**

```bash
# 1. Build et
pnpm build

# 2. IPFS'e yükle (Pinata örnek)
# https://pinata.cloud → Upload dist klasörü

# 3. CID al
# QmXXXXXXX...

# 4. Erişim
https://ipfs.io/ipfs/QmXXXX...
https://QmXXXX.ipfs.dweb.link
```

**ENS Domain (Ethereum):**
```
# suitree.eth → IPFS CID
# Otomatik username routing için:
cem.suitree.eth → /cem subpath
```

---

### 5️⃣ GitHub Pages

**Avantajları:**
- Ücretsiz
- GitHub repo ile entegre
- Kolay setup

**Dezavantajı:**
- SPA routing manuel config gerekir

**Setup:**

```bash
# 1. vite.config.mts güncelle
export default defineConfig({
  base: '/', // veya '/SuiTree/' (repo adı)
  plugins: [react()],
})

# 2. 404.html = index.html trick
cp dist/index.html dist/404.html

# 3. Deploy script
npm run build
npx gh-pages -d dist
```

**GitHub Pages SPA Routing:**
`dist/404.html` → `dist/index.html` kopyala
GitHub 404 olunca index.html dönecek.

---

## 🎯 Önerilen Strateji

### Aşama 1: Test & Geliştirme
**Vercel veya Netlify** kullan:
- Hızlı deploy
- SPA routing çalışır
- `suitree.com/cem` ✅
- Ücretsiz HTTPS
- Custom domain kolay

### Aşama 2: Decentralization
**Walrus + CDN:**
- Frontend: Vercel/Netlify
- Images/Assets: Walrus
- Smart Contract: Sui

### Aşama 3: Fully Decentralized
**IPFS + ENS:**
- Tüm site IPFS'te
- ENS domain (`suitree.eth`)
- Username'ler subdomain olabilir

---

## 🔧 Build & Deploy Komutları

### Production Build

```bash
cd frontend

# Build
pnpm build

# Test locally
pnpm preview

# Deploy (Vercel)
vercel --prod

# Deploy (Netlify)
netlify deploy --prod --dir=dist
```

---

## 📝 Önemli Notlar

### 1. Username Routing Gereksinimleri

**Çalışması için:**
- Server-side rewrite/redirect
- VEYA Service Worker
- VEYA ENS subdomain

**Çalışmaz:**
- Pure static hosting (Walrus, basic S3)
- CDN without rewrite rules

### 2. Alternative: Subdomain Strategy

Username'ler için subdomain kullan:
- `cem.suitree.com`
- `alice.suitree.com`

Her username için:
```javascript
// Wildcard DNS: *.suitree.com → server
// Server username'i parse eder
const username = window.location.hostname.split('.')[0];
```

### 3. Contract Constants

**Production'da:**
```typescript
// constants.ts
export const PACKAGE_ID = "0xPRODUCTION_PACKAGE_ID";
export const REGISTRY_ID = "0xPRODUCTION_REGISTRY_ID";
export const MODULE_NAME = "contrat";

// mainnet kullan
// main.tsx
<SuiClientProvider networks={networkConfig} defaultNetwork="mainnet">
```

---

## 🎨 Domain Setup

### Custom Domain (suitree.com)

**1. Domain Satın Al:**
- Namecheap, GoDaddy, Cloudflare

**2. DNS Ayarları (Vercel örnek):**
```
A Record:
  Name: @
  Value: 76.76.21.21
  TTL: Auto

CNAME Record:
  Name: www
  Value: cname.vercel-dns.com
  TTL: Auto
```

**3. Vercel'de Domain Ekle:**
```bash
vercel domains add suitree.com
vercel domains add www.suitree.com
```

**4. SSL:**
Otomatik (Let's Encrypt) ✅

---

## 🔒 Production Checklist

- [ ] Contract mainnet'e publish edildi
- [ ] PACKAGE_ID güncellendi
- [ ] REGISTRY_ID güncellendi
- [ ] Network: mainnet
- [ ] Build test edildi (`pnpm build`)
- [ ] Preview test edildi (`pnpm preview`)
- [ ] Hosting seçildi (Vercel/Netlify)
- [ ] Custom domain eklendi
- [ ] DNS configured
- [ ] SSL active
- [ ] `/cem` gibi username routing test edildi
- [ ] Mobile responsive test edildi
- [ ] Premium link ödeme test edildi

---

## 🆘 Troubleshooting

### "404 Not Found" (Production'da /cem açmıyor)

**Neden:** SPA routing config eksik

**Çözüm:**
- Vercel: `vercel.json` var mı?
- Netlify: `public/_redirects` var mı?
- GitHub Pages: `404.html = index.html` var mı?

### "Profile Not Found"

**Neden:** Username registry'de yok

**Çözüm:**
- UsernameResolver console log'larına bak
- REGISTRY_ID doğru mu kontrol et
- Username lowercase mu kontrol et

### "Transaction Failed"

**Neden:** Network mismatch

**Çözüm:**
- Wallet network = app network?
- Mainnet contract ID testnet'te kullanılmış olabilir

---

## 📞 Destek

- Vercel Docs: https://vercel.com/docs
- Netlify Docs: https://docs.netlify.com
- Walrus Docs: https://docs.walrus.site
- Sui Discord: https://discord.gg/sui

---

**Başarılar! 🚀**

