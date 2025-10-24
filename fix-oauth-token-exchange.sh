#!/bin/bash
# Fix OAuth2 token exchange to include redirect_uri
# Run this on your production server

set -e

echo "🔧 Fixing OAuth2 token exchange..."

cd "$(dirname "$0")"

if [ ! -f "backend/dist/utils/oauth2.js" ]; then
    echo "❌ Error: backend/dist/utils/oauth2.js not found"
    exit 1
fi

# Backup
cp backend/dist/utils/oauth2.js backend/dist/utils/oauth2.js.backup.$(date +%Y%m%d_%H%M%S)
echo "✅ Backup created"

# Create the complete fixed file
cat > backend/dist/utils/oauth2.js << 'EOF'
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OAuth2Helper = void 0;
const googleapis_1 = require("googleapis");
class OAuth2Helper {
    static getAuthUrl() {
        const redirectUri = process.env.OAUTH_REDIRECT_URI || 'https://opsotools.com/gacc/api/auth/callback';
        return this.oauth2Client.generateAuthUrl({
            access_type: 'offline',
            redirect_uri: redirectUri,
            scope: [
                'https://www.googleapis.com/auth/adwords',
                'https://www.googleapis.com/auth/userinfo.profile',
                'https://www.googleapis.com/auth/userinfo.email'
            ],
            prompt: 'consent'
        });
    }
    static async getTokens(code) {
        try {
            const redirectUri = process.env.OAUTH_REDIRECT_URI || 'https://opsotools.com/gacc/api/auth/callback';
            const { tokens } = await this.oauth2Client.getToken({
                code: code,
                redirect_uri: redirectUri
            });
            return tokens;
        }
        catch (error) {
            console.error('Error getting tokens:', error);
            throw error;
        }
    }
    static async validateToken(accessToken) {
        try {
            this.oauth2Client.setCredentials({ access_token: accessToken });
            const oauth2 = googleapis_1.google.oauth2({ version: 'v2', auth: this.oauth2Client });
            const userInfo = await oauth2.userinfo.get();
            return userInfo.data;
        }
        catch (error) {
            console.error('Error validating token:', error);
            throw error;
        }
    }
}
exports.OAuth2Helper = OAuth2Helper;
OAuth2Helper.oauth2Client = new googleapis_1.google.auth.OAuth2(process.env.GOOGLE_ADS_CLIENT_ID, process.env.GOOGLE_ADS_CLIENT_SECRET, process.env.OAUTH_REDIRECT_URI);
EOF

echo "✅ File updated with complete OAuth2 fix"
echo ""
echo "📦 Restarting container..."
docker-compose restart app

echo ""
echo "⏳ Waiting for container to start..."
sleep 5

echo ""
echo "✅ Done! OAuth2 token exchange fixed"
echo ""
echo "🌐 Try the authentication flow again at:"
echo "   https://opsotools.com/gacc"
echo ""
echo "The full OAuth flow should now work:"
echo "  1. Click 'Connect Google Ads Account'"
echo "  2. Authorize with Google"
echo "  3. Get redirected back with tokens"
echo "  4. See your Google Ads accounts!"

