# zkLogin ve Enoki Kurulum Rehberi

Bu rehber, SuiTree projesine zkLogin ve Enoki entegrasyonunu nasıl kullanacağınızı açıklar.

## 📋 Gereksinimler

1. **Enoki API Key** - Mysten Labs'den alınır
2. **Google OAuth Client ID** - Google Cloud Console'dan alınır

---

## 🔑 1. Enoki API Key Alma

### Adımlar:

1. **Enoki Portal'a giriş yapın:**
   - [https://portal.enoki.mystenlabs.com/](https://portal.enoki.mystenlabs.com/) adresine gidin
   
2. **Hesap oluşturun veya giriş yapın:**
   - Google veya GitHub hesabınızla giriş yapabilirsiniz
   
3. **Yeni bir API Key oluşturun:**
   - Dashboard'da "API Keys" bölümüne gidin
   - "Create New API Key" butonuna tıklayın
   - Key'inize bir isim verin (örn: "SuiTree Development")
   - **Network**: "Testnet" seçin (veya production için "Mainnet")
   
4. **API Key'i kopyalayın:**
   - Oluşturulan API Key'i güvenli bir yere kaydedin
   - ⚠️ Bu key'i bir daha göremeyeceksiniz!

---

## 🌐 2. Google OAuth Client ID Alma

### Adımlar:

1. **Google Cloud Console'a gidin:**
   - [https://console.cloud.google.com/](https://console.cloud.google.com/)
   
2. **Yeni bir proje oluşturun veya mevcut projeyi seçin:**
   - Üst menüden "Select a project" → "New Project"
   - Proje adı: "SuiTree" (veya istediğiniz bir isim)
   
3. **APIs & Services'e gidin:**
   - Sol menüden "APIs & Services" → "Credentials"
   
4. **OAuth Consent Screen'i yapılandırın:**
   - "OAuth consent screen" sekmesine gidin
   - **User Type**: "External" seçin
   - **App name**: SuiTree
   - **User support email**: Email adresiniz
   - **Developer contact information**: Email adresiniz
   - "Save and Continue"
   
5. **Scopes ekleyin:**
   - "Add or Remove Scopes" butonuna tıklayın
   - Şu scope'ları seçin:
     - `openid`
     - `email`
     - `profile`
   - "Update" → "Save and Continue"
   
6. **Test users ekleyin (Development için):**
   - "Add Users" butonuna tıklayın
   - Test için kullanacağınız Gmail adreslerini ekleyin
   - "Save and Continue"
   
7. **OAuth Client ID oluşturun:**
   - "Credentials" sekmesine geri dönün
   - "Create Credentials" → "OAuth client ID"
   - **Application type**: "Web application"
   - **Name**: "SuiTree Web Client"
   - **Authorized JavaScript origins**:
     - `http://localhost:5173` (development)
     - Production domain'inizi ekleyin (örn: `https://suitree.walrus.site`)
   - **Authorized redirect URIs**:
     - `http://localhost:5173` (development)
     - Production domain'inizi ekleyin
   - "Create"
   
8. **Client ID'yi kopyalayın:**
   - Oluşturulan "Client ID" değerini kopyalayın
   - Şuna benzer olacak: `123456789-abc123xyz.apps.googleusercontent.com`

---

## ⚙️ 3. .env Dosyasını Yapılandırma

### Adımlar:

1. **frontend/.env.example dosyasını kopyalayın:**
   ```bash
   cd frontend
   cp .env.example .env
   ```

2. **.env dosyasını düzenleyin:**
   ```bash
   # Enoki API Key (https://portal.enoki.mystenlabs.com/ adresinden alabilirsiniz)
   VITE_ENOKI_API_KEY=enk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx

   # Google OAuth Client ID (https://console.cloud.google.com/ adresinden alabilirsiniz)
   VITE_GOOGLE_CLIENT_ID=123456789-abc123xyz.apps.googleusercontent.com
   ```

3. **Key'leri yapıştırın:**
   - `VITE_ENOKI_API_KEY`: Enoki Portal'dan aldığınız API Key
   - `VITE_GOOGLE_CLIENT_ID`: Google Cloud Console'dan aldığınız Client ID

---

## 🚀 4. Bağımlılıkları Yükleme ve Çalıştırma

### Adımlar:

1. **Node modüllerini yükleyin:**
   ```bash
   cd frontend
   pnpm install
   ```
   
   veya npm kullanıyorsanız:
   ```bash
   npm install
   ```

2. **Development server'ı başlatın:**
   ```bash
   pnpm dev
   ```
   
   veya:
   ```bash
   npm run dev
   ```

3. **Tarayıcınızda açın:**
   - [http://localhost:5173](http://localhost:5173)

---

## 🎯 5. zkLogin Kullanımı

### Kullanıcı Arayüzü:

1. **Ana sayfayı açın:**
   - Admin panelinin sağ üst köşesinde "zkLogin ile Giriş" kartını göreceksiniz

2. **Google ile giriş yapın:**
   - "Google ile Giriş Yap" butonuna tıklayın
   - Google hesabınızı seçin
   - İzinleri onaylayın

3. **Bağlı durumu kontrol edin:**
   - Başarılı girişten sonra, Sui adresinizi göreceksiniz
   - Artık zkLogin adresi ile işlem yapabilirsiniz

4. **Çıkış yapmak için:**
   - "Çıkış Yap" butonuna tıklayın

---

## 🔧 Teknik Detaylar

### Kullanılan Paketler:
- `@mysten/enoki`: Enoki SDK
- `@mysten/zklogin`: zkLogin SDK
- `@mysten/dapp-kit`: Sui dApp toolkit
- `@mysten/sui`: Sui TypeScript SDK

### Dosya Yapısı:
```
frontend/
├── .env                    # Environment variables (GİT'E EKLEMEYİN!)
├── .env.example           # Şablon dosya
├── src/
│   ├── enokiConfig.ts     # Enoki yapılandırması
│   ├── ZkLoginButton.tsx  # zkLogin giriş bileşeni
│   ├── main.tsx           # EnokiFlowProvider ile güncellendi
│   └── App.tsx            # ZkLoginButton eklendi
```

---

## 🐛 Sorun Giderme

### "API Key is invalid" hatası:
- Enoki API Key'inizi doğru kopyaladığınızdan emin olun
- Başında veya sonunda boşluk olmadığını kontrol edin
- Key'in testnet/mainnet ayarını kontrol edin

### "Redirect URI mismatch" hatası:
- Google Cloud Console'da Authorized Redirect URIs'ı kontrol edin
- Development için `http://localhost:5173` eklenmiş olmalı
- Production URL'inizi de eklemeyi unutmayın

### "Access blocked" hatası:
- OAuth Consent Screen'de test users listesine email'inizi ekleyin
- Uygulama henüz "In production" değilse, sadece test users giriş yapabilir

### .env dosyası okunmuyor:
- Dosya adının tam olarak `.env` olduğundan emin olun
- Development server'ı yeniden başlatın (Vite .env değişikliklerini otomatik yüklemez)
- `VITE_` prefix'i ile başladığından emin olun

---

## 🔒 Güvenlik Notları

⚠️ **ÖNEMLİ:**
- `.env` dosyasını asla Git'e eklemeyin
- API Key'lerinizi kimseyle paylaşmayın
- Production için ayrı API Key kullanın
- Google OAuth'u production'a alırken "Publish" etmeyi unutmayın

---

## 📚 Faydalı Linkler

- [Enoki Dokümantasyonu](https://docs.mystenlabs.com/enoki)
- [zkLogin Dokümantasyonu](https://docs.sui.io/concepts/cryptography/zklogin)
- [Google OAuth Rehberi](https://developers.google.com/identity/protocols/oauth2)
- [Sui Developer Portal](https://docs.sui.io/)

---

## ✅ Kurulum Tamamlandı!

Artık zkLogin ve Enoki entegrasyonu hazır. Kullanıcılar Google hesapları ile güvenli bir şekilde uygulamanıza giriş yapabilir.

Sorularınız için: [Sui Discord](https://discord.gg/sui) 🌊

