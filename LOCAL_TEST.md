# 🧪 SuiTree Local Test Rehberi

## ✅ Dev Server Durumu
Dev server çalışıyor: **http://localhost:5173**

---

## 🎯 Test Senaryoları

### Test 1: Admin Dashboard (Localhost)

**Adres:** http://localhost:5173

**Ne Görmelisin:**
- 🌳 SuiTree Admin başlığı
- Sağ üstte **Connect Button** (Sui cüzdan bağlantısı)
- Ana sayfada **HomePage** komponenti

**Test Adımları:**
1. Tarayıcıda `http://localhost:5173` aç
2. Sağ üstte "Connect" butonuna tıkla
3. Sui Wallet ile bağlan
4. Sahip olduğun profilleri gör
5. **Create Profile** butonuna tıkla → `http://localhost:5173/#/create`

**Beklenen Davranış:**
- URL'de `#` (hash) olacak → HashRouter kullanıyor
- Admin paneli görünümü

---

### Test 2: Public Profile (Subdomain - Opsiyonel)

Bu test için `/etc/hosts` düzenleme gerekiyor.

#### Hosts Düzenleme:

```bash
sudo nano /etc/hosts
```

En alta ekle:
```
127.0.0.1 cem.localhost
127.0.0.1 alice.localhost
```

Kaydet: `Ctrl+X`, `Y`, `Enter`

#### Test Adresleri:

**Adres:** http://cem.localhost:5173

**Ne Görmelisin:**
- Minimal header: "Powered by SuiTree 🌳"
- "cem" kullanıcısının profil sayfası
- VEYA "Profile not found" (eğer "cem" kullanıcısı yoksa)

**Beklenen Davranış:**
- URL'de `#` YOK → Subdomain routing kullanıyor
- Public profile görünümü
- Cüzdan bağlama butonu YOK

---

## 🔍 Subdomain Detection Nasıl Çalışıyor?

```typescript
// App.tsx içindeki kod:
const hostname = window.location.hostname;

if (hostname === 'localhost' || hostname === '127.0.0.1') {
  // ADMIN MODE
  return <AdminDashboardSite />  // HashRouter + Wallet Connect
}

if (hostname.endsWith('.localhost')) {
  // PROFILE MODE
  const username = hostname.split('.')[0];  // "cem"
  return <PublicProfileSite username={username} />
}
```

---

## 📊 Test Kontrol Listesi

### Admin Dashboard Testleri
- [ ] `http://localhost:5173` açıldı mı?
- [ ] Sağ üstte Connect butonu var mı?
- [ ] HashRouter çalışıyor mu? (URL'de `#` var mı?)
- [ ] Cüzdan bağlanabiliyor mu?
- [ ] Profil listesi görünüyor mu?
- [ ] Create Profile sayfası açılıyor mu?

### Public Profile Testleri (hosts düzenleme sonrası)
- [ ] `http://cem.localhost:5173` açıldı mı?
- [ ] "Powered by SuiTree" header görünüyor mu?
- [ ] URL'de `#` YOK mu?
- [ ] Connect butonu YOK mu?
- [ ] Profil datası yükleniyor mu?

---

## 🚀 Walrus'a Deploy Edilince

**Aynen bu şekilde çalışacak!** Sadece domain değişecek:

```
localhost:5173               → suitree.walrus.site
cem.localhost:5173           → cem.suitree.walrus.site
alice.localhost:5173         → alice.suitree.walrus.site
```

Kod değişikliği gerekmez! 🎉

---

## 🐛 Hata Ayıklama

### "Site açılmıyor"
- Dev server çalışıyor mu? → `pnpm dev --host`
- Port meşgul mü? → Farklı tab'te açık mı?

### "Subdomain çalışmıyor"
- `/etc/hosts` düzenlendi mi?
- Cache temizle: `Cmd+Shift+R` (macOS)
- Tarayıcıyı yeniden başlat

### "Profile not found"
- Blockchain'de "cem" kullanıcısı var mı?
- `REGISTRY_ID` doğru mu? → `frontend/src/constants.ts`
- RPC bağlantısı çalışıyor mu?

---

## 📝 Test Sonrası

Test başarılıysa şunları yap:

1. **Screenshot al** → Subdomain routing çalışıyor
2. **Sui testnet düzelince Walrus'a deploy et**
3. **DNS ayarlarını yap** → Wildcard subdomain

---

## ❓ Sorular

**Q: Subdomain olmadan Walrus'a deploy edebilir miyim?**
A: Evet! Sadece main domain'de admin panel çalışır. Subdomain için DNS ayarı gerekir.

**Q: Local test production ile aynı mı?**
A: Evet! Aynı build, aynı kod. Sadece domain farklı.

**Q: Walrus'ta hash routing gerekir mi?**
A: Admin için EVET (HashRouter). Public profile için HAYIR (direkt subdomain).

