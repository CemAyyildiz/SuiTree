# 🎉 Walrus Deployment Başarılı!

## 📅 Deploy Tarihi
**25 Ekim 2025 - Saat 10:24**

---

## 🌐 Site Erişim Bilgileri

### TRWal Portal (Testnet)
**Ana URL:**
```
https://65bptoh2u9od2fi2h5hlg4hxypjvbeyjvux3gwmrkq2uobk3fr.trwal.app
```

### Sui Object Bilgileri
- **Site Object ID:** `0xf6aaf78cbfc0f6c1d39b677ad5294b01e569265e64edc2b91a2d6a9a2b61f967`
- **B36 Encoded ID:** `65bptoh2u9od2fi2h5hlg4hxypjvbeyjvux3gwmrkq2uobk3fr`
- **Network:** Testnet
- **Package ID:** `0xf99aee9f21493e1590e7e5a9aea6f343a1f381031a04a732724871fc294be799`

---

## 📦 Deploy Edilen Kaynaklar

### 1. HTML
- **Dosya:** `/index.html`
- **Blob ID:** `gebQ30_K-Qzq_k5hd-i3rOkKefdQwj0QX_YGZm97MMY`

### 2. JavaScript
- **Dosya:** `/assets/index-Dfa7I0ap.js`
- **Blob ID:** `35rzPHjoQa_VPVDdpedP8ryWpiBo0LMVU8g_URAPCtU`
- **Boyut:** ~628 KB

### 3. CSS
- **Dosya:** `/assets/index-VkVqEY7f.css`
- **Blob ID:** `kdjovVbfN8blkbPxf-_tE1lgbKM34fA7-LLY2HnjrS0`
- **Boyut:** ~701 KB

### 4. Redirects
- **Dosya:** `/_redirects`
- **Blob ID:** `83GRn4sOEoMvaYR8h0iKfyeyswfqogGvcltnXqx8WTo`

---

## 🔧 Kullanılan Konfigürasyon

### Walrus CLI
- **Version:** 1.35.1-86dba786744a
- **Binary Path:** `/Users/cemayyildiz/.local/bin/walrus`
- **Config Path:** `/Users/cemayyildiz/.config/walrus/client_config.yaml`

### Site-Builder
- **Binary Path:** `/Users/cemayyildiz/Desktop/projects/SuiTree/walrus-sites/target/release/site-builder`
- **Config Path:** `sites-config-trwal.yaml`
- **Portal:** `trwal.app`

### Sui Wallet
- **Active Address:** `0xb3900e01dbd1b9b66794053d9237145739c37398df07b15b55c2d47a6bb73f24`
- **Network:** Testnet
- **RPC:** `https://fullnode.testnet.sui.io:443`

---

## 📝 Deploy Komutu

```bash
cd /Users/cemayyildiz/Desktop/projects/SuiTree/frontend

# Build
pnpm build

# Deploy
/Users/cemayyildiz/Desktop/projects/SuiTree/walrus-sites/target/release/site-builder \
  --config sites-config-trwal.yaml \
  publish --epochs 1 ./dist
```

---

## 🔄 Güncelleme (Update) Komutu

Mevcut siteyi güncellemek için:

```bash
cd /Users/cemayyildiz/Desktop/projects/SuiTree/frontend

# Değişiklikleri yap ve build et
pnpm build

# Update komutu
/Users/cemayyildiz/Desktop/projects/SuiTree/walrus-sites/target/release/site-builder \
  --config sites-config-trwal.yaml \
  update --epochs 1 ./dist
```

---

## 💰 Maliyet Bilgileri (Testnet)

### WAL Token
- **İlk Exchange:** 1 MIST → WAL (yetersiz)
- **İkinci Exchange:** 0.100 SUI → WAL (yeterli)
- **Storage Epochs:** 1 epoch
- **Gas Budget:** 500,000,000 MIST (0.5 SUI)

### SUI Balance (Deploy Sonrası)
Kalan SUI: ~0.3 SUI

---

## 🎯 Özellikler

✅ **Decentralized Hosting:** Walrus ağında tamamen merkezi olmayan hosting  
✅ **Censorship Resistant:** Sansüre karşı dirençli  
✅ **Sui Ecosystem:** Sui blockchain entegrasyonu  
✅ **TRWal Portal:** Türkiye topluluğu tarafından sağlanan portal  
✅ **Hash Routing:** SPA uyumlu client-side routing  

