# 🚀 zkLogin Hızlı Başlangıç

## Adım 1️⃣: API Key'leri Alın

### Enoki API Key:
1. [https://portal.enoki.mystenlabs.com/](https://portal.enoki.mystenlabs.com/) adresine gidin
2. Giriş yapın ve "Create New API Key" butonuna tıklayın
3. "Testnet" seçin ve key'i kopyalayın

### Google Client ID:
1. [https://console.cloud.google.com/](https://console.cloud.google.com/) adresine gidin
2. Yeni proje oluşturun
3. "APIs & Services" → "Credentials" → "Create Credentials" → "OAuth client ID"
4. "Web application" seçin
5. Authorized JavaScript origins: `http://localhost:5173`
6. Authorized redirect URIs: `http://localhost:5173`
7. Client ID'yi kopyalayın

---

## Adım 2️⃣: .env Dosyasını Oluşturun

`frontend` klasöründe `.env` dosyası oluşturun:

```bash
cd frontend
```

`.env` dosyasına şunları ekleyin:

```env
VITE_ENOKI_API_KEY=buraya_enoki_api_keyinizi_yapıştırın
VITE_GOOGLE_CLIENT_ID=buraya_google_client_id_yapıştırın
```

**Örnek:**
```env
VITE_ENOKI_API_KEY=enk_1234567890abcdefghijk
VITE_GOOGLE_CLIENT_ID=123456-abc123.apps.googleusercontent.com
```

---

## Adım 3️⃣: Paketleri Yükleyin

```bash
pnpm install
```

veya

```bash
npm install
```

---

## Adım 4️⃣: Uygulamayı Başlatın

```bash
pnpm dev
```

veya

```bash
npm run dev
```

---

## Adım 5️⃣: Tarayıcıda Açın

[http://localhost:5173](http://localhost:5173) adresine gidin.

Sağ üst köşede "zkLogin ile Giriş" butonunu göreceksiniz! 🎉

---

## ✅ Tamamlandı!

Artık Google hesabınızla giriş yapabilirsiniz.

**Detaylı kurulum için:** `ZKLOGIN_SETUP.md` dosyasını okuyun.

