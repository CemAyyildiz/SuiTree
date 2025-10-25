#!/bin/bash
# Subdomain test için /etc/hosts dosyasını düzenle

echo "🔧 /etc/hosts dosyasına subdomain eklemeleri yapılıyor..."
echo ""

# Mevcut girdileri kontrol et
if grep -q "cem.localhost" /etc/hosts; then
    echo "✅ Subdomain'ler zaten eklendi!"
else
    echo "📝 Yeni subdomain'ler ekleniyor..."
    echo ""
    echo "# SuiTree Local Test Subdomains" | sudo tee -a /etc/hosts
    echo "127.0.0.1 cem.localhost" | sudo tee -a /etc/hosts
    echo "127.0.0.1 alice.localhost" | sudo tee -a /etc/hosts
    echo "127.0.0.1 bob.localhost" | sudo tee -a /etc/hosts
    echo ""
    echo "✅ Subdomain'ler eklendi!"
fi

echo ""
echo "🎉 Artık şu adresleri kullanabilirsin:"
echo "   http://localhost:5173          → Admin Dashboard"
echo "   http://cem.localhost:5173      → Cem'in Profili"
echo "   http://alice.localhost:5173    → Alice'in Profili"

