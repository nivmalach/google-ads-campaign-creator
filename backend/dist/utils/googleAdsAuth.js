"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleAdsAuth = void 0;
const google_ads_api_1 = require("google-ads-api");
class GoogleAdsAuth {
    static initialize(clientId, clientSecret, developerToken) {
        if (!this.instance) {
            this.instance = new google_ads_api_1.GoogleAdsApi({
                client_id: clientId,
                client_secret: clientSecret,
                developer_token: developerToken
            });
        }
        return this.instance;
    }
    static getInstance() {
        if (!this.instance) {
            throw new Error('GoogleAdsApi not initialized. Call initialize() first.');
        }
        return this.instance;
    }
    static async getCustomerIds(refreshToken) {
        try {
            const client = this.getInstance();
            const response = await client.listAccessibleCustomers(refreshToken);
            return response.resource_names.map(name => name.split('/').pop() || '');
        }
        catch (error) {
            console.error('Error fetching customer IDs:', error);
            throw error;
        }
    }
}
exports.GoogleAdsAuth = GoogleAdsAuth;
