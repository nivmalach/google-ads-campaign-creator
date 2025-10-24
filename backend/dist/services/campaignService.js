"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CampaignService = void 0;
const googleAdsAuth_1 = require("../utils/googleAdsAuth");

class CampaignService {
    /**
     * Create a Display Campaign in Google Ads
     */
    static async createDisplayCampaign(params) {
        const { customerId, refreshToken, campaignName, dailyBudget, status, locations, bidStrategy, bidAmount } = params;
        
        try {
            console.log('Creating display campaign:', {
                customerId,
                campaignName,
                dailyBudget,
                status,
                locations,
                bidStrategy,
                bidAmount
            });

            // Get Google Ads client
            const client = googleAdsAuth_1.GoogleAdsAuth.getInstance();
            
            // Create a customer instance with credentials
            const customer = client.Customer({
                customer_id: customerId,
                refresh_token: refreshToken
            });

            // Convert daily budget to micros (Google Ads uses micros for currency)
            const budgetMicros = Math.round(dailyBudget * 1_000_000);
            
            // Check if using smart bidding (requires implicit budget without name)
            const isSmartBidding = ['MAXIMIZE_CONVERSIONS', 'TARGET_CPA', 'MAXIMIZE_CONVERSION_VALUE', 'TARGET_ROAS'].includes(bidStrategy);
            
            console.log('Creating campaign budget with amountMicros:', budgetMicros);
            console.log('Bid strategy:', bidStrategy, '| Smart bidding:', isSmartBidding);
            
            // Create budget based on bidding strategy
            // Smart bidding requires implicit budget, manual bidding works with shared budget
            const budgetOperation = isSmartBidding 
                ? {
                    amount_micros: budgetMicros,
                    delivery_method: 'STANDARD',
                    explicitly_shared: false  // Explicitly set as non-shared for smart bidding
                }
                : {
                    name: `${campaignName} Budget ${Date.now()}`,
                    amount_micros: budgetMicros,
                    delivery_method: 'STANDARD',
                    explicitly_shared: true  // Explicitly set as shared for manual bidding
                };
            
            const budgetResponse = await customer.campaignBudgets.create([budgetOperation]);
            
            console.log('Budget response type:', typeof budgetResponse);
            console.log('Budget response:', JSON.stringify(budgetResponse, null, 2));
            
            // Handle different response formats
            let budgetResourceName;
            if (budgetResponse.results && budgetResponse.results.length > 0) {
                budgetResourceName = budgetResponse.results[0].resource_name;
            } else if (budgetResponse.resource_name) {
                budgetResourceName = budgetResponse.resource_name;
            } else if (typeof budgetResponse === 'string') {
                budgetResourceName = budgetResponse;
            } else {
                throw new Error('Unable to extract budget resource name from response');
            }
            console.log('Budget created successfully:', budgetResourceName);

            // Build bidding strategy configuration
            const biddingConfig = this.buildBiddingStrategy(bidStrategy, bidAmount);
            
            // Build location targeting (geo target constants)
            const geoTargets = await this.getGeoTargetConstants(customer, locations);
            
            // Create the campaign matching n8n format exactly
            const campaignData = {
                name: `${campaignName}-${Date.now()}`,
                status: status || 'PAUSED',
                advertising_channel_type: 'DISPLAY',
                campaign_budget: budgetResourceName,
                ...biddingConfig,
                network_settings: {
                    target_google_search: false,
                    target_search_network: false,
                    target_content_network: true,
                    target_partner_search_network: false
                },
                // Required field from n8n working automation
                contains_eu_political_advertising: 'DOES_NOT_CONTAIN_EU_POLITICAL_ADVERTISING'
            };

            console.log('Creating campaign with data:', JSON.stringify(campaignData, null, 2));
            const campaignResponse = await customer.campaigns.create([campaignData]);
            
            console.log('Campaign response type:', typeof campaignResponse);
            console.log('Campaign response:', JSON.stringify(campaignResponse, null, 2));
            
            // Handle different response formats
            let campaignResourceName;
            if (campaignResponse.results && campaignResponse.results.length > 0) {
                campaignResourceName = campaignResponse.results[0].resource_name;
            } else if (campaignResponse.resource_name) {
                campaignResourceName = campaignResponse.resource_name;
            } else if (typeof campaignResponse === 'string') {
                campaignResourceName = campaignResponse;
            } else {
                throw new Error('Unable to extract campaign resource name from response');
            }
            
            const campaignId = campaignResourceName.split('/').pop();
            console.log('Campaign created:', campaignResourceName);

            // Add location targeting if provided
            if (geoTargets.length > 0) {
                console.log('Adding location targeting...');
                await this.addLocationTargeting(customer, campaignResourceName, geoTargets);
            }

            return {
                success: true,
                campaignId: campaignId,
                resourceName: campaignResourceName,
                campaignName: campaignName,
                budgetResourceName: budgetResourceName
            };
        }
        catch (error) {
            console.error('Error creating display campaign:', error);
            
            // Extract meaningful error message
            let errorMessage = 'Failed to create campaign';
            if (error.errors && error.errors.length > 0) {
                errorMessage = error.errors.map(e => e.message).join(', ');
            } else if (error.message) {
                errorMessage = error.message;
            }
            
            throw new Error(errorMessage);
        }
    }

