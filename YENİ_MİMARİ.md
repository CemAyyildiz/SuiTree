# 🎯 YENİ MİMARİ: Backend-Only Enoki

## ✅ YAPILAN DEĞİŞİKLİKLER

### Önceki Mimari (Sorunlu):
```
Frontend: Enoki Public Key → Google OAuth (403 Error!)
Backend: Enoki Private Key → Sponsored Transactions
```

### Yeni Mimari (Çalışıyor):
```
Frontend → Backend → Enoki (Hem zkLogin, Hem Sponsorship)
                  ↓
              Sui Blockchain
```

---

## 🔧 Backend Değişiklikleri

### Yeni Endpoint'ler:

#### 1. `POST /api/create-google-auth-url`
**İşlevi:** Google OAuth URL'ini oluşturur

**Request:**
```json
{
  "redirectUrl": "http://localhost:5173",
  "googleClientId": "541635931271-o936v7a2..."
}
```

**Response:**
```json
{
  "success": true,
  "authUrl": "https://accounts.google.com/o/oauth2/v2/auth?..."
}
```

#### 2. `POST /api/handle-google-callback`
**İşlevi:** Google'dan dönen id_token'ı işler ve zkLogin address oluşturur

**Request:**
```json
{
  "idToken": "eyJhbGciOiJSUzI1NiIs..."
}
```

**Response:**
```json
{
  "success": true,
  "address": "0xabc123...",
  "session": {...}
}
```

#### 3. `POST /api/sponsor-and-execute-transaction` (Var olan)
**İşlevi:** Transaction'ı sponsor eder ve execute eder

---

## 🎨 Frontend Değişiklikleri

### Kaldırılanlar:
- ❌ `@mysten/enoki/react` import'ları
- ❌ `EnokiFlowProvider`
- ❌ `useEnokiFlow()` hook
- ❌ `useZkLogin()` hook
- ❌ `enokiConfig.ts` (artık gerek yok)

### Eklennenler:
- ✅ `localStorage` ile zkLogin address yönetimi
- ✅ Backend API calls (fetch)
- ✅ Basitleştirilmiş OAuth flow

---

## 🚀 NASIL ÇALIŞIYOR?

### 1. Kullanıcı "Google ile Giriş Yap" butonuna tıklar

**Frontend:**
```typescript
// Backend'den OAuth URL iste
const response = await fetch('http://localhost:3001/api/create-google-auth-url', {
  method: 'POST',
  body: JSON.stringify({ redirectUrl, googleClientId })
});

const { authUrl } = await response.json();

// Google'a yönlendir
window.location.href = authUrl;
```

**Backend:**
```javascript
// Enoki ile OAuth URL oluştur
const authUrl = await enokiClient.createAuthorizationURL({
  provider: 'google',
  clientId: googleClientId,
  redirectUrl: redirectUrl,
  network: 'testnet',
});
```

### 2. Kullanıcı Google'da giriş yapar

Google → `http://localhost:5173/?id_token=xxx`

### 3. Frontend id_token'ı backend'e gönderir

**Frontend:**
```typescript
// URL'den id_token'ı çıkar
const urlParams = new URLSearchParams(window.location.href.split('?')[1]);
const idToken = urlParams.get('id_token');

// Backend'e gönder
const response = await fetch('http://localhost:3001/api/handle-google-callback', {
  method: 'POST',
  body: JSON.stringify({ idToken })
});

const { address, session } = await response.json();

// LocalStorage'a kaydet
localStorage.setItem('zkLoginAddress', address);
localStorage.setItem('zkLoginSession', JSON.stringify(session));
```

**Backend:**
```javascript
// Enoki ile zkLogin session oluştur
const zkLoginSession = await enokiClient.createZkLoginSession({
  jwt: idToken,
  network: 'testnet',
});

return { address: zkLoginSession.address };
```

### 4. Kullanıcı profil oluşturur (Sponsored Transaction)

**Frontend:**
```typescript
const tx = new Transaction();
tx.moveCall({ target: 'mint_profile', ... });

// Transaction bytes'ı backend'e gönder
const transactionBytes = await tx.build({ client: suiClient });
const response = await fetch('http://localhost:3001/api/sponsor-and-execute-transaction', {
  method: 'POST',
  body: JSON.stringify({
    transactionBytes: hexString,
    sender: zkLoginAddress
  })
});
```

