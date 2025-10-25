# 🐘 Walrus Deployment Rehberi - SuiTree

## 🎯 Walrus Nedir?

Walrus, Sui ekosisteminin **decentralized storage** çözümü. Fully decentralized ve censorship-resistant!

### Walrus Özellikleri:
- ✅ Decentralized hosting
- ✅ Censorship-resistant
- ✅ Sui ekosistemi entegrasyonu
- ✅ Cost-effective storage
- ❌ Server-side routing YOK (pure static hosting)

---

## 🔄 Hash Routing - Walrus Çözümü

SuiTree artık **Hash-based routing** kullanıyor, bu sayede Walrus'ta çalışıyor!

### URL Yapısı:

**Önceki (BrowserRouter - Walrus'ta çalışmaz):**
```
❌ suitree.com/cem
❌ suitree.com/profile/0xABC...
```

**Yeni (HashRouter - Walrus'ta çalışır):**
```
✅ suitree.walrus.site/#/cem
✅ suitree.walrus.site/#/profile/0xABC...
✅ suitree.walrus.site/#/create
```

### Nasıl Çalışır?

**Hash (#) karakterinden sonrası browser tarafından yönetilir:**
1. Browser `#/cem` 'i görür
2. Server'a istek GÖNDERMEDİ
3. JavaScript `#/cem` 'i okur ve route'u handle eder
4. Walrus sadece `index.html` döner
5. React Router hash'i parse edip doğru component'i render eder

---

## 📦 Walrus'a Deployment

### 1️⃣ Build Project

```bash
cd frontend
pnpm build
```

Bu `dist` klasörü oluşturur.

### 2️⃣ Walrus CLI Kurulumu

```bash
# Walrus CLI indir (macOS)
curl -L https://github.com/MystenLabs/walrus-docs/releases/download/latest/walrus-macos -o walrus
chmod +x walrus
sudo mv walrus /usr/local/bin/

# Veya cargo ile
cargo install walrus-cli
```

### 3️⃣ Walrus'a Upload

```bash
# dist klasörünü yükle
walrus upload dist/

# Çıktıda blob ID alacaksın:
# Blob ID: bAfkR3i...
```

### 4️⃣ Site Oluştur

```bash
# Walrus site objesi oluştur
walrus site create \
  --name "SuiTree" \
  --blob-id bAfkR3i... \
  --gas-budget 100000000
```

### 5️⃣ Erişim URL'si

```
https://[SITE-ID].walrus.site/
https://aggregator.walrus.site/[BLOB-ID]/
```

**Örnek:**
```
https://suitree.walrus.site/#/cem
```

---

## 🔗 Link Paylaşma

### Username Links
```
Paylaş: https://suitree.walrus.site/#/cem
```

### Profile Links (Object ID)
```
Paylaş: https://suitree.walrus.site/#/profile/0xABC123...
```

### Ana Sayfa
```
https://suitree.walrus.site/
veya
https://suitree.walrus.site/#/
```

---

## 🎨 Custom Domain (Walrus Sites)

### Seçenek 1: Subdomain
```bash
# Walrus subdomain al
walrus site add-subdomain --name cemtree

# Erişim:
https://cemtree.walrus.site/#/cem
```

### Seçenek 2: SuiNS Domain
```bash
# SuiNS domain satın al: suitree.sui
# Walrus site'ına point et

# Erişim:
https://suitree.sui/#/cem
```

---

## 📱 URL Örnekleri

### Production URLs (Walrus):
```
Ana Sayfa:
https://suitree.walrus.site/

Profil (Username):
https://suitree.walrus.site/#/cem

Profil (Object ID):
https://suitree.walrus.site/#/profile/0x7d5b...

Profil Oluştur:
https://suitree.walrus.site/#/create

Profil Düzenle:
https://suitree.walrus.site/#/edit/0x7d5b...
```

---

## 🔧 Build Configuration

### vite.config.mts

Halihazırda doğru yapılandırılmış ama kontrol et:

```typescript
export default defineConfig({
  base: './', // Relative paths for Walrus
  plugins: [react()],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        // Optimize for Walrus
        manualChunks: undefined,
      },
    },
  },
});
```

---

## 🚀 Deployment Scripti

`package.json`'a ekle:

```json
{
  "scripts": {
    "build": "tsc && vite build",
    "deploy:walrus": "pnpm build && walrus upload dist/"
  }
}
```

Kullanım:
```bash
pnpm deploy:walrus
```

---

## 📊 Walrus vs. Diğer Hostingler

| Özellik | Walrus | Vercel | Netlify | IPFS |
|---------|--------|--------|---------|------|
| Decentralized | ✅ | ❌ | ❌ | ✅ |
| SPA Routing | ⚠️ Hash | ✅ | ✅ | ⚠️ Hash |
| Custom Domain | ⚠️ SuiNS | ✅ | ✅ | ⚠️ ENS |
| Free SSL | ✅ | ✅ | ✅ | ✅ |
| Speed | ⚡ | ⚡⚡ | ⚡⚡ | ⚡ |
| Sui Native | ✅ | ❌ | ❌ | ❌ |
| Cost | 💰 | Free tier | Free tier | Free/Paid |

---

## 🎯 Önerilen Strateji

### Aşama 1: Testnet (Development)
```bash
# Vercel'e deploy et (hızlı test)
vercel --prod

# URL: https://suitree.vercel.app/cem
```

### Aşama 2: Mainnet (Production)
```bash
# Walrus'a deploy et (decentralized)
pnpm deploy:walrus

# URL: https://suitree.walrus.site/#/cem
```

### Aşama 3: Domain
```bash
# SuiNS domain al
# suitree.sui → Walrus site'ına point et
```

---

## 🐛 Troubleshooting

### "404 Not Found" on Walrus
**Sebep:** Server-side routing

**Çözüm:**
✅ Hash routing kullan (`#/cem`)
❌ Direct paths kullanma (`/cem`)

### Links Don't Work
**Sebep:** Base path yanlış

**Çözüm:**
```typescript
// vite.config.mts
base: './' // Not '/'
```

### Images Not Loading
**Sebep:** Absolute paths

**Çözüm:**
```typescript
// Relative paths kullan
<img src="./assets/image.png" />
// Not: <img src="/assets/image.png" />
```

### Smart Contract Calls Failing
**Sebep:** Network mismatch

**Çözüm:**
- Mainnet contract ID kullan
- main.tsx'te network kontrol et:
```typescript
<SuiClientProvider defaultNetwork="mainnet">
```

---

## 📝 Checklist

Walrus'a deploy etmeden önce:

- [ ] Build başarılı (`pnpm build`)
- [ ] Hash routing aktif (App.tsx'te `HashRouter`)
- [ ] PACKAGE_ID mainnet'e ait
- [ ] REGISTRY_ID mainnet'e ait
- [ ] Network: mainnet (main.tsx)
- [ ] Base path: './' (vite.config.mts)
- [ ] Links test edildi (local'de `#/cem`)
- [ ] Premium link payments test edildi
- [ ] Wallet connection test edildi

---

## 🔐 Security Notes

1. **Smart Contract:** Audited mainnet contract kullan
2. **IPFS/Walrus:** Assets için decentralized storage
3. **No Secrets:** Frontend'te secret key YOK
4. **Wallet Only:** Tüm işlemler user wallet'tan

---

## 💡 Tips

### URL Paylaşırken:
```
❌ Kullanıcıya ver: https://site.walrus.site/cem
✅ Kullanıcıya ver: https://site.walrus.site/#/cem
```

### Link Kısaltma:
```bash
# Bit.ly veya benzeri ile kısalt
https://bit.ly/cemtree → https://site.walrus.site/#/cem
```

### QR Code:
```javascript
// QR code generate et
import QRCode from 'qrcode';
QRCode.toDataURL('https://suitree.walrus.site/#/cem');
```

### Social Media:
```
Twitter bio: suitree.walrus.site/#/cem 🌳
Instagram bio: Link in bio → QR code
```

---

## 🌐 Alternative: Hybrid Deployment

Eğer hem decentralization hem de clean URLs istiyorsan:

### Option A: Cloudflare Workers + Walrus
```javascript
// Cloudflare Worker
addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (url.pathname !== '/') {
    // Redirect to hash route
    return Response.redirect(`${url.origin}/#${url.pathname}`);
  }
  // Fetch from Walrus
  return fetch('https://suitree.walrus.site/');
});
```

### Option B: Service Worker
```javascript
// service-worker.js
self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch('/index.html')
    );
  }
});
```

---

## 📚 Resources

- [Walrus Documentation](https://docs.walrus.site/)
- [Walrus Sites Guide](https://docs.walrus.site/walrus-sites/intro.html)
- [SuiNS Domains](https://suins.io/)
- [Sui Network Status](https://status.sui.io/)

---

## 🎉 Launch Checklist

### Pre-Launch:
1. ✅ Contract deployed to mainnet
2. ✅ Frontend built successfully
3. ✅ Hash routing tested locally
4. ✅ All features working

### Launch:
1. 🚀 Deploy to Walrus
2. 📝 Get Walrus URL
3. 🔗 Share with community
4. 📢 Announce on socials

### Post-Launch:
1. 📊 Monitor usage
2. 🐛 Fix bugs
3. ✨ Add features
4. 💰 Track premium link earnings

---

**Artık tamamen decentralized bir SuiTree'n var! 🌳🐘**

Deploy komutları:
```bash
cd frontend
pnpm build
walrus upload dist/
```

Hazırsın! 🚀

