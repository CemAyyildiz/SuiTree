# 🐘 Walrus Clean URLs - Subdomain Strategy

## 🎯 Problem

Walrus pure static hosting → Server-side routing çalışmaz
- ❌ `suitree.com/cem` çalışmaz
- ❌ Hash routing (`#/cem`) istemiyorsun
- ✅ Temiz URL'ler istiyorsun

## 💡 Çözüm 2: Subdomain Stratejisi (ÖNERİLEN)

### Nasıl Çalışır?

Her kullanıcı için **benzersiz subdomain**:
```
cem.suitree.walrus.site
alice.suitree.walrus.site  
bob.suitree.walrus.site
```

### Avantajları:
✅ **Temiz URL** - No hash, no query params
✅ **Unique per user** - Her kullanıcı kendi subdomain'i
✅ **SEO friendly** - Arama motorları indexleyebilir
✅ **Social media friendly** - Güzel görünür
✅ **Walrus compatible** - Static hosting ile çalışır

### Dezavantajları:
⚠️ DNS yönetimi gerekir
⚠️ Wildcard DNS gerekir (`*.suitree.walrus.site`)
⚠️ Her kullanıcı için ayrı deployment? (HAYIR - tek deployment!)

---

## 🏗️ Architecture

### Single Deployment, Multiple Subdomains

```
                    ┌─────────────────────────┐
                    │   Walrus Storage        │
                    │   (Single Build)        │
                    └──────────┬──────────────┘
                               │
                    ┌──────────▼──────────────┐
                    │   DNS Wildcard          │
                    │   *.suitree.walrus.site │
                    └──────────┬──────────────┘
                               │
        ┌──────────────────────┼──────────────────────┐
        │                      │                      │
┌───────▼────────┐   ┌─────────▼────────┐   ┌───────▼────────┐
│ cem.suitree... │   │ alice.suitree... │   │ bob.suitree... │
│                │   │                  │   │                │
│  Same Build    │   │   Same Build     │   │  Same Build    │
│  Detects: cem  │   │   Detects: alice │   │  Detects: bob  │
└────────────────┘   └──────────────────┘   └────────────────┘
```

**Key Point:** Tek build, tüm subdomain'ler aynı dosyaları kullanır!

---

## 🔧 Implementation

### 1️⃣ Frontend Changes

App başlarken subdomain'i tespit et:

```typescript
// App.tsx
function App() {
  const [username, setUsername] = useState<string>("");

  useEffect(() => {
    // Subdomain'i parse et
    const hostname = window.location.hostname;
    // cem.suitree.walrus.site → cem
    const parts = hostname.split('.');
    
    if (parts.length >= 3) {
      // İlk part username
      const subdomain = parts[0];
      
      // Ana domain değilse
      if (subdomain !== 'www' && subdomain !== 'suitree') {
        setUsername(subdomain);
      }
    }
  }, []);

  // Username varsa direkt profile göster
  if (username) {
    return <UsernameResolver username={username} />;
  }

  // Ana domain ise normal app
  return <NormalApp />;
}
```

### 2️⃣ DNS Configuration

**Wildcard DNS ayarla:**

```
Type: CNAME
Name: *
Value: your-blob-id.walrus.site
TTL: Auto
```

**Sonuç:**
- `*.suitree.walrus.site` → Tek build'e yönlenir
- Her subdomain aynı index.html'i yükler
- JavaScript subdomain'i parse eder

### 3️⃣ Username Registration

Kullanıcı profil oluştururken:

```typescript
// ProfileEditor.tsx
const handleCreateProfile = async () => {
  // 1. Profile oluştur
  // 2. Username kaydet (blockchain)
  // 3. Kullanıcıya subdomain bilgisini göster
  
  alert(`
    Profile created! 
    Your link: ${username}.suitree.walrus.site
  `);
};
```

---

## 📝 Detaylı Kod

### App.tsx (Subdomain Detection)

```typescript
import { useEffect, useState } from "react";
import { ConnectButton } from "@mysten/dapp-kit";
import { Box, Flex, Heading, Container, Card, Text } from "@radix-ui/themes";
import { UsernameResolver } from "./UsernameResolver";
import { HomePage } from "./HomePage";

function App() {
  const [mode, setMode] = useState<"loading" | "profile" | "admin">("loading");
  const [username, setUsername] = useState<string>("");

  useEffect(() => {
    detectMode();
  }, []);

  const detectMode = () => {
    const hostname = window.location.hostname;
    
    // localhost:5173 → admin mode
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      setMode('admin');
      return;
    }

    // Parse subdomain
    const parts = hostname.split('.');
    
    // suitree.walrus.site veya www.suitree.walrus.site → admin mode
    if (parts.length <= 2 || parts[0] === 'www') {
      setMode('admin');
      return;
    }

    // cem.suitree.walrus.site → profile mode
    const subdomain = parts[0];
    setUsername(subdomain);
    setMode('profile');
  };

  if (mode === "loading") {
    return (
      <Container size="2" mt="9">
        <Card>
          <Text>Loading...</Text>
        </Card>
      </Container>
    );
  }

  // Profile Mode (cem.suitree.walrus.site)
  if (mode === "profile") {
    return (
      <>
        {/* Optional: Small header with logo */}
        <Flex px="4" py="2" justify="center" style={{ borderBottom: "1px solid var(--gray-a2)" }}>
          <Text size="2" color="gray">
            Powered by <a href="https://suitree.walrus.site" style={{ color: "inherit" }}>SuiTree 🌳</a>
          </Text>
        </Flex>
        
        <UsernameResolver username={username} />
      </>
    );
  }

  // Admin Mode (suitree.walrus.site or localhost)
  return (
    <>
      <Flex
        position="sticky"
        px="4"
        py="2"
        justify="between"
        style={{
          borderBottom: "1px solid var(--gray-a2)",
          backgroundColor: "var(--color-background)",
          top: 0,
          zIndex: 100,
        }}
      >
        <Box>
          <Heading>🌳 SuiTree</Heading>
        </Box>
        <Box>
          <ConnectButton />
        </Box>
      </Flex>
      
      <HomePage />
    </>
  );
}

export default App;
```

