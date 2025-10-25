# 🧪 Test Profil Oluşturma

## Adım Adım Link Ekleme

### 1️⃣ HomePage'den Edit
```
1. http://localhost:5173 'e git
2. Cüzdan bağlı olmalı
3. "Cem" profilini bul
4. "Edit" butonuna tıkla
```

### 2️⃣ Link Ekle (Var Olan Profile)
```
1. Edit sayfasında "Links" bölümüne in
2. "+ Free Link" tıkla
3. Prompt'lara cevap ver:
   - Label: "Twitter"
   - URL: "https://twitter.com/yourhandle"
4. Transaction onayla
5. Başarılı! ✅
```

### 3️⃣ Veya Yeni Profil Oluştur (Linklerle Birlikte)
```
1. "+ Create New Profile" tıkla
2. Form doldur:
   - Title: "Cem's Links"
   - Avatar: Bir image URL veya IPFS CID
   - Bio: "My awesome links"
   - Username: "cem2" (farklı bir username)
3. "+ Free Link" tıkla
   - Label: "Website"
   - URL: "https://example.com"
4. "+ Free Link" tekrar tıkla
   - Label: "GitHub"  
   - URL: "https://github.com/..."
5. "💰 Premium Link" tıkla
   - Label: "Exclusive Content"
   - URL: "https://premium-content.com"
   - Price: "0.1" (SUI)
6. "Create Profile" tıkla
7. Transaction onayla
8. Yeni profile `/cem2` 'den ulaş
```

---

## 🔍 Console'da Ne Görmeli?

Sayfayı refresh et ve F12 → Console'a bak:

**Profile yüklenirken:**
```javascript
Profile raw data: {
  title: "Cem",
  bio: "CEM LİNKLER",
  links: [...],  // ← Bu array'e bak!
  ...
}

Links raw data: [...]  // ← Kaç link var?

Parsed links: [
  { label: "...", url: "...", is_premium: false, price: "0" }
]
```

**Eğer links: [] (boş array) ise:**
→ Profile'de link yok, eklemelisin!

---

## ✅ Başarılı Görünüm

Link ekledikten sonra `/cem` sayfası:

```
🌳
Cem
CEM LİNKLER

┌─────────────────────┐
│    Twitter          │  ← Tıklanabilir
└─────────────────────┘

┌─────────────────────┐
│    GitHub           │  ← Tıklanabilir
└─────────────────────┘

┌─────────────────────┐  ← Altın border
│ Exclusive  🔒 0.1 SUI│  ← Premium link
└─────────────────────┘

0 views
```

---

## 🐛 Sorun Giderme

### "Transaction Failed"
**Sebep:** Gas yetersiz veya network hatası
**Çözüm:**
- Cüzdanda SUI var mı kontrol et
- Testnet seçili mi kontrol et
- Transaction'ı tekrar dene

### "Profile Not Found" 
**Sebep:** Object ID yanlış veya network yanlış
**Çözüm:**
- PACKAGE_ID doğru mu?
- Wallet testnet'te mi?
- Profile gerçekten var mı? (HomePage'de görünüyor mu?)

### Linkler Hala Görünmüyor
**Sebep:** Eski contract ile oluşturulmuş profile
**Çözüm:**
1. Contract'ı **YENİ** publish et
2. Constants güncelle
3. **YENİ** profil oluştur
4. Bu sefer create sırasında linkleri ekle

---

## 🎯 Hızlı Test Scripti

Console'da (F12) şunu çalıştır:

```javascript
// Profile data kontrol
console.log("Profile Links:", profile?.links || "No profile loaded");

// Link sayısı
console.log("Link Count:", profile?.links?.length || 0);

// Her link detayı
profile?.links?.forEach((link, i) => {
  console.log(`Link ${i}:`, link.label, "→", link.url, 
    link.is_premium ? `💰 ${link.price}` : "Free");
});
```

---

## 📝 Önemli Notlar

1. **Link Ekleme:**
   - Create sırasında: Local state'e eklenir, transaction'da oluşturulur
   - Edit sırasında: Her link ayrı transaction

2. **Premium Linkler:**
   - Altın border
   - 🔒 simgesi + fiyat
   - Ödeme modalı
   - Bir kez öde, sonsuza kadar erişim

3. **Username:**
   - Küçük harf + sayı only
   - Benzersiz olmalı
   - Opsiyonel (boş bırakılabilir)

---

**Şimdi dene ve sonucu söyle! 🚀**

