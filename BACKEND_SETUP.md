# 🚀 Backend Kurulum ve Çalıştırma

## 📋 Adım Adım Kurulum

### 1️⃣ Backend Kurulumu

```bash
cd backend
npm install
```

### 2️⃣ Enoki Private API Key Alın

1. [Enoki Portal](https://enoki.mystenlabs.com/) adresine gidin
2. Uygulamanızı seçin
3. **API Keys** sekmesine gidin
4. **"Create Private API Key"** butonuna tıklayın (PUBLIC değil!)
5. Key'i kopyalayın

### 3️⃣ Environment Variables Ayarlayın

Backend klasöründe `.env` dosyası oluşturun:

```bash
cd backend
cp .env.example .env
```

`.env` dosyasını düzenleyin:

```env
ENOKI_PRIVATE_API_KEY=enoki_private_xxxxxxxxxxxxxxxxx
PORT=3001
```

⚠️ **ÖNEMLİ**: `enoki_private_` ile başlayan key kullanın, `enoki_public_` değil!

### 4️⃣ Frontend Environment Variables

Frontend klasöründe `.env` dosyasını düzenleyin:

```bash
cd ../frontend
```

`.env` dosyasına ekleyin:

```env
VITE_BACKEND_URL=http://localhost:3001
```

## 🚀 Uygulamayı Çalıştırın

### Terminal 1: Backend

```bash
cd backend
npm run dev
```

Backend başarıyla başladığında göreceksiniz:

```
╔════════════════════════════════════════════════════════════╗
║  🌳 SuiTree Backend API                                    ║
║  🚀 Server running on: http://localhost:3001               ║
║  🎁 Sponsored Transactions: ENABLED                        ║
╚════════════════════════════════════════════════════════════╝
```

### Terminal 2: Frontend

```bash
cd frontend
npm run dev
```

## ✅ Test Edin

1. Tarayıcıda `http://localhost:5174` açın
2. Google ile giriş yapın
3. "Create New Profile" butonuna tıklayın
4. Formu doldurun
5. "Create Profile" butonuna basın
6. **✨ GAS FEE ÖDEMEDEN profil oluşturun!**

## 🎯 Nasıl Çalışıyor?

```
┌─────────────┐                ┌─────────────┐                ┌─────────────┐
│   Frontend  │                │   Backend   │                │    Enoki    │
│  (User)     │                │  (Node.js)  │                │     API     │
└──────┬──────┘                └──────┬──────┘                └──────┬──────┘
       │                              │                              │
       │ 1. Create Transaction        │                              │
       ├─────────────────────────────>│                              │
       │                              │ 2. Sponsor Transaction       │
       │                              ├─────────────────────────────>│
       │                              │                              │
       │                              │ 3. Sponsored TX              │
       │ 4. Sponsored TX              │<─────────────────────────────┤
       │<─────────────────────────────┤                              │
       │                              │                              │
       │ 5. Sign TX                   │                              │
       ├─────────────────────────────>│                              │
       │                              │ 6. Execute TX                │
       │                              ├─────────────────────────────>│
       │                              │                              │
       │ 7. Success!                  │ 8. Result                    │
       │<─────────────────────────────┤<─────────────────────────────┤
       │   (GAS FEE = 0)              │                              │
       │                              │                              │
```

## 🔐 Güvenlik Notları

1. ✅ Private API Key backend'de
2. ✅ Public API Key frontend'de
3. ✅ CORS yapılandırıldı
4. ⚠️ Production için rate limiting ekleyin
5. ⚠️ Production'da HTTPS kullanın

## 🐛 Sorun Giderme

### "Backend connection error"
- Backend'in çalıştığını kontrol edin: `http://localhost:3001/health`
- CORS hatası varsa backend'teki CORS ayarlarını kontrol edin

### "Private API key required"
- `.env` dosyasında `ENOKI_PRIVATE_API_KEY` ayarlı mı kontrol edin
- Key'in `enoki_private_` ile başladığından emin olun

### "Transaction sponsorship failed"
- Enoki Dashboard'da sponsorluk bakiyenizi kontrol edin
- Rate limit'e takılmış olabilirsiniz

## 📚 İlgili Dosyalar

- `backend/server.js` - Backend API
- `backend/README.md` - Backend dokümantasyonu
- `frontend/src/sponsoredTransaction.ts` - Frontend helper
- `frontend/src/ProfileEditor.tsx` - Sponsorlu işlem kullanımı

## 🎉 Sonuç

Artık kullanıcılarınız:
- 🔐 Google ile giriş yapabilir
- 🎁 Gas fee ödemeden işlem yapabilir
- ⚡ Anında profil oluşturabilir
- 🚀 Web2 deneyimi yaşayabilir!

