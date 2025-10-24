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
                developerToken: developerToken ? 'SET' : 'MISSING'
            });
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
            console.log('Fetching accessible customers with refresh token...');
            
            // Create a customer instance with the refresh token
            const customer = client.Customer({
                customer_id: '0', // Use 0 for listAccessibleCustomers
                refresh_token: refreshToken
            });
            
            console.log('Calling listAccessibleCustomers...');
            const response = await customer.listAccessibleCustomers();
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
            console.error('Error details:', error.message, error.stack);
            throw error;
        }
    }
}
exports.GoogleAdsAuth = GoogleAdsAuth;