    /**
     * Build bidding strategy configuration based on strategy type
     */
    static buildBiddingStrategy(strategy, bidAmount) {
        switch (strategy) {
            case 'MANUAL_CPC':
                return {
                    manual_cpc: {}  // Empty object like n8n automation
                };
            
            case 'TARGET_CPA':
                if (!bidAmount) throw new Error('Target CPA requires a bid amount');
                return {
                    target_cpa: {
                        target_cpa_micros: Math.round(bidAmount * 1_000_000)
                    }
                };
            
            case 'TARGET_ROAS':
                if (!bidAmount) throw new Error('Target ROAS requires a target value');
                return {
                    target_roas: {
                        target_roas: bidAmount
                    }
                };
            
            case 'MAXIMIZE_CONVERSIONS':
                return {
                    maximize_conversions: {}
                };
            
            case 'MAXIMIZE_CONVERSION_VALUE':
                return {
                    maximize_conversion_value: {}
                };
            
            default:
                return {
                    manual_cpc: {}
                };
        }
    }

    /**
     * Get geo target constants for location names
     */
    static async getGeoTargetConstants(customer, locationNames) {
        if (!locationNames || locationNames.length === 0) {
            return [];
        }

        try {
            // For MVP, we'll use predefined common location IDs
            // In production, you'd query the GeoTargetConstantService
            const locationMap = {
                'united states': '2840',
                'usa': '2840',
                'us': '2840',
                'canada': '2124',
                'united kingdom': '2826',
                'uk': '2826',
                'australia': '2036',
                'germany': '2276',
                'france': '2250',
                'spain': '2724',
                'italy': '2380',
                'japan': '2392',
                'india': '2356',
                'brazil': '2076',
                'mexico': '2484',
                'israel': '2376'
            };

            const geoTargets = [];
            for (const location of locationNames) {
                const locationKey = location.toLowerCase().trim();
                const geoId = locationMap[locationKey];
                
                if (geoId) {
                    geoTargets.push({
                        geo_target_constant: `geoTargetConstants/${geoId}`
                    });
                } else {
                    console.warn(`Location not found in map: ${location}`);
                }
            }

            return geoTargets;
        }
        catch (error) {
            console.error('Error getting geo targets:', error);
            return [];
        }
    }

    /**
     * Add location targeting to campaign
     */
    static async addLocationTargeting(customer, campaignResourceName, geoTargets) {
        try {
            const campaignCriterionOperations = geoTargets.map(geo => ({
                campaign: campaignResourceName,
                location: {
                    geo_target_constant: geo.geo_target_constant
                }
            }));

            console.log('Adding location targeting:', JSON.stringify(campaignCriterionOperations, null, 2));
            await customer.campaignCriteria.create(campaignCriterionOperations);
            console.log(`Added ${geoTargets.length} location targets successfully`);
        }
        catch (error) {
            console.error('Error adding location targeting:', error);
            console.error('Error details:', error.message, error.stack);
            // Don't throw - campaign is already created
        }
    }
}

exports.CampaignService = CampaignService;

