# 🧪 Test Subdomain Locally

## ✅ Implementation Complete!

Subdomain-based routing is now active. Here's how to test it locally:

---

## 1️⃣ Update /etc/hosts

### Mac/Linux:

```bash
sudo nano /etc/hosts
```

Add these lines:
```
127.0.0.1 cem.localhost
127.0.0.1 alice.localhost  
127.0.0.1 suitree.localhost
```

Save: `Ctrl+X`, then `Y`, then `Enter`

### Windows:

```
notepad C:\Windows\System32\drivers\etc\hosts
```

Add same lines as above.

---

## 2️⃣ Start Dev Server

```bash
cd frontend
pnpm dev
```

Should see:
```
VITE v7.1.12  ready in 97 ms
➜  Local:   http://localhost:5173/
```

---

## 3️⃣ Test URLs

Open browser and test:

### Admin Dashboard (Main Site):
```
http://localhost:5173/
```

**Expected:**
- 🌳 SuiTree header
- Connect Wallet button
- "My Profiles" section
- "+ Create New Profile" button

### User Profile (Subdomain):
```
http://cem.localhost:5173/
```

**Expected:**
- "Powered by SuiTree 🌳" header (small)
- Profile content (if cem username exists)
- OR "Username @cem not found" (if doesn't exist)

### Another User:
```
http://alice.localhost:5173/
```

**Expected:**
- Alice's profile (if exists)
- OR "Username @alice not found"

---

## 4️⃣ Create Test Profile

1. Go to: `http://localhost:5173/`
2. Connect wallet
3. Click "+ Create New Profile"
4. Fill form:
   ```
   Title: Cem
   Avatar: https://i.imgur.com/example.jpg
   Bio: My awesome links
   Username: cem
   ```
5. Click "+ Free Link":
   - Label: "Twitter"
   - URL: "https://twitter.com/yourhandle"
6. Click "Create Profile"
7. Transaction onayla ✅

---

## 5️⃣ View Your Profile

After creating profile:

```
http://cem.localhost:5173/
```

**Expected:**
- Avatar displayed
- Title: "Cem"
- Bio: "My awesome links"  
- Twitter link (clickable)
- View count

---

## 📝 How It Works

### URL Detection:

```
localhost:5173
↓
hostname = 'localhost'
↓
Admin mode ✅

cem.localhost:5173
↓
hostname = 'cem.localhost'
parts = ['cem', 'localhost']
↓
subdomain = 'cem'
↓
Profile mode for 'cem' ✅
```

### In Production:

```
suitree.walrus.site
↓
Admin mode

cem.suitree.walrus.site
↓
Profile mode for 'cem'
```

---

## 🔍 Debug Console

Open browser console (F12) and check:

```javascript
// Check what mode is detected
console.log(window.location.hostname);

// On localhost:5173
// → "localhost" (admin mode)

// On cem.localhost:5173
// → "cem.localhost" (profile mode)
```

---

## ✅ Expected Behavior

| URL | Mode | What Shows |
|-----|------|------------|
| `localhost:5173` | Admin | Dashboard + Wallet |
| `cem.localhost:5173` | Profile | Cem's profile |
| `alice.localhost:5173` | Profile | Alice's profile |
| `www.localhost:5173` | Admin | Dashboard |

---

## 🐛 Troubleshooting

### "This site can't be reached"

**Problem:** Subdomain DNS not working

**Solution:**
```bash
# Verify /etc/hosts
cat /etc/hosts | grep localhost

# Should show:
# 127.0.0.1 cem.localhost
```

### "Username not found"

**Problem:** Profile doesn't exist yet

**Solution:**
1. Create profile on admin dashboard
2. Make sure username matches subdomain
3. Check username registered on blockchain

### Still showing admin on subdomain

**Problem:** Detection logic not working

**Solution:**
```javascript
// Add debug in App.tsx
console.log('Hostname:', window.location.hostname);
console.log('Parts:', window.location.hostname.split('.'));
console.log('Mode:', mode);
```

---

## 🎯 Next Steps

After local testing works:

1. ✅ Test all features locally
2. ✅ Build: `pnpm build`
3. ✅ Upload to Walrus
4. ✅ Configure DNS
5. ✅ Test production
6. ✅ Share your link!

---

**Happy testing! 🌳**

Your subdomain routing is ready for Walrus deployment!

