import { useEnokiFlow, useZkLogin } from '@mysten/enoki/react';
import { Button, Flex, Text } from '@radix-ui/themes';
import { useState } from 'react';

export function ZkLoginButton() {
  const enokiFlow = useEnokiFlow();
  const zkLogin = useZkLogin();
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      // Google Client ID kontrolü
      const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
      if (!googleClientId) {
        alert('Google Client ID bulunamadı. Lütfen .env dosyasında VITE_GOOGLE_CLIENT_ID ayarlayın.');
        setIsLoading(false);
        return;
      }

      // Google OAuth URL oluştur
      const authUrl = await enokiFlow.createAuthorizationURL({
        provider: 'google',
        clientId: googleClientId,
        redirectUrl: window.location.origin, // Sadece origin, pathname yok (HashRouter kullandığımız için)
        network: 'testnet',
      });

      console.log('Google OAuth URL:', authUrl);
      
      // Google OAuth'a yönlendir
      window.location.href = authUrl;
    } catch (error) {
      console.error('Google login başlatılamadı:', error);
      alert('Login başlatılamadı: ' + (error as Error).message);
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await enokiFlow.logout();
      console.log('Çıkış yapıldı');
      // Sayfayı yenile
      window.location.reload();
    } catch (error) {
      console.error('Çıkış yapılamadı:', error);
    }
  };

  // Eğer zkLogin ile giriş yapılmışsa
  if (zkLogin.address) {
    return (
      <Flex align="center" gap="2">
        <Text size="2" color="green">
          ✓ Google ile bağlı: {zkLogin.address.slice(0, 6)}...{zkLogin.address.slice(-4)}
        </Text>
        <Button
          onClick={handleLogout}
          variant="soft"
          color="red"
          size="1"
        >
          Çıkış Yap
        </Button>
      </Flex>
    );
  }

  // Hiçbir bağlantı yoksa, Google login butonu göster
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
