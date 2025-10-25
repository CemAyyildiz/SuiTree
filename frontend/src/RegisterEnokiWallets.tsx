import { useSuiClientContext } from '@mysten/dapp-kit';
import { registerEnokiWallets, isEnokiNetwork } from '@mysten/enoki';
import { SuiClient, getFullnodeUrl } from '@mysten/sui/client';
import { useEffect, useMemo } from 'react';

/**
 * RegisterEnokiWallets Component
 * 
 * Registers Enoki wallets using the wallet-standard.
 * This component should be rendered before the WalletProvider.
 * 
 * Based on: https://docs.enoki.mystenlabs.com/ts-sdk/register
 */
export function RegisterEnokiWallets() {
  const { network } = useSuiClientContext();
  
  // Create a proper SuiClient instance for Enoki using the correct network
  const suiClient = useMemo(() => {
    const url = getFullnodeUrl(network as 'mainnet' | 'testnet' | 'devnet' | 'localnet');
    return new SuiClient({ url });
  }, [network]);

  useEffect(() => {
    // Only register on Enoki-supported networks (testnet/mainnet)
    if (!isEnokiNetwork(network)) {
      console.log('⚠️ Network not supported by Enoki:', network);
      return;
    }

    const apiKey = import.meta.env.VITE_ENOKI_API_KEY;
    const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    if (!apiKey) {
      console.error('❌ VITE_ENOKI_API_KEY not found in environment variables');
      return;
    }

    if (!googleClientId) {
      console.error('❌ VITE_GOOGLE_CLIENT_ID not found in environment variables');
      return;
    }

    // Get the current URL for OAuth redirect (without hash)
    // Use production URL if available, otherwise current origin
    const productionUrl = import.meta.env.VITE_PRODUCTION_URL;
    const redirectUrl = productionUrl || (window.location.origin + '/');
    
    console.log('🔧 Registering Enoki wallets...');
    console.log('  - Network:', network);
    console.log('  - API Key:', apiKey.substring(0, 20) + '...');
    console.log('  - Google Client ID:', googleClientId.substring(0, 20) + '...');
    console.log('  - Redirect URL:', redirectUrl);

    // Register Enoki wallets with configured auth providers
    const { unregister } = registerEnokiWallets({
      apiKey,
      providers: {
        google: {
          clientId: googleClientId,
          redirectUrl: redirectUrl, // Specify the correct redirect URL
        },
        // Add more providers as needed:
        // facebook: {
        //   clientId: 'YOUR_FACEBOOK_CLIENT_ID',
        //   redirectUrl: redirectUrl,
        // },
        // twitch: {
        //   clientId: 'YOUR_TWITCH_CLIENT_ID',
        //   redirectUrl: redirectUrl,
        // },
      },
      client: suiClient,
      network,
    });

    console.log('✅ Enoki wallets registered successfully!');
    console.log('   Google wallet is now available in wallet list');

    // Cleanup function - unregister wallets when component unmounts
    // or when network changes
    return () => {
      console.log('🧹 Unregistering Enoki wallets...');
      unregister();
    };
  }, [suiClient, network]);

  // This component doesn't render anything
  return null;
}
