// Enoki Flow Configuration
export const enokiFlowConfig = {
  // Enoki API Key - https://enoki.mystenlabs.com/ adresinden alın
  apiKey: import.meta.env.VITE_ENOKI_API_KEY || '',
  // Network ayarı (önemli!)
  // @ts-ignore - Enoki versiyonlarına göre bu parametrenin adı değişebiliyor
  network: 'testnet',
};

// Debug: API Key kontrolü
if (!import.meta.env.VITE_ENOKI_API_KEY) {
  console.error('⚠️ VITE_ENOKI_API_KEY bulunamadı! Lütfen .env dosyasını kontrol edin.');
} else {
  console.log('✅ Enoki Config:');
  console.log('  - API Key:', import.meta.env.VITE_ENOKI_API_KEY.substring(0, 20) + '...');
  console.log('  - Network: testnet');
}

