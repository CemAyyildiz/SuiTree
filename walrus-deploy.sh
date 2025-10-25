#!/bin/bash
# Walrus Deploy Auto-Retry Script for Hackathon

echo "🐘 SuiTree Walrus Deploy - Auto Retry"
echo "======================================"
echo ""

SITE_BUILDER="/Users/cemayyildiz/Desktop/projects/SuiTree/walrus-sites/target/release/site-builder"
CONFIG="/Users/cemayyildiz/Desktop/projects/SuiTree/frontend/site-builder.yaml"
DIST="/Users/cemayyildiz/Desktop/projects/SuiTree/frontend/dist"

MAX_RETRIES=10
RETRY_DELAY=60  # 60 saniye bekle

for i in $(seq 1 $MAX_RETRIES); do
    echo "🔄 Attempt $i of $MAX_RETRIES"
    echo "⏰ $(date)"
    echo ""
    
    $SITE_BUILDER --config $CONFIG publish --epochs 5 $DIST
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ SUCCESS! Site deployed to Walrus!"
        echo "======================================"
        exit 0
    else
        if [ $i -lt $MAX_RETRIES ]; then
            echo ""
            echo "❌ Failed. Waiting $RETRY_DELAY seconds before retry..."
            echo ""
            sleep $RETRY_DELAY
        fi
    fi
done

echo ""
echo "❌ All $MAX_RETRIES attempts failed. Sui testnet is too congested."
echo "Try again later or check https://status.sui.io"
exit 1

