# 🌳 SuiTree Backend API

Backend API for SuiTree - Handles sponsored transactions with Enoki (Gas Fee Free!)

## 🚀 Quick Start

### 1️⃣ Install Dependencies

```bash
cd backend
npm install
```

### 2️⃣ Configure Environment

Create `.env` file:

```bash
cp .env.example .env
```

Edit `.env` and add your **Private Enoki API Key**:

```env
ENOKI_PRIVATE_API_KEY=enoki_private_xxxxxxxxxxxxxxxxx
PORT=3001
```

### 3️⃣ Get Private Enoki API Key

1. Go to [Enoki Portal](https://enoki.mystenlabs.com/)
2. Select your app
3. Go to **API Keys** tab
4. Click **"Create Private API Key"** (NOT public!)
5. Copy the key and paste into `.env`

⚠️ **IMPORTANT**: Never commit `.env` to git!

### 4️⃣ Start Server

```bash
npm run dev
```

Or for production:

```bash
npm start
```

Server will start at: **http://localhost:3001**

## 📡 API Endpoints

### Health Check

```bash
GET /health
```

Response:
```json
{
  "status": "ok",
  "message": "SuiTree Backend API is running",
  "enokiConfigured": true
}
```

### Sponsor Transaction

```bash
POST /api/sponsor-transaction
Content-Type: application/json

{
  "transactionBytes": "base64_encoded_transaction",
  "sender": "0x..."
}
```

Response:
```json
{
  "success": true,
  "sponsoredTransaction": {
    "bytes": "...",
    "digest": "..."
  }
}
```

### Execute Sponsored Transaction

```bash
POST /api/execute-sponsored-transaction
Content-Type: application/json

{
  "digest": "transaction_digest",
  "signature": "user_signature"
}
```

Response:
```json
{
  "success": true,
  "result": {
    "digest": "...",
    "effects": {...}
  }
}
```

## 🔐 Security Notes

1. **Private API Key**: Never expose your private Enoki API key
2. **CORS**: Currently allows all origins (configure for production)
3. **Rate Limiting**: Add rate limiting for production
4. **Validation**: Add more input validation
5. **HTTPS**: Use HTTPS in production

## 🛠️ Development

Start with auto-reload:

```bash
npm run dev
```

## 📦 Dependencies

- `express` - Web server
- `cors` - CORS middleware
- `@mysten/enoki` - Enoki SDK for sponsored transactions
- `@mysten/sui` - Sui SDK
- `dotenv` - Environment variables

## 🎯 How It Works

```
Frontend (User)
    ↓
1. Create Transaction
    ↓
2. Send to Backend
    ↓
Backend (Private Key)
    ↓
3. Sponsor with Enoki
    ↓
4. Return Sponsored TX
    ↓
Frontend (User)
    ↓
5. Sign & Execute
    ↓
✨ GAS FEE = 0 ✨
```

## 🚨 Troubleshooting

### Error: "Missing ID Token"
- Make sure user is logged in with zkLogin
- Check Enoki configuration in frontend

### Error: "Private API key required"
- Verify your `.env` file has `ENOKI_PRIVATE_API_KEY`
- Make sure you're using **private** key, not public

### Error: "Network error"
- Check if backend server is running
- Verify frontend is pointing to correct backend URL
- Check CORS configuration

## 📚 Learn More

- [Enoki Documentation](https://docs.mystenlabs.com/enoki)
- [Sui Documentation](https://docs.sui.io/)
- [Express.js](https://expressjs.com/)

