"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleAdsAuth = void 0;
const google_ads_api_1 = require("google-ads-api");
class GoogleAdsAuth {
    static initialize(clientId, clientSecret, developerToken) {
        if (!this.instance) {
            console.log('Initializing Google Ads API with credentials:', {
                clientId: clientId ? `${clientId.substring(0, 10)}...` : 'MISSING',
                clientSecret: clientSecret ? 'SET' : 'MISSING',
                developerToken: developerToken ? `${developerToken.substring(0, 5)}...${developerToken.substring(developerToken.length - 3)}` : 'MISSING'
            });
            this.instance = new google_ads_api_1.GoogleAdsApi({
                client_id: clientId,
                client_secret: clientSecret,
                developer_token: developerToken
            });
            console.log('Google Ads API instance created successfully');
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
            console.log('Fetching accessible customers with refresh token...');
            console.log('Refresh token length:', refreshToken?.length || 0);
            
            // Call listAccessibleCustomers directly on the client
            const response = await client.listAccessibleCustomers(refreshToken);
            console.log('API Response:', JSON.stringify(response, null, 2));
            
            if (!response || !response.resource_names) {
                console.error('No resource_names in response:', response);
                return [];
            }
            
            const customerIds = response.resource_names.map(name => {
                const id = name.split('/').pop() || '';
                console.log('Extracted customer ID:', id);
                return id;
            });
            
            console.log('Total customers found:', customerIds.length);
            return customerIds;
        }
        catch (error) {
            console.error('Error fetching customer IDs:', error);
            if (error.errors && error.errors.length > 0) {
                console.error('Google Ads API Errors:', JSON.stringify(error.errors, null, 2));
                error.errors.forEach((err, index) => {
                    console.error(`Error ${index + 1}:`, {
                        message: err.message,
                        errorCode: err.error_code,
                        details: err
                    });
                });
            }
            console.error('Error message:', error.message);
            console.error('Error stack:', error.stack);
            throw error;
        }
    }
}
exports.GoogleAdsAuth = GoogleAdsAuth;
