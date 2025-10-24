"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CampaignController = void 0;
const campaignService_1 = require("../services/campaignService");

class CampaignController {
    /**
     * Create a new Display Campaign
     */
    static async createCampaign(req, res) {
        try {
            const { customerId, refreshToken, campaignName, dailyBudget, status, locations, marketingObjective, devices, bidStrategy, bidAmount } = req.body;

            // Validate required fields
            if (!customerId) {
                return res.status(400).json({ 
                    success: false, 
                    error: 'Customer ID is required' 
                });
            }

            if (!refreshToken) {
                return res.status(400).json({ 
                    success: false, 
                    error: 'Refresh token is required' 
                });
            }

            if (!campaignName) {
                return res.status(400).json({ 
                    success: false, 
                    error: 'Campaign name is required' 
                });
            }

            if (!dailyBudget || dailyBudget <= 0) {
                return res.status(400).json({ 
                    success: false, 
                    error: 'Valid daily budget is required' 
                });
            }

            if (!bidStrategy) {
                return res.status(400).json({ 
                    success: false, 
                    error: 'Bid strategy is required' 
                });
            }

            console.log('Campaign creation request:', {
                customerId,
                campaignName,
                dailyBudget,
                status,
                locationCount: locations?.length || 0,
                marketingObjective,
                deviceCount: devices?.length || 0,
                bidStrategy
            });

            // Create the campaign
            const result = await campaignService_1.CampaignService.createDisplayCampaign({
                customerId,
                refreshToken,
                campaignName,
                dailyBudget,
                status: status || 'PAUSED',
                locations: locations || [],
                marketingObjective: marketingObjective || 'WEBSITE_TRAFFIC',
                devices: devices || ['MOBILE', 'DESKTOP', 'TABLET'],
                bidStrategy,
                bidAmount
            });

            res.json(result);
        }
        catch (error) {
            console.error('Error in createCampaign controller:', error);
            res.status(500).json({ 
                success: false,
                error: error.message || 'Failed to create campaign',
                details: error.toString()
            });
        }
    }

    /**
     * Get campaign by ID (placeholder for future)
     */
    static async getCampaign(req, res) {
        res.status(501).json({ 
            success: false, 
            error: 'Not implemented yet' 
        });
    }

    /**
     * List campaigns (placeholder for future)
     */
    static async listCampaigns(req, res) {
        res.status(501).json({ 
            success: false, 
            error: 'Not implemented yet' 
        });
    }
}

exports.CampaignController = CampaignController;

