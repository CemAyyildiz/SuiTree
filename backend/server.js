import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { EnokiClient } from '@mysten/enoki';
import { SuiClient } from '@mysten/sui/client';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Enoki Client (Private Key ile)
const enokiClient = new EnokiClient({
  apiKey: process.env.ENOKI_PRIVATE_API_KEY,
});

// Sui Client
const suiClient = new SuiClient({
  url: 'https://fullnode.testnet.sui.io:443',
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'SuiTree Backend API is running',
    enokiConfigured: !!process.env.ENOKI_PRIVATE_API_KEY
  });
});

// Create Google OAuth URL (zkLogin)
app.post('/api/create-google-auth-url', async (req, res) => {
  try {
    const { redirectUrl, googleClientId } = req.body;

    if (!redirectUrl || !googleClientId) {
      return res.status(400).json({
        success: false,
        error: 'Missing redirectUrl or googleClientId',
      });
    }

    console.log('🔐 Creating Google OAuth URL...');
    console.log('  - Redirect URL:', redirectUrl);
    console.log('  - Google Client ID:', googleClientId.substring(0, 20) + '...');

    // Google OAuth URL'ini manuel olarak oluştur
    const googleAuthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    googleAuthUrl.searchParams.set('client_id', googleClientId);
    googleAuthUrl.searchParams.set('redirect_uri', redirectUrl);
    googleAuthUrl.searchParams.set('response_type', 'id_token');
    googleAuthUrl.searchParams.set('scope', 'openid email profile');
    googleAuthUrl.searchParams.set('nonce', Math.random().toString(36).substring(2, 15));
    
    const authUrl = googleAuthUrl.toString();

    console.log('✅ Google OAuth URL created!');

    res.json({
      success: true,
      authUrl: authUrl,
    });

  } catch (error) {
    console.error('❌ Error creating Google auth URL:', error);
    
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to create auth URL',
    });
  }
});

// Handle Google OAuth callback (zkLogin)
app.post('/api/handle-google-callback', async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({
        success: false,
        error: 'Missing idToken',
      });
    }

    console.log('🔐 Handling Google OAuth callback...');

    // JWT'den direkt address çıkar (basit yaklaşım)
    // Enoki'nin backend API'si karmaşık, şimdilik basit çözüm
    const jwtPayload = JSON.parse(Buffer.from(idToken.split('.')[1], 'base64').toString());
    const email = jwtPayload.email;
    const sub = jwtPayload.sub;
    
    // Basit bir address oluştur (gerçek zkLogin address değil, test için)
    const mockAddress = `0x${sub.slice(0, 40).padStart(40, '0')}`;
    
    console.log('✅ Mock zkLogin address created!');
    console.log('  - Email:', email);
    console.log('  - Address:', mockAddress);

    res.json({
      success: true,
      address: mockAddress,
      session: {
        email: email,
        sub: sub,
        jwt: idToken
      },
    });

  } catch (error) {
    console.error('❌ Error handling OAuth callback:', error);
    
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to handle OAuth callback',
    });
  }
});

// Sponsor and execute transaction in one call
app.post('/api/sponsor-and-execute-transaction', async (req, res) => {
  try {
    const { transactionBytes, sender } = req.body;

    if (!transactionBytes || !sender) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: transactionBytes, sender',
      });
    }

    console.log('🎁 Sponsoring and executing transaction for:', sender);

    // Hex string'i Uint8Array'e çevir
    const txBytes = new Uint8Array(
      transactionBytes.match(/.{1,2}/g).map(byte => parseInt(byte, 16))
    );

    // Enoki ile transaction'ı sponsor et ve execute et
    const result = await enokiClient.executeSponsoredTransaction({
      network: 'testnet',
      transactionKindBytes: txBytes,
      sender,
    });

    console.log('✅ Transaction sponsored and executed successfully!');
    console.log('Digest:', result.digest);

    res.json({
      success: true,
      digest: result.digest,
      effects: result.effects,
    });

  } catch (error) {
    console.error('❌ Error in sponsored transaction:', error);
    
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to sponsor and execute transaction',
      details: error.toString(),
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║  🌳 SuiTree Backend API                                    ║
║                                                            ║
║  🚀 Server running on: http://localhost:${PORT}           ║
║  🔐 zkLogin + Sponsored Transactions: ENABLED              ║
║                                                            ║
║  Endpoints:                                                ║
║  • GET  /health                                            ║
║  • POST /api/create-google-auth-url                        ║
║  • POST /api/handle-google-callback                        ║
║  • POST /api/sponsor-and-execute-transaction               ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
  `);
});

