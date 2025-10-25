# 🔐 Enoki zkLogin Kurulum Rehberi

SuiTree artık Enoki zkLogin entegrasyonu ile Google hesabınızla giriş yapmanızı sağlıyor!

## 📋 Gereksinimler

### 1. Enoki API Key

1. [Enoki Portal](https://enoki.mystenlabs.com/) adresine gidin
2. Hesap oluşturun veya giriş yapın
3. Yeni bir uygulama oluşturun
4. API Key'inizi kopyalayın

### 2. Google OAuth Client ID

1. [Google Cloud Console](https://console.cloud.google.com/) adresine gidin
2. Yeni bir proje oluşturun veya mevcut projeyi seçin
3. **APIs & Services > Credentials** menüsüne gidin
4. **Create Credentials > OAuth 2.0 Client ID** seçeneğini tıklayın
5. Application type olarak **Web application** seçin
6. **Authorized redirect URIs** kısmına şunları ekleyin:
   - `http://localhost:5174` (development için)
   - Production URL'iniz (örn: `https://suitree.walrus.site`)
7. Client ID'nizi kopyalayın

## ⚙️ Kurulum

### 1. Environment Variables

`frontend` klasöründe `.env` dosyası oluşturun:

```bash
cd frontend
touch .env
```

`.env` dosyasını aşağıdaki içerikle doldurun:

```env
# Enoki API Key (https://enoki.mystenlabs.com/ adresinden alın)
VITE_ENOKI_API_KEY=enoki_public_xxxxxxxxxxxxxxxxx

# Google OAuth Client ID (https://console.cloud.google.com/ adresinden alın)
VITE_GOOGLE_CLIENT_ID=xxxxxxxxx.apps.googleusercontent.com

# Package ID (Sui smart contract deploy ettikten sonra buraya yazın)
VITE_PACKAGE_ID=0xYOUR_PACKAGE_ID
```

### 2. Bağımlılıkları Yükleyin

```bash
cd frontend
npm install
# veya
pnpm install
```

### 3. Development Sunucusunu Başlatın

```bash
npm run dev
# veya
pnpm dev
```

## 🚀 Kullanım

1. Uygulamayı açın: `http://localhost:5174`
2. **"🔐 Google ile Giriş Yap"** butonuna tıklayın
3. Google hesabınızı seçin
4. İzinleri onaylayın
5. Otomatik olarak uygulamaya geri döneceksiniz
6. zkLogin cüzdanınız otomatik oluşturulacak!

## 🔍 Nasıl Çalışır?

### zkLogin Akışı

1. **Başlangıç**: Kullanıcı "Google ile Giriş Yap" butonuna tıklar
2. **OAuth**: Google OAuth sayfasına yönlendirilir
3. **JWT**: Google JWT token döner
4. **zkProof**: Enoki backend'i zkProof oluşturur
5. **Cüzdan**: Kullanıcının zkLogin cüzdanı oluşturulur
6. **İşlem**: Kullanıcı blockchain'de işlem yapabilir

### Kod Yapısı

```
frontend/src/
├── enokiConfig.ts          # Enoki yapılandırması
├── main.tsx                # EnokiFlowProvider entegrasyonu
├── App.tsx                 # OAuth callback handler
└── ZkLoginButton.tsx       # Google login butonu + UI
```

## 🛠️ Sorun Giderme

### "Google Client ID bulunamadı" Hatası

- `.env` dosyasının `frontend/` klasöründe olduğundan emin olun
- `VITE_GOOGLE_CLIENT_ID` değişkeninin doğru ayarlandığını kontrol edin
- Development sunucusunu yeniden başlatın

### OAuth Redirect Hatası

- Google Cloud Console'da redirect URI'larını kontrol edin
- Development için: `http://localhost:5174`
- Production için: Kendi domain'iniz

### "Enoki API Key" Hatası

- Enoki Portal'dan API Key aldığınızdan emin olun
- `.env` dosyasında `VITE_ENOKI_API_KEY` değişkenini ayarlayın
- API Key'in başında `enoki_public_` prefix'i olmalı

## 📚 Daha Fazla Bilgi

- [Enoki Documentation](https://docs.mystenlabs.com/enoki)
- [zkLogin Overview](https://docs.sui.io/concepts/cryptography/zklogin)
- [Google OAuth Setup](https://developers.google.com/identity/protocols/oauth2)

## 🎯 Özellikler

- ✅ Google ile tek tıkla giriş
- ✅ Cüzdan indirmeye gerek yok
- ✅ Seed phrase hatırlamaya gerek yok
- ✅ Otomatik cüzdan oluşturma
- ✅ Sui blockchain üzerinde tam işlem desteği
- ✅ Sponsorlu işlem desteği (gas fee yok!)

---

**Not**: Bu özellik testnet üzerinde çalışmaktadır. Mainnet için Enoki yapılandırmanızı güncellemeniz gerekebilir.