---

## 🌐 Profil URL Yapısı

Siteniz artık Walrus'ta canlı! Kullanıcılar şu şekilde erişebilir:

### Ana Sayfa
```
https://65bptoh2u9od2fi2h5hlg4hxypjvbeyjvux3gwmrkq2uobk3fr.trwal.app/
```

### Profil Sayfaları (Hash Routing)
```
https://65bptoh2u9od2fi2h5hlg4hxypjvbeyjvux3gwmrkq2uobk3fr.trwal.app/#/username
https://65bptoh2u9od2fi2h5hlg4hxypjvbeyjvux3gwmrkq2uobk3fr.trwal.app/#/profile/0x...
https://65bptoh2u9od2fi2h5hlg4hxypjvbeyjvux3gwmrkq2uobk3fr.trwal.app/#/create
```

---

## 🔗 Sui Explorer

Site object'ini Sui Explorer'da görüntüle:

**Testnet Explorer:**
```
https://testnet.suivision.xyz/object/0xf6aaf78cbfc0f6c1d39b677ad5294b01e569265e64edc2b91a2d6a9a2b61f967
```

**SuiScan:**
```
https://suiscan.xyz/testnet/object/0xf6aaf78cbfc0f6c1d39b677ad5294b01e569265e64edc2b91a2d6a9a2b61f967
```

---

## 🚀 Mainnet'e Deploy İçin

Mainnet'e deploy etmek için:

1. **Mainnet SUI Token Al**
   - Mainnet cüzdanına SUI transfer et
   - Exchange ile WAL token al

2. **Config'i Mainnet'e Çevir**
   ```yaml
   default_context: mainnet  # testnet yerine
   ```

3. **Sui Ortamını Mainnet'e Al**
   ```bash
   sui client switch --env mainnet
   ```

4. **Deploy Et**
   ```bash
   /Users/cemayyildiz/Desktop/projects/SuiTree/walrus-sites/target/release/site-builder \
     --config sites-config-trwal.yaml \
     publish --epochs 10 ./dist
   ```

5. **Mainnet Portal Erişimi**
   ```
   https://<b36-id>.wal.app/
   ```

---

## 📚 Kullanışlı Komutlar

### B36 ID'yi Öğren
```bash
/Users/cemayyildiz/Desktop/projects/SuiTree/walrus-sites/target/release/site-builder \
  --config sites-config-trwal.yaml \
  convert 0xf6aaf78cbfc0f6c1d39b677ad5294b01e569265e64edc2b91a2d6a9a2b61f967
```

### Site Bilgilerini Listele
```bash
/Users/cemayyildiz/Desktop/projects/SuiTree/walrus-sites/target/release/site-builder \
  --config sites-config-trwal.yaml \
  list-directory ./dist
```

### WAL Token Bakiyesi
```bash
walrus info
```

### Sui Gas Bakiyesi
```bash
sui client gas
```

---

## 🐛 Troubleshooting

### Site Açılmıyor?
1. URL'yi kontrol et (doğru B36 ID kullanıldı mı?)
2. TRWal portal'ın testnet desteği aktif mi?
3. Browser cache temizle (Cmd+Shift+R)

### 404 Hatası?
- Hash routing kullanıldığından emin ol (`/#/`)
- `_redirects` dosyası doğru deploy edildi mi kontrol et

### Blob ID Bulunamıyor?
- Walrus ağı sağlıklı mı kontrol et
- Epoch süresi dolmadı mı kontrol et (1 epoch = ~24 saat testnet'te)

### WAL Token Yetersiz?
```bash
walrus get-wal --amount 100000000  # 0.1 SUI karşılığı
```

---

## 🎊 Tebrikler!

SuiTree projeniz artık **tamamen decentralized** bir şekilde Walrus üzerinde canlı! 🌳🐘

**Sıradaki Adımlar:**
- ✅ Siteyi test et
- ✅ Topluluk ile paylaş
- ✅ SuiNS domain bağla (opsiyonel)
- ✅ Mainnet'e deploy et (production için)
- ✅ Epochs'u artır (daha uzun saklama)

---

**Deploy Tarihi:** 25 Ekim 2025  
**Deploy Eden:** Cem Ayyıldız  
**Proje:** SuiTree - Decentralized LinkTree on Sui  
**Portal:** TRWal (Türkiye Walrus Portal)

🚀 Happy Building on Sui! 🚀

