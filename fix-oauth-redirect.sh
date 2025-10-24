#!/bin/bash
# Fix OAuth2 redirect_uri parameter
# Run this on your production server

set -e

echo "🔧 Fixing OAuth2 redirect_uri parameter..."

cd "$(dirname "$0")"

if [ ! -f "backend/dist/utils/oauth2.js" ]; then
    echo "❌ Error: backend/dist/utils/oauth2.js not found"
    exit 1
fi

# Backup
cp backend/dist/utils/oauth2.js backend/dist/utils/oauth2.js.backup.$(date +%Y%m%d_%H%M%S)
echo "✅ Backup created"

# Fix the getAuthUrl method to include redirect_uri
sed -i "s/static getAuthUrl() {/static getAuthUrl() {\n        const redirectUri = process.env.OAUTH_REDIRECT_URI || 'https:\/\/opsotools.com\/gacc\/api\/auth\/callback';/g" backend/dist/utils/oauth2.js

sed -i "s/return this.oauth2Client.generateAuthUrl({/return this.oauth2Client.generateAuthUrl({\n            redirect_uri: redirectUri,/g" backend/dist/utils/oauth2.js

echo "✅ File updated"
echo ""
echo "📦 Restarting container..."
docker-compose restart app

echo ""
echo "⏳ Waiting for container to start..."
sleep 3

echo ""
echo "✅ Done! OAuth2 redirect_uri fixed"
echo ""
echo "🌐 Try connecting to Google Ads again at:"
echo "   https://opsotools.com/gacc"