**Backend:**
```javascript
// Enoki ile sponsor et ve execute et
const result = await enokiClient.executeSponsoredTransaction({
  network: 'testnet',
  transactionKindBytes: txBytes,
  sender: sender,
});
```

---

## 🎁 AVANTAJLAR

1. ✅ **Tek API Key Yönetimi:** Sadece backend'de Enoki private key
2. ✅ **Güvenlik:** API key'leri asla frontend'e gitmez
3. ✅ **Basitlik:** Frontend'de karmaşık Enoki logic yok
4. ✅ **Network Ayarları:** Tek yerden (backend) yönetiliyor
5. ✅ **Hata Yönetimi:** Backend'de merkezi error handling
6. ✅ **403 Hatası Çözüldü:** Artık frontend Enoki API'sini çağırmıyor

---

## 🧪 TEST ETMEK İÇİN

### 1. Backend'i Başlat
```bash
cd backend
npm start
```

Göreceksin:
```
╔════════════════════════════════════════════════════════════╗
║  🔐 zkLogin + Sponsored Transactions: ENABLED              ║
║  Endpoints:                                                ║
║  • POST /api/create-google-auth-url                        ║
║  • POST /api/handle-google-callback                        ║
║  • POST /api/sponsor-and-execute-transaction               ║
╚════════════════════════════════════════════════════════════╝
```

### 2. Frontend'i Başlat
```bash
cd frontend
npm run dev
```

### 3. Tarayıcıda Aç
http://localhost:5173

### 4. Console'da Göreceklerin:
```
🚀 SuiTree starting...
📦 Backend URL: http://localhost:3001
🔑 Google Client ID: 541635931271-o936v7a...
📞 Requesting Google OAuth URL from backend...
✅ Got auth URL from backend
🚀 Redirecting to Google OAuth...
```

### 5. Google'dan Döndükten Sonra:
```
🔐 OAuth callback detected! id_token found
📞 Sending id_token to backend...
✅ zkLogin address received: 0x...
🧹 Cleaning up URL...
```

### 6. Backend Console'da:
```
🔐 Creating Google OAuth URL...
  - Redirect URL: http://localhost:5173
✅ Google OAuth URL created!

🔐 Handling Google OAuth callback...
✅ zkLogin session created!
  - Address: 0x...
```

---

## 🔑 ENVIRONMENT VARIABLES

### Backend `.env`:
```env
ENOKI_PRIVATE_API_KEY=enoki_private_9060de6762ad3e1b1303fce5bce7d91e
PORT=3001
```

### Frontend `.env`:
```env
VITE_GOOGLE_CLIENT_ID=541635931271-o936v7a2p2j6oil21q88vlv6mdu9jtm3.apps.googleusercontent.com
VITE_BACKEND_URL=http://localhost:3001
VITE_PACKAGE_ID=0xb0ef7e34bb939114748607b2dca1e6ef1fc856d9e77ad5f9822bf36698c98ffa
```

**NOT:** Artık `VITE_ENOKI_API_KEY` gerekmez! ✅

---

## 📝 DEPLOYMENT

Production'da:
1. Backend'i deploy et (örn: Heroku, Railway, Vercel)
2. `.env` dosyasına `ENOKI_PRIVATE_API_KEY` ekle
3. Frontend'de `VITE_BACKEND_URL` değişkenini production backend URL'ine ayarla
4. Build ve deploy et

---

## 🆘 Sorun Giderme

### Hata: "Failed to create auth URL"
- Backend'in çalıştığından emin ol (`curl http://localhost:3001/health`)
- Backend console'unda hata mesajlarını kontrol et

### Hata: "Failed to get zkLogin address"
- Backend'deki `ENOKI_PRIVATE_API_KEY` doğru mu kontrol et
- Backend console'unda detaylı hata log'unu gör

### Hata: "Connection refused"
- `VITE_BACKEND_URL` doğru mu kontrol et
- Backend'in ayakta olduğundan emin ol

---

🎉 **Artık her şey backend üzerinden çalışıyor ve çok daha basit!**

