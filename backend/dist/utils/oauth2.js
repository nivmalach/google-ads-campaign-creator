"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OAuth2Helper = void 0;
const googleapis_1 = require("googleapis");
class OAuth2Helper {
    static getAuthUrl() {
        return this.oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: [
                'https://www.googleapis.com/auth/adwords',
                'https://www.googleapis.com/auth/userinfo.profile',
                'https://www.googleapis.com/auth/userinfo.email'
            ],
            prompt: 'consent' // Force to get refresh_token
        });
    }
    static async getTokens(code) {
        try {
            const { tokens } = await this.oauth2Client.getToken(code);
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
