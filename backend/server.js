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

// ==================== Enoki Wallet Standard ====================
// Enoki now uses wallet-standard for authentication
// Custom OAuth endpoints are no longer needed
// Authentication is handled client-side via registerEnokiWallets()

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

    // Enoki'nin resmi API'sini kullan
    // 1. Transaction'ı sponsor et
    const sponsorResponse = await fetch('https://api.enoki.mystenlabs.com/transaction-blocks/sponsor', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.ENOKI_PRIVATE_API_KEY}`,
      },
      body: JSON.stringify({
        network: 'testnet',
        transactionBlockKindBytes: Array.from(txBytes),
      }),
    });

    if (!sponsorResponse.ok) {
      const errorData = await sponsorResponse.json();
      throw new Error(`Enoki sponsor failed: ${errorData.error || sponsorResponse.statusText}`);
    }

    const sponsorData = await sponsorResponse.json();
    console.log('✅ Transaction sponsored by Enoki');

    // 2. Transaction'ı execute et (sponsor-signed transaction)
    const executeResponse = await fetch('https://api.enoki.mystenlabs.com/transaction-blocks/sponsor/' + sponsorData.digest, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.ENOKI_PRIVATE_API_KEY}`,
      },
      body: JSON.stringify({
        signature: sponsorData.signature, // Enoki'nin sponsor signature'ı
      }),
    });

    if (!executeResponse.ok) {
      const errorData = await executeResponse.json();
      throw new Error(`Transaction execution failed: ${errorData.error || executeResponse.statusText}`);
    }

    const result = await executeResponse.json();

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
║  🎁 Sponsored Transactions: ENABLED                        ║
║  🔐 Enoki Wallet Standard: ENABLED                         ║
║                                                            ║
║  Endpoints:                                                ║
║  • GET  /health                                            ║
║  • POST /api/sponsor-and-execute-transaction               ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
  `);
});

