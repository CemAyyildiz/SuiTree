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

// Sponsor transaction endpoint
app.post('/api/sponsor-transaction', async (req, res) => {
  try {
    const { transactionBytes, sender } = req.body;

    if (!transactionBytes || !sender) {
      return res.status(400).json({
        error: 'Missing required fields: transactionBytes, sender',
      });
    }

    console.log('🎁 Sponsoring transaction for:', sender);

    // Enoki ile transaction'ı sponsor et
    const sponsoredResponse = await enokiClient.createSponsoredTransaction({
      network: 'testnet',
      transactionKindBytes: transactionBytes,
      sender,
      allowedMoveCallTargets: ['*'], // Tüm move call'lara izin ver
      allowedAddresses: ['*'], // Tüm adreslere izin ver
    });

    console.log('✅ Transaction sponsored successfully!');

    res.json({
      success: true,
      sponsoredTransaction: sponsoredResponse,
    });

  } catch (error) {
    console.error('❌ Error sponsoring transaction:', error);
    
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to sponsor transaction',
    });
  }
});

// Execute sponsored transaction endpoint
app.post('/api/execute-sponsored-transaction', async (req, res) => {
  try {
    const { digest, signature } = req.body;

    if (!digest || !signature) {
      return res.status(400).json({
        error: 'Missing required fields: digest, signature',
      });
    }

    console.log('🚀 Executing sponsored transaction...');

    // Enoki ile transaction'ı execute et
    const executeResponse = await enokiClient.executeSponsoredTransaction({
      digest,
      signature,
    });

    console.log('✅ Transaction executed successfully!', executeResponse);

    res.json({
      success: true,
      result: executeResponse,
    });

  } catch (error) {
    console.error('❌ Error executing transaction:', error);
    
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to execute transaction',
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
║                                                            ║
║  Endpoints:                                                ║
║  • GET  /health                                            ║
║  • POST /api/sponsor-transaction                           ║
║  • POST /api/execute-sponsored-transaction                 ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
  `);
});