---

## 🌐 URL Examples

### Admin Dashboard (Kendi Profillerin)
```
https://suitree.walrus.site/
↓
- Create profile
- Edit profiles
- Manage links
- Wallet connection
```

### User Profiles (Public View)
```
https://cem.suitree.walrus.site/
↓
- Cem's profile
- Links
- Theme
- No admin features

https://alice.suitree.walrus.site/
↓
- Alice's profile
```

---

## 🚀 Deployment Steps

### 1. Build Frontend
```bash
cd frontend
pnpm build
```

### 2. Upload to Walrus
```bash
walrus upload dist/
# Get Blob ID: bAfkR3i...
```

### 3. Create Walrus Site
```bash
walrus site create \
  --name "SuiTree" \
  --blob-id bAfkR3i... \
  --gas-budget 100000000
  
# Get Site ID: site123...
```

### 4. Setup DNS

**Option A: Cloudflare (Önerilen)**

1. Domain ekle: `suitree.com`
2. DNS Records ekle:
   ```
   Type: CNAME
   Name: @
   Value: site123.walrus.site
   
   Type: CNAME  
   Name: *
   Value: site123.walrus.site
   ```

**Option B: SuiNS**
```bash
# SuiNS domain al: suitree.sui
# Wildcard support varsa *.suitree.sui ayarla
```

### 5. Test
```bash
# Ana domain
https://suitree.walrus.site/
→ Admin dashboard

# Subdomain
https://cem.suitree.walrus.site/
→ Cem's profile
```

---

## 📱 User Flow

### Profile Oluşturma:
```
1. suitree.walrus.site → Admin dashboard
2. Connect wallet
3. "Create Profile"
4. Username: "cem" gir
5. Profile created!
6. Alert: "Your link: cem.suitree.walrus.site"
7. Share link!
```

### Profile Görüntüleme:
```
1. Visitor: cem.suitree.walrus.site
2. JavaScript detects: subdomain = "cem"
3. Resolve username → profile ID
4. Load profile from blockchain
5. Display links
6. Click link → Premium? → Payment
```

---

## 🎨 Marketing

Kullanıcılara subdomain ver:
```
✅ cem.suitree.walrus.site
✅ alice.suitree.walrus.site
✅ mycompany.suitree.walrus.site
```

Link kısaltma:
```
bit.ly/cemtree → cem.suitree.walrus.site
```

QR Code:
```
Print with:
cem.suitree.walrus.site
```

Social Media:
```
Twitter: cem.suitree.walrus.site 🌳
Instagram: Link in bio
LinkedIn: cem.suitree.walrus.site
```

---

## 💰 Cost Analysis

**Single Deployment:**
- 1x Walrus upload
- 1x Storage cost
- ∞ subdomains (FREE!)

**vs. Individual Deployments:**
- N x Walrus uploads
- N x Storage costs
- Expensive!

**Subdomain stratejisi = Cost effective** ✅

---

## 🔒 Security

**Subdomain Spoofing?**
- Username blockchain'de kayıtlı
- `cem.suitree.site` → blockchain'den `cem` username'ini resolve eder
- Eğer kayıtlı değilse: "Username not found"
- Başka biri `cem` alamaz (unique usernames)

**DNS Hijacking?**
- Wildcard DNS'i güvenli provider kullan (Cloudflare)
- SuiNS: Blockchain-based DNS (en güvenli)

---

## 🆚 Comparison

| Feature | Subdomain | Hash (#) | Query (?) |
|---------|-----------|----------|-----------|
| URL | cem.suitree.site | site/#/cem | site?p=cem |
| Clean | ✅ Perfect | ❌ | ⚠️ OK |
| SEO | ✅ | ❌ | ⚠️ |
| Social | ✅ | ⚠️ | ⚠️ |
| Setup | ⚠️ DNS | ✅ Easy | ✅ Easy |
| Walrus | ✅ | ✅ | ✅ |
| Cost | ✅ Single | ✅ Single | ✅ Single |

---

## 🎯 Recommendation

**Subdomain stratejisi kullan!**

### Neden?
1. ✅ En temiz URL
2. ✅ SEO friendly
3. ✅ Social media friendly
4. ✅ Tek deployment
5. ✅ Walrus compatible
6. ✅ Professional görünüm

### Setup:
1. Yukarıdaki kodu implement et
2. Walrus'a upload et
3. DNS ayarla (wildcard CNAME)
4. Test et!

---

## 🚀 Next Steps

1. ✅ App.tsx'i subdomain detection ile güncelle
2. ✅ UsernameResolver'ı sadece profil için kullan
3. ✅ Admin dashboard ayrı tut
4. ✅ Build & deploy
5. ✅ DNS ayarla
6. ✅ Test et!

---

**Subdomain stratejisi ile temiz, professional URL'ler! 🌳**

```
cem.suitree.walrus.site
```

Güzel görünüyor değil mi? 😎

