"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const campaignController_1 = require("../controllers/campaignController");

const router = express_1.default.Router();

// Create a new campaign
router.post('/create', campaignController_1.CampaignController.createCampaign);

// Get campaign by ID (future)
router.get('/:id', campaignController_1.CampaignController.getCampaign);

// List campaigns (future)
router.get('/', campaignController_1.CampaignController.listCampaigns);

exports.default = router;

