# 🔐 Google OAuth Setup - ZKLogin için Kritik Ayarlar

## ⚠️ ÖNEMLI: Google Cloud Console Ayarları

Google ile giriş yapabilmek için **Google Cloud Console**'da redirect URL'lerini whitelist'e eklemelisin!

### 1. Google Cloud Console'a Git
https://console.cloud.google.com/

### 2. Credentials Sayfasını Aç
1. Sol menüden **APIs & Services** > **Credentials**
2. OAuth 2.0 Client ID'ni bul (VITE_GOOGLE_CLIENT_ID'deki ID)
3. Edit/Düzenle butonuna tıkla

### 3. Authorized Redirect URIs Ekle

**Bu URL'leri mutlaka ekle:**

#### Local Development (Localhost):
```
http://localhost:5173
http://localhost:5173/
http://127.0.0.1:5173
http://127.0.0.1:5173/
```

#### Production (Walrus):
```
https://<YOUR_SITE_ID>.walrus.site
https://<YOUR_SITE_ID>.walrus.site/
```

### 4. Save/Kaydet'e Tıkla

---

## 🔍 Mevcut Ayarlarını Kontrol Et

Google Cloud Console'da şu URL'lerin listelendiğinden emin ol:

**Client ID:** `541635931271-o936v7a2p2j6oil21q88vlv6mdu9jtm3.apps.googleusercontent.com`

**Authorized Redirect URIs listesinde olmalı:**
- ✅ `http://localhost:5173`
- ✅ `http://localhost:5173/`

---

## ❓ Sorun Giderme

### Hata: "redirect_uri_mismatch"
Bu hata, Google'da whitelist'e eklemediğin bir URL'e redirect etmeye çalıştığın anlamına gelir.

**Çözüm:**
1. Browser console'unda şu log'u bul:
   ```
   🔗 Redirect URL: http://localhost:5173
   ```
2. Bu URL'i tam olarak (trailing slash dahil) Google Cloud Console'a ekle
3. Save'e tıkla ve 1-2 dakika bekle
4. Sayfayı yenile ve tekrar dene

### Hata: "invalid_client"
API Key veya Client ID yanlış.

**Çözüm:**
1. `.env` dosyasındaki `VITE_GOOGLE_CLIENT_ID` değerini kontrol et
2. Google Cloud Console'dan doğru Client ID'yi kopyala

---

## 🧪 Test Et

1. Frontend'i çalıştır: `npm run dev`
2. Browser console'u aç (F12)
3. "Google ile Giriş Yap" butonuna tıkla
4. Console'da şu log'ları göreceksin:
   ```
   🔗 Redirect URL: http://localhost:5173
   📝 Creating authorization URL...
   ✅ Authorization URL created: https://accounts.google.com/...
   ```
5. Google giriş sayfası açılmalı
6. Giriş yaptıktan sonra geri dönmeli ve console'da:
   ```
   🔐 OAuth callback detected!
   📞 Calling enokiFlow.handleAuthCallback...
   ✅ handleAuthCallback result: true
   ✅ zkLogin address received: 0x...
   ```

Eğer bu log'ları görmüyorsan, Google OAuth ayarlarını kontrol et!

