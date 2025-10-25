import { Button, Flex, Text } from '@radix-ui/themes';
import { useState, useEffect } from 'react';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

export function ZkLoginButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [zkLoginAddress, setZkLoginAddress] = useState<string | null>(null);

  // LocalStorage'dan zkLogin address'i oku
  useEffect(() => {
    const savedAddress = localStorage.getItem('zkLoginAddress');
    if (savedAddress) {
      setZkLoginAddress(savedAddress);
      console.log('✅ zkLogin address loaded from storage:', savedAddress);
    }
  }, []);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
      console.log('🔑 Google Client ID:', googleClientId?.substring(0, 20) + '...');
      
      if (!googleClientId) {
        alert('Google Client ID bulunamadı!');
        setIsLoading(false);
        return;
      }

      const redirectUrl = window.location.href.split('#')[0];
      console.log('🔗 Redirect URL:', redirectUrl);
      
      // Backend'den Google OAuth URL'ini al
      console.log('📞 Requesting Google OAuth URL from backend...');
      const response = await fetch(`${BACKEND_URL}/api/create-google-auth-url`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          redirectUrl,
          googleClientId,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to create auth URL');
      }

      console.log('✅ Got auth URL from backend');
      console.log('🚀 Redirecting to Google OAuth...');
      
      // Google OAuth'a yönlendir
      window.location.href = data.authUrl;
    } catch (error) {
      console.error('❌ Login failed:', error);
      alert('Login başlatılamadı: ' + (error as Error).message);
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('zkLoginAddress');
    localStorage.removeItem('zkLoginSession');
    setZkLoginAddress(null);
    console.log('✅ Logged out');
    window.location.reload();
  };

  // Eğer zkLogin ile giriş yapılmışsa
  if (zkLoginAddress) {
    return (
      <Flex align="center" gap="2">
        <Text size="2" color="green">
          ✓ Google: {zkLoginAddress.slice(0, 6)}...{zkLoginAddress.slice(-4)}
        </Text>
        <Button
          onClick={handleLogout}
          variant="soft"
          color="red"
          size="1"
        >
          Çıkış
        </Button>
      </Flex>
    );
  }

  return (
    <Button
      onClick={handleGoogleLogin}
      variant="solid"
      color="blue"
      size="3"
      disabled={isLoading}
    >
      {isLoading ? '⏳ Yükleniyor...' : '🔐 Google ile Giriş Yap'}
    </Button>
  );
}
