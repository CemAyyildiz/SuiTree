#!/bin/bash
# 🚀 SuiTree - Walrus Deploy Script

set -e  # Exit on error

echo "🌳 SuiTree - Walrus Deploy"
echo "=========================="
echo ""

# Paths
FRONTEND_DIR="/Users/cemayyildiz/Desktop/projects/SuiTree/frontend"
SITE_BUILDER="/Users/cemayyildiz/Desktop/projects/SuiTree/walrus-sites/target/release/site-builder"
SITE_OBJECT_ID="0xf6aaf78cbfc0f6c1d39b677ad5294b01e569265e64edc2b91a2d6a9a2b61f967"

cd "$FRONTEND_DIR"

echo "📦 Building frontend..."
pnpm build

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo ""
echo "🚀 Deploying to Walrus..."
"$SITE_BUILDER" \
  --config sites-config-trwal.yaml \
  update --epochs 1 ./dist "$SITE_OBJECT_ID"

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ SUCCESS! Site deployed to Walrus!"
    echo "🌐 URL: https://suitree.trwal.app"
    echo ""
else
    echo ""
    echo "❌ Deploy failed!"
    exit 1
fi
