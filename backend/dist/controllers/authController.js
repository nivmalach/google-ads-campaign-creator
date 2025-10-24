"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const googleAdsAuth_1 = require("../utils/googleAdsAuth");
const oauth2_1 = require("../utils/oauth2");
class AuthController {
    static async getAuthUrl(req, res) {
        try {
            const authUrl = oauth2_1.OAuth2Helper.getAuthUrl();
            res.json({ authUrl });
        }
        catch (error) {
            console.error('Error generating auth URL:', error);
            res.status(500).json({ error: 'Failed to generate auth URL' });
        }
    }
    static async handleCallback(req, res) {
        try {
            const { code } = req.query;
            if (!code || typeof code !== 'string') {
                return res.redirect(`${process.env.BASE_PATH || ''}/gacc?error=no_code`);
            }
            const tokens = await oauth2_1.OAuth2Helper.getTokens(code);
            // Initialize Google Ads API with the tokens
            googleAdsAuth_1.GoogleAdsAuth.initialize(
                process.env.GOOGLE_ADS_CLIENT_ID,
                process.env.GOOGLE_ADS_CLIENT_SECRET,
                process.env.GOOGLE_ADS_DEVELOPER_TOKEN
            );
            
            // Redirect back to frontend with tokens
            const redirectUrl = `${process.env.BASE_PATH || ''}/gacc?code=${code}&refresh_token=${tokens.refresh_token || ''}&access_token=${tokens.access_token || ''}`;
            res.redirect(redirectUrl);
        }
        catch (error) {
            console.error('Error handling callback:', error);
            res.redirect(`${process.env.BASE_PATH || ''}/gacc?error=auth_failed`);
        }
    }
    static async listAccounts(req, res) {
        try {
            const { refreshToken } = req.body;
            console.log('listAccounts called, refreshToken provided:', !!refreshToken);
            
            if (!refreshToken) {
                return res.status(400).json({ error: 'Refresh token is required' });
            }
            
            const customerIds = await googleAdsAuth_1.GoogleAdsAuth.getCustomerIds(refreshToken);
            console.log('Customer IDs retrieved:', customerIds);
            
            res.json({ accounts: customerIds, count: customerIds.length });
        }
        catch (error) {
            console.error('Error listing accounts:', error);
            console.error('Error message:', error.message);
            res.status(500).json({ 
                error: 'Failed to list accounts',
                details: error.message 
            });
        }
    }
    static async validateToken(req, res) {
        try {
            const { accessToken } = req.body;
            if (!accessToken) {
                return res.status(400).json({ error: 'Access token is required' });
            }
            const userInfo = await oauth2_1.OAuth2Helper.validateToken(accessToken);
            res.json({ userInfo });
        }
        catch (error) {
            console.error('Error validating token:', error);
            res.status(500).json({ error: 'Token validation failed' });
        }
    }
}
exports.AuthController = AuthController;
